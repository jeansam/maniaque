// Données communes à toutes les pages : chaque modèle parcourt ses pages (pagination sur pages.<type>, alias p)
const { resolve } = require("../../lib/i18n.js");

module.exports = {
  layout: "base.njk",
  permalink: (data) => data.p.url,
  eleventyComputed: {
    lang: (data) => data.p.lang,
    s: (data) => data.p.s,
    t: (data) => resolve(data.ui, data.p.lang),
    language: (data) => data.langs.find((l) => l.code === data.p.lang),
    // La ville par défaut d'une page est celle de sa langue
    city: (data) => Object.values(data.cities).find((c) => c.lang === data.p.lang)
  }
};
