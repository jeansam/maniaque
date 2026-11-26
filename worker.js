// Sur Cloudflare : sert le site généré (_site/) et ne passe par ce code que pour les adresses de run_worker_first
// (wrangler.jsonc) ; les autres sont servies directement.
//
// 1. Accueil (/) : redirection selon la langue. Un cookie maniaque-lang (posé par city.js dès qu'on choisit une
//    langue ou une ville) l'emporte sur le pays : fr → /fr/, pt → /pt/, en → accueil anglais.
//    Sans cookie : France → /fr/, Brésil → /pt/, ailleurs : anglais.
// 2. Portfolio (/portfolio/…, /en/portfolio/…, /pt/portfolio/…, images comprises) : protégé par un mot de passe
//    partagé, le secret PORTFOLIO_PASSWORD (tableau de bord Cloudflare, ou npx wrangler secret put PORTFOLIO_PASSWORD ;
//    en local, fichier .dev.vars). Sans le bon cookie, on sert la page du mot de passe de la langue ; le formulaire
//    renvoie le mot de passe en POST, et un mot de passe juste pose un cookie valable 30 jours.
//    Changer le mot de passe déconnecte tout le monde : le cookie est une signature du mot de passe.
const byCookie = { fr: "/fr/", pt: "/pt/" };
const byCountry = { FR: "/fr/", BR: "/pt/" };

// Mêmes adresses que portfolio et portfolioAccess dans src/_data/routes.js
const PORTFOLIO = { fr: "/portfolio/", en: "/en/portfolio/", pt: "/pt/portfolio/" };
const ACCESS = { fr: "/portfolio/acces/", en: "/en/portfolio/access/", pt: "/pt/portfolio/acesso/" };
const COOKIE = "maniaque-portfolio";
const PRIVATE = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" };

const cookie = (request, name) => (request.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]*)"))?.[1];

function portfolioLang(path) {
  return Object.keys(PORTFOLIO).find((lang) => lang !== "fr" && path.startsWith(PORTFOLIO[lang])) || (path.startsWith(PORTFOLIO.fr) ? "fr" : null);
}

// La signature du mot de passe : c'est elle que garde le cookie, jamais le mot de passe lui-même
async function sign(password) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(COOKIE));
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Une réponse du portfolio : jamais gardée en cache, jamais indexée
function privateResponse(response, status = response.status, extra = {}) {
  const headers = new Headers(response.headers);
  for (const [k, v] of Object.entries({ ...PRIVATE, ...extra })) headers.set(k, v);
  return new Response(response.body, { status, headers });
}

// La page du mot de passe, à l'adresse demandée ; après une erreur, son message est affiché
async function accessPage(request, env, lang, error) {
  let page = await env.ASSETS.fetch(new Request(new URL(ACCESS[lang], request.url)));
  if (error) page = new HTMLRewriter().on("[data-access-error]", { element: (el) => el.removeAttribute("hidden") }).transform(page);
  return privateResponse(page, 401);
}

async function portfolio(request, env, url, lang) {
  if (!env.PORTFOLIO_PASSWORD) return new Response("Portfolio non configuré (secret PORTFOLIO_PASSWORD absent)", { status: 503, headers: PRIVATE });
  const expected = await sign(env.PORTFOLIO_PASSWORD);

  if (request.method === "POST") {
    const form = await request.formData().catch(() => null);
    const given = form && form.get("password");
    if (typeof given === "string" && given && (await sign(given)) === expected) {
      const cookieHeader = `${COOKIE}=${expected}; Path=/; Max-Age=2592000; HttpOnly; Secure; SameSite=Lax`;
      return new Response(null, { status: 303, headers: { ...PRIVATE, Location: new URL(PORTFOLIO[lang], url).href, "Set-Cookie": cookieHeader } });
    }
    // Ralentit les essais en série
    await new Promise((r) => setTimeout(r, 800));
    return accessPage(request, env, lang, true);
  }

  if (cookie(request, COOKIE) !== expected) return accessPage(request, env, lang, false);
  // Déjà connecté : la page du mot de passe n'a plus d'objet
  if (url.pathname === ACCESS[lang]) return Response.redirect(new URL(PORTFOLIO[lang], url).href, 303);
  return privateResponse(await env.ASSETS.fetch(request));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const lang = portfolioLang(url.pathname);
    if (lang) return portfolio(request, env, url, lang);

    if (url.pathname === "/") {
      const lang = cookie(request, "maniaque-lang");
      const target = lang ? byCookie[lang] : byCountry[request.cf?.country];
      if (target) {
        const headers = { Location: new URL(target, url).href, "Cache-Control": "private, no-store", Vary: "Cookie" };
        return new Response(null, { status: 307, headers });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
