// Charge les fichiers YAML d'un dossier de src/content/ (un par cas d'usage, un par article, un par maquette de la vitrine).
// Les cas d'usage et les articles sont rangés dans l'ordre de leur champ « order ».
// Le texte d'un article, en Markdown, est à côté : <article>.fr.md, <article>.en.md, <article>.pt.md
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { LANGS } = require("./i18n.js");

function load(dir) {
  const full = path.join(__dirname, "..", "src", "content", dir);
  return fs.readdirSync(full).filter((f) => f.endsWith(".yaml")).map((f) => {
    const id = path.basename(f, ".yaml");
    return { id, full, data: yaml.load(fs.readFileSync(path.join(full, f), "utf8")) };
  });
}

function items(dir) {
  const list = load(dir).map(({ id, full, data }) => {
    const item = { id, ...data };
    const body = Object.fromEntries(LANGS.map((lang) => [lang, path.join(full, `${id}.${lang}.md`)]).filter(([, file]) => fs.existsSync(file)).map(([lang, file]) => [lang, fs.readFileSync(file, "utf8")]));
    if (Object.keys(body).length) item.body = body;
    return item;
  });
  list.sort((a, b) => a.order - b.order);
  return Object.fromEntries(list.map((item) => [item.id, item]));
}

// Les textes de chaque fichier, sans ordre ni identifiant ajouté (maquettes de la vitrine)
items.texts = (dir) => Object.fromEntries(load(dir).map(({ id, data }) => [id, data]));

module.exports = items;
