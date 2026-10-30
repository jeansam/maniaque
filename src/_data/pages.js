// Chaque page générée : son adresse, sa langue et ses textes. Une page par langue ; pour les cas d'usage et
// les articles, une page par élément et par langue. Les textes d'un type de page sont dans strings/<type>.yaml,
// ceux d'un cas d'usage ou d'un article dans son propre fichier (src/content/).
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { LANGS, resolve } = require("../../lib/i18n.js");
const routes = require("./routes.js");
const usecases = require("./usecases.js");
const articles = require("./articles.js");

const strings = (type) => yaml.load(fs.readFileSync(path.join(__dirname, "strings", type + ".yaml"), "utf8"));

function single(type) {
  const s = strings(type);
  return LANGS.map((lang) => ({ type, key: type, lang, url: routes[type][lang], s: resolve(s, lang) }));
}
function each(type, items) {
  const shared = strings(type);
  return Object.values(items).flatMap((item) => LANGS.map((lang) => {
    const key = type + ":" + item.id;
    return { type, key, id: item.id, lang, url: routes[key][lang], s: resolve({ ...shared, ...item.strings }, lang) };
  }));
}

module.exports = {
  home: single("home"),
  offer: single("offer"),
  usecaseIndex: single("usecaseIndex"),
  usecase: each("usecase", usecases),
  about: single("about"),
  articleIndex: single("articleIndex"),
  article: each("article", articles),
  legal: single("legal")
};
