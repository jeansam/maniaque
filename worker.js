// Sur Cloudflare : sert le site généré (_site/) et, sur l'accueil (/) seulement, redirige selon la langue
// (voir run_worker_first dans wrangler.jsonc ; les autres adresses sont servies sans passer par ce code).
// Un cookie maniaque-lang (posé par city.js dès qu'on choisit une langue ou une ville) l'emporte sur le pays :
// fr → /fr/, pt → /pt/, en → accueil anglais. Sans cookie : France → /fr/, Brésil → /pt/, ailleurs : anglais.
const byCookie = { fr: "/fr/", pt: "/pt/" };
const byCountry = { FR: "/fr/", BR: "/pt/" };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      const lang = (request.headers.get("Cookie") || "").match(/(?:^|;\s*)maniaque-lang=([^;]*)/)?.[1];
      const target = lang ? byCookie[lang] : byCountry[request.cf?.country];
      if (target) {
        const headers = { Location: new URL(target, url).href, "Cache-Control": "private, no-store", Vary: "Cookie" };
        return new Response(null, { status: 307, headers });
      }
    }
    return env.ASSETS.fetch(request);
  }
};
