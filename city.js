// Ville choisie : lien d'audit, prix et devise, mentions géographiques et personne de l'À propos.
// La langue, elle, est celle de la page (/fr/, /, /pt/ : l'accueil anglais est à la racine) : changer de langue ne change pas de ville.
// C'est ici, et seulement ici, qu'on change le lien d'audit et les prix de chaque ville : les liens
// et prix écrits dans le HTML ne servent que si le JavaScript ne se charge pas.
(function () {
  var CITIES = {
    marseille: {
      name: { fr: "Marseille", en: "Marseille", pt: "Marselha" },
      // Notre-Dame de la Garde : la basilique sur sa colline, le clocher et la Bonne Mère au sommet
      landmark: '<path d="M2 21c3-2.2 6.5-3 10-3s7 .8 10 3"/><path d="M6 18.6V13.5l2.5-2 2.5 2v4.6"/><path d="M11 18.2V9h4v9.2"/><path d="M11 9l2-2 2 2"/><path d="M13 7V4.2"/><circle cx="13" cy="3" r="1"/>',
      person: { name: "Jean-Sam", photo: "/images/avatar-jean-samuel.webp" },
      lang: "fr",
      book: "https://calendar.app.google/vFyLbndCK2tUXYibA",
      currency: "EUR",
      prices: { monthly: 490, first: 2500, maintenance: 49, hosting: 50, none: 0 }
    },
    "sao-paulo": {
      name: { fr: "São Paulo", en: "São Paulo", pt: "São Paulo" },
      // MASP : la grande boîte suspendue entre ses deux portiques
      landmark: '<path d="M2 20h20"/><path d="M4.5 20V7.5h15V20"/><rect x="4.5" y="9.5" width="15" height="5"/><path d="M8 12h1.5M11.25 12h1.5M14.5 12H16"/>',
      person: { name: "Eliakim", photo: "/images/avatar-eliakim-oliveira.webp" },
      lang: "pt",
      book: "https://wa.me/5511936207406", // WhatsApp, en attendant un agenda
      currency: "BRL",
      prices: { monthly: 2900, first: 15000, maintenance: 290, hosting: 300, none: 0 }
    },
    johannesburg: {
      name: { fr: "Johannesbourg", en: "Johannesburg", pt: "Joanesburgo" },
      // Tour Hillbrow : le fût élancé, la nacelle et l'antenne
      landmark: '<path d="M8.5 21 11 16V10m2 0v6l2.5 5"/><path d="M6 21h12"/><rect x="9" y="6.5" width="6" height="3.5" rx="1"/><path d="M10 6.5h4M12 6.5V2"/>',
      person: { name: "Nthuseni", photo: "/images/avatar-nthuseni-mathaga.webp" },
      lang: "en",
      book: "https://www.linkedin.com/in/nmathaga/", // LinkedIn de Nthuseni, en attendant un agenda
      currency: "ZAR",
      prices: { monthly: 9900, first: 50000, maintenance: 990, hosting: 1000, none: 0 }
    }
  };
  var KEY = "maniaque-city";
  var root = document.documentElement;
  var pageLang = (root.lang || "fr").slice(0, 2);

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(id) { try { localStorage.setItem(KEY, id); } catch (e) {} }
  // Langue choisie à la main : un cookie que Vercel lit sur l'accueil (vercel.json) pour ne plus
  // rediriger selon le pays du visiteur
  function saveLang(lang) { document.cookie = "maniaque-lang=" + lang.slice(0, 2) + "; path=/; max-age=31536000; SameSite=Lax"; }

  // Un lien partagé (?ville=sao-paulo) l'emporte, puis le choix enregistré, puis la ville par défaut de la page
  var params = new URLSearchParams(location.search);
  var asked = params.get("ville") || params.get("city");
  if (asked && CITIES[asked]) {
    save(asked);
    params.delete("ville"); params.delete("city");
    var qs = params.toString();
    history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
  }
  var stored = read();
  var id = CITIES[asked] ? asked : CITIES[stored] ? stored : root.getAttribute("data-city");
  if (!CITIES[id]) id = "marseille";
  // La langue ne fixe la ville qu'à la première page vue ; ensuite, seul le menu des villes la change
  if (id !== stored) save(id);
  var city = CITIES[id];
  // Posé tout de suite : les blocs propres à une autre ville ne s'affichent jamais, même un instant
  root.setAttribute("data-city", id);

  function apply() {
    var fmt = new Intl.NumberFormat(root.lang || "fr", {
      style: "currency", currency: city.currency, currencyDisplay: city.currency === "ZAR" ? "code" : "narrowSymbol", maximumFractionDigits: 0
    });
    document.querySelectorAll("[data-price]").forEach(function (el) {
      var amount = city.prices[el.getAttribute("data-price")];
      if (amount !== undefined) el.textContent = fmt.format(amount);
    });
    document.querySelectorAll("a[data-book]").forEach(function (a) { a.href = city.book; });
    // Changer de langue garde la ville, même si le navigateur n'a pas pu l'enregistrer
    document.querySelectorAll(".picker-lang .picker-menu a").forEach(function (a) {
      var url = new URL(a.href, location.href);
      url.searchParams.set("ville", id);
      a.href = url.pathname + url.search + url.hash;
      a.addEventListener("click", function () { saveLang(a.getAttribute("hreflang")); });
    });
    document.querySelectorAll("[data-city-name]").forEach(function (el) { el.textContent = city.name[pageLang]; });
    // La personne qui répond dans cette ville, au-dessus de la phrase d'accroche
    document.querySelectorAll("[data-person-name]").forEach(function (el) { el.textContent = city.person.name; });
    document.querySelectorAll("img[data-person-photo]").forEach(function (img) { img.src = city.person.photo; });
    // Sur la carte de l'accueil, chaque ville montre sa propre personne
    document.querySelectorAll("[data-person-of]").forEach(function (el) {
      var other = CITIES[el.getAttribute("data-person-of")] || city;
      el.querySelectorAll("[data-person-name]").forEach(function (n) { n.textContent = other.person.name; });
      el.querySelectorAll("img[data-person-photo]").forEach(function (img) { img.src = other.person.photo; });
      el.addEventListener("click", function () { saveLang(other.lang); });
    });
    document.querySelectorAll("[data-set-city]").forEach(function (a) {
      var current = a.getAttribute("data-set-city") === id;
      if (current) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      // Dans le menu des villes, le monument de la ville dessiné devant son nom
      var other = CITIES[a.getAttribute("data-set-city")];
      if (other && a.closest(".picker-city")) {
        a.insertAdjacentHTML("afterbegin", '<svg class="landmark" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + other.landmark + "</svg>");
      }
      // Choisir une ville l'enregistre ; le lien mène à la page dans la langue de cette ville
      a.addEventListener("click", function () {
        var chosen = a.getAttribute("data-set-city");
        save(chosen);
        if (CITIES[chosen]) saveLang(CITIES[chosen].lang);
      });
    });

    // Menus flottants (ville, langue) : clic pour ouvrir, clic à l'extérieur ou Échap pour fermer
    var pickers = document.querySelectorAll(".picker");
    function close(except) {
      pickers.forEach(function (p) {
        if (p === except) return;
        p.classList.remove("is-open");
        p.querySelector(".picker-btn").setAttribute("aria-expanded", "false");
      });
    }
    pickers.forEach(function (p) {
      var btn = p.querySelector(".picker-btn");
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = !p.classList.contains("is-open");
        close(p);
        p.classList.toggle("is-open", open);
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
    document.addEventListener("click", function (e) {
      var inside = e.target.closest && e.target.closest(".picker");
      close(inside);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var open = document.querySelector(".picker.is-open");
      if (open) { close(); open.querySelector(".picker-btn").focus(); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
