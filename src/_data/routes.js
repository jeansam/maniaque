// L'adresse de chaque page dans chaque langue : une page « clé » (offer, about…) a une adresse par langue.
// Les cas d'usage et les articles ajoutent la leur (« usecase:crm »), faite de l'adresse de leur liste et de leur slug.
const usecases = require("./usecases.js");
const articles = require("./articles.js");

const routes = {
  home: { fr: "/fr/", en: "/", pt: "/pt/" },
  offer: { fr: "/offre/", en: "/en/offer/", pt: "/pt/oferta/" },
  usecaseIndex: { fr: "/cas-d-usage/", en: "/en/use-cases/", pt: "/pt/casos-de-uso/" },
  about: { fr: "/a-propos/", en: "/en/about/", pt: "/pt/sobre/" },
  articleIndex: { fr: "/articles/", en: "/en/articles/", pt: "/pt/artigos/" },
  legal: { fr: "/mentions-legales.html", en: "/en/legal-notice/", pt: "/pt/aviso-legal/" }
};
for (const [list, items, type] of [["usecaseIndex", usecases, "usecase"], ["articleIndex", articles, "article"]]) {
  for (const [id, item] of Object.entries(items)) {
    routes[type + ":" + id] = Object.fromEntries(Object.entries(item.slug).map(([lang, slug]) => [lang, routes[list][lang] + slug + "/"]));
  }
}
module.exports = routes;
