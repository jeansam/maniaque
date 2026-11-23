// Données communes à toutes les pages : chaque modèle parcourt ses pages (pagination sur pages.<type>, alias p)
const { resolve } = require("../../lib/i18n.js");

module.exports = {
  layout: "layouts/page.njk",
  permalink: (data) => data.p.url,
  eleventyComputed: {
    lang: (data) => data.p.lang,
    s: (data) => data.p.s,
    t: (data) => resolve(data.ui, data.p.lang),
    language: (data) => data.langs.find((l) => l.code === data.p.lang),
    // La ville d'une page : celle de son adresse (/en/offer/marseille/), sinon, par défaut, celle de sa langue
    city: (data) => data.cities[data.p.cityId] || Object.values(data.cities).find((c) => c.lang === data.p.lang)
  }
};
