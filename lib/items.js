// Charge les fichiers YAML d'un dossier de src/content/ (un par cas d'usage, un par article), dans l'ordre de leur champ « order ».
// Le texte d'un article, en Markdown, est à côté : <article>.fr.md, <article>.en.md, <article>.pt.md
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

module.exports = function items(dir) {
  const full = path.join(__dirname, "..", "src", "content", dir);
  const list = fs.readdirSync(full).filter((f) => f.endsWith(".yaml")).map((f) => {
    const id = path.basename(f, ".yaml");
    const item = { id, ...yaml.load(fs.readFileSync(path.join(full, f), "utf8")) };
    const body = Object.fromEntries(["fr", "en", "pt"].map((lang) => [lang, path.join(full, `${id}.${lang}.md`)]).filter(([, file]) => fs.existsSync(file)).map(([lang, file]) => [lang, fs.readFileSync(file, "utf8")]));
    if (Object.keys(body).length) item.body = body;
    return item;
  });
  list.sort((a, b) => a.order - b.order);
  return Object.fromEntries(list.map((item) => [item.id, item]));
};
