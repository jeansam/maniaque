const yaml = require("js-yaml");
const cities = require("./src/_data/cities.js");
const { resolve } = require("./lib/i18n.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  // Les textes contiennent du HTML (liens, mise en forme) : on ne les échappe pas ; une clé manquante est une erreur
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: false, throwOnUndefined: true });
  eleventyConfig.addFilter("values", (obj) => Object.values(obj));
  eleventyConfig.addFilter("find", (list, code) => list.find((item) => item.code === code));
  // Un texte { fr, en, pt } dans la langue demandée (pour les données d'une autre page : cas d'usage, articles)
  eleventyConfig.addFilter("tr", (value, lang) => resolve(value, lang));
  // Un nombre écrit à la façon de la langue (7,5 en français, 7.5 en anglais)
  const locales = { fr: "fr", en: "en", pt: "pt-BR" };
  eleventyConfig.addFilter("number", (n, lang) => new Intl.NumberFormat(locales[lang]).format(n));

  // Fichiers servis tels quels (styles, scripts, images, favicon)
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

  // Sans JavaScript, la page montre les prix et le lien d'audit de sa ville par défaut (data-city) ;
  // city.js les remplace ensuite par ceux de la ville choisie
  eleventyConfig.addTransform("city-defaults", function (html) {
    if (!(this.page.outputPath || "").endsWith(".html")) return html;
    const m = html.match(/<html lang="([^"]+)" data-city="([^"]+)">/);
    if (!m) return html;
    const city = cities[m[2]];
    const fmt = new Intl.NumberFormat(m[1], { style: "currency", currency: city.currency, currencyDisplay: city.currencyDisplay, maximumFractionDigits: 0 });
    return html
      .replace(/<span data-price="(\w+)"><\/span>/g, (_, key) => `<span data-price="${key}">${fmt.format(city.prices[key])}</span>`)
      .replace(/<a data-book /g, `<a data-book href="${city.book}" `);
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk"
  };
};
