// Les villes : c'est ici, et seulement ici, qu'on change par ville le lien d'audit, les prix et la devise,
// et la personne qui y répond. Ces données servent à la fois au site généré (valeurs affichées sans
// JavaScript) et à city.js (ville choisie dans le navigateur). L'ordre est celui du menu des villes.

// Paliers du forfait de demandes fonctionnelles : nombre de demandes par mois, et nombre de fois que
// le palier (step) s'ajoute à l'abonnement de base. Les textes de chaque palier sont dans offer.yaml (tiers).
const TIERS = [{ requests: 3, steps: 1 }, { requests: 6, steps: 2 }, { requests: 10, steps: 3 }, { requests: 20, steps: 6 }];

// Les prix d'une ville, à partir de quelques montants ; chaque clé s'affiche avec data-price="<clé>"
// - firstMin, firstMax : fourchette de la première version
// - base : abonnement de base (hébergement, maintenance, retouches)
// - request : une demande fonctionnelle à l'unité
// - hosting : coûts d'hébergement inclus dans l'abonnement, par mois
// - tier<n> : forfait mensuel jusqu'à n demandes ; perRequest<n> : ce que coûte alors une demande ;
//   unitTotal<n> : ce que coûteraient le même mois l'abonnement de base et n demandes à l'unité
function pricing({ firstMin, firstMax, base, step, request, hosting }) {
  const prices = { firstMin, firstMax, base, request, hosting };
  for (const { requests: n, steps } of TIERS) {
    prices["tier" + n] = base + step * steps;
    prices["perRequest" + n] = Math.round((step * steps) / n);
    prices["unitTotal" + n] = base + request * n;
  }
  return prices;
}

// Monnaies au choix d'une ville : à chacune son taux, combien vaut 1 unité de la devise de la ville.
// Les taux sont dans rates.json, mis à jour chaque semaine par lib/update-rates.js
// (.github/workflows/rates.yml) ; une monnaie sans taux arrête la génération
const RATES = require("./rates.json");
function withRates(base, currencies) {
  return currencies.map((c) => {
    if (c.code === base) return { ...c, rate: 1 };
    const rate = RATES.rates[base] && RATES.rates[base][c.code];
    if (!rate) throw new Error(`Taux ${base} → ${c.code} absent de src/_data/rates.json (lancer node lib/update-rates.js)`);
    return { ...c, rate };
  });
}

module.exports = {
  marseille: {
    id: "marseille",
    name: { fr: "Marseille", en: "Marseille", pt: "Marselha" },
    person: {
      name: "Jean-Sam",
      fullName: "Jean-Samuel Jéquier",
      photo: "/images/avatar-jean-samuel.webp",
      portrait: "/images/jean-samuel.webp",
      linkedin: "https://www.linkedin.com/in/jsjequier"
    },
    // Sur la carte du monde de l'accueil : position du point et côté où s'ouvre la fiche
    map: { anchor: "center", x: "51.49%", y: "28.66%" },
    lang: "fr",
    book: "https://calendar.app.google/vFyLbndCK2tUXYibA",
    currency: "EUR",
    currencyDisplay: "narrowSymbol",
    // Monnaies au choix du visiteur, au-dessus des tarifs (city.js). Les prix restent fixés en euros :
    // les autres monnaies en sont la conversion aux taux de rates.json, mis à jour chaque semaine
    currencies: withRates("EUR", [
      { code: "EUR", label: "€" },
      { code: "GBP", label: "£" },
      { code: "USD", label: "$" },
      { code: "BTC", label: "₿" }
    ]),
    prices: pricing({ firstMin: 1000, firstMax: 4000, base: 109, step: 100, request: 89, hosting: 50 })
  },
  "sao-paulo": {
    id: "sao-paulo",
    name: { fr: "São Paulo", en: "São Paulo", pt: "São Paulo" },
    person: {
      name: "Eliakim",
      fullName: "Eliakim Oliveira",
      photo: "/images/avatar-eliakim-oliveira.webp",
      portrait: "/images/eliakim-oliveira.webp",
      linkedin: "https://www.linkedin.com/in/eliakim-oliveira/"
    },
    // Sur la carte du monde de l'accueil : position du point et côté où s'ouvre la fiche
    map: { anchor: "start", x: "37.05%", y: "75.74%" },
    lang: "pt",
    book: "https://wa.me/5511936207406", // WhatsApp, en attendant un agenda
    currency: "BRL",
    currencyDisplay: "narrowSymbol",
    prices: pricing({ firstMin: 6000, firstMax: 24000, base: 649, step: 600, request: 539, hosting: 300 })
  },
  johannesburg: {
    id: "johannesburg",
    name: { fr: "Johannesbourg", en: "Johannesburg", pt: "Joanesburgo" },
    person: {
      name: "Nthuseni",
      fullName: "Nthuseni Mathaga",
      photo: "/images/avatar-nthuseni-mathaga.webp",
      portrait: "/images/nthuseni-mathaga.webp",
      linkedin: "https://www.linkedin.com/in/nmathaga/"
    },
    // Sur la carte du monde de l'accueil : position du point et côté où s'ouvre la fiche
    map: { anchor: "end", x: "57.79%", y: "77.61%" },
    lang: "en",
    book: "https://calendly.com/nmathaga/30min",
    currency: "ZAR",
    currencyDisplay: "code",
    prices: pricing({ firstMin: 20000, firstMax: 80000, base: 2190, step: 2000, request: 1790, hosting: 1000 })
  }
};
