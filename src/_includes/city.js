// Ville choisie : lien d'audit, prix et devise, mentions géographiques et personne de l'À propos.
// La langue, elle, est celle de la page (/fr/, /, /pt/ : l'accueil anglais est à la racine) : changer de langue ne change pas de ville.
// Ce code devient /city.js avec les villes de src/_data/cities.js (CITIES), qu'y ajoute src/city.njk.
// Les liens et prix écrits dans le HTML ne servent que si le JavaScript ne se charge pas.
var KEY = "maniaque-city";
var root = document.documentElement;
var pageLang = (root.lang || "fr").slice(0, 2);

function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
function save(id) { try { localStorage.setItem(KEY, id); } catch (e) {} }
// Langue choisie à la main : un cookie que Vercel lit sur l'accueil (vercel.json) pour ne plus
// rediriger selon le pays du visiteur
function saveLang(lang) { document.cookie = "maniaque-lang=" + lang.slice(0, 2) + "; path=/; max-age=31536000; SameSite=Lax"; }

// La ville de l'adresse de la page (/en/offer/marseille/, data-city-fixed) l'emporte, puis un lien
// partagé (?ville=sao-paulo), puis le choix enregistré, puis la ville par défaut de la page (celle de sa langue)
var fixed = root.hasAttribute("data-city-fixed");
var params = new URLSearchParams(location.search);
var asked = fixed ? root.getAttribute("data-city") : params.get("ville") || params.get("city");
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

// Monnaie choisie (villes qui en proposent plusieurs : city.currencies) : les prix restent fixés
// dans la devise de la ville et sont convertis aux taux de src/_data/rates.json, mis à jour chaque semaine
var CURRENCY_KEY = "maniaque-currency";
var rates = {};
(city.currencies || []).forEach(function (c) { rates[c.code] = c.rate; });
rates[city.currency] = 1;
var currency = (function () { try { return localStorage.getItem(CURRENCY_KEY); } catch (e) { return null; } })();
if (!rates[currency]) currency = city.currency;

function formatPrice(amount) {
  var lang = root.lang || "fr";
  if (currency === city.currency) {
    return new Intl.NumberFormat(lang, {
      style: "currency", currency: city.currency, currencyDisplay: city.currencyDisplay, maximumFractionDigits: 0
    }).format(amount);
  }
  var converted = amount * rates[currency];
  // Le bitcoin n'a pas de symbole dans Intl : son code, puis ₿ à sa place, à trois chiffres significatifs
  if (currency === "BTC") {
    return new Intl.NumberFormat(lang, {
      style: "currency", currency: "BTC", currencyDisplay: "code", maximumSignificantDigits: 3
    }).format(converted).replace("BTC", "₿");
  }
  return new Intl.NumberFormat(lang, {
    style: "currency", currency: currency, currencyDisplay: "narrowSymbol", maximumFractionDigits: 0
  }).format(Math.round(converted));
}

function renderPrices() {
  document.querySelectorAll("[data-price]").forEach(function (el) {
    var amount = city.prices[el.getAttribute("data-price")];
    if (amount !== undefined) el.textContent = formatPrice(amount);
  });
  document.querySelectorAll("[data-currencies] [data-currency]").forEach(function (b) {
    b.setAttribute("aria-pressed", b.getAttribute("data-currency") === currency ? "true" : "false");
  });
}

// Le sélecteur de monnaie de la ville (section Tarifs), seulement avec JavaScript
function setupCurrencies() {
  if (!city.currencies) return;
  document.querySelectorAll('[data-currencies][data-city-only="' + id + '"]').forEach(function (group) {
    group.hidden = false;
    group.querySelectorAll("[data-currency]").forEach(function (b) {
      b.addEventListener("click", function () {
        currency = b.getAttribute("data-currency");
        try { localStorage.setItem(CURRENCY_KEY, currency); } catch (e) {}
        renderPrices();
      });
    });
  });
}

function apply() {
  setupCurrencies();
  renderPrices();
  document.querySelectorAll("a[data-book]").forEach(function (a) { a.href = city.book; });
  // Changer de langue garde la ville, même si le navigateur n'a pas pu l'enregistrer
  // (sur une page de ville, le lien mène déjà à la même ville dans l'autre langue)
  document.querySelectorAll(".picker-lang .picker-menu a").forEach(function (a) {
    if (!fixed) {
      var url = new URL(a.href, location.href);
      url.searchParams.set("ville", id);
      a.href = url.pathname + url.search + url.hash;
    }
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
    // Choisir une ville l'enregistre ; le lien mène à la page dans la langue de cette ville
    a.addEventListener("click", function () {
      var chosen = a.getAttribute("data-set-city");
      save(chosen);
      if (CITIES[chosen]) saveLang(CITIES[chosen].lang);
    });
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
else apply();
