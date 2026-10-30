// Les villes : c'est ici, et seulement ici, qu'on change par ville le lien d'audit, les prix et la devise,
// et la personne qui y répond. Ces données servent à la fois au site généré (valeurs affichées sans
// JavaScript) et à city.js (ville choisie dans le navigateur). L'ordre est celui du menu des villes.
module.exports = {
  marseille: {
    id: "marseille",
    name: { fr: "Marseille", en: "Marseille", pt: "Marselha" },
    person: { name: "Jean-Sam", photo: "/images/avatar-jean-samuel.webp" },
    lang: "fr",
    book: "https://calendar.app.google/vFyLbndCK2tUXYibA",
    currency: "EUR",
    currencyDisplay: "narrowSymbol",
    prices: { monthly: 490, first: 2500, maintenance: 49, hosting: 50, none: 0 }
  },
  "sao-paulo": {
    id: "sao-paulo",
    name: { fr: "São Paulo", en: "São Paulo", pt: "São Paulo" },
    person: { name: "Eliakim", photo: "/images/avatar-eliakim-oliveira.webp" },
    lang: "pt",
    book: "https://wa.me/5511936207406", // WhatsApp, en attendant un agenda
    currency: "BRL",
    currencyDisplay: "narrowSymbol",
    prices: { monthly: 2900, first: 15000, maintenance: 290, hosting: 300, none: 0 }
  },
  johannesburg: {
    id: "johannesburg",
    name: { fr: "Johannesbourg", en: "Johannesburg", pt: "Joanesburgo" },
    person: { name: "Nthuseni", photo: "/images/avatar-nthuseni-mathaga.webp" },
    lang: "en",
    book: "https://www.linkedin.com/in/nmathaga/", // LinkedIn de Nthuseni, en attendant un agenda
    currency: "ZAR",
    currencyDisplay: "code",
    prices: { monthly: 9900, first: 50000, maintenance: 990, hosting: 1000, none: 0 }
  }
};
