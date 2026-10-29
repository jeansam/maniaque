// Ville choisie : lien d'audit, prix et devise, mentions géographiques et personne de l'À propos.
// La langue, elle, est celle de la page (/, /en/, /pt/) : changer de langue ne change pas de ville.
// C'est ici, et seulement ici, qu'on change le lien d'audit et les prix de chaque ville : les liens
// et prix écrits dans le HTML ne servent que si le JavaScript ne se charge pas.
(function () {
  var CITIES = {
    marseille: {
      name: { fr: "Marseille", en: "Marseille", pt: "Marselha" },
      lang: "fr",
      book: "https://calendar.app.google/vFyLbndCK2tUXYibA",
      currency: "EUR",
      prices: { monthly: 490, first: 2500, maintenance: 49, hosting: 50, none: 0 }
    },
    "sao-paulo": {
      name: { fr: "São Paulo", en: "São Paulo", pt: "São Paulo" },
      lang: "pt",
      book: "https://wa.me/5511936207406", // WhatsApp, en attendant un agenda
      currency: "BRL",
      prices: { monthly: 2900, first: 15000, maintenance: 290, hosting: 300, none: 0 }
    },
    johannesburg: {
      name: { fr: "Johannesbourg", en: "Johannesburg", pt: "Joanesburgo" },
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
    document.querySelectorAll("[data-city-name]").forEach(function (el) { el.textContent = city.name[pageLang]; });
    document.querySelectorAll("[data-set-city]").forEach(function (a) {
      var current = a.getAttribute("data-set-city") === id;
      if (current) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      // Choisir une ville l'enregistre ; le lien mène à la page dans la langue de cette ville
      a.addEventListener("click", function () { save(a.getAttribute("data-set-city")); });
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
