const yaml = require("js-yaml");
const cities = require("./src/_data/cities.js");

module.exports = function (eleventyConfig) {
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));
  // Les textes contiennent du HTML (liens, mise en forme) : on ne les échappe pas ; une clé manquante est une erreur
  eleventyConfig.setNunjucksEnvironmentOptions({ autoescape: false, throwOnUndefined: true });
  eleventyConfig.addFilter("values", (obj) => Object.values(obj));
  eleventyConfig.addFilter("find", (list, code) => list.find((item) => item.code === code));

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
