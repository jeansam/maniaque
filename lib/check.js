// Vérifie les sources avant la génération (npm run check, lancé aussi par npm run build) :
// - chaque texte traduit existe dans toutes les langues (fr: null pour un texte absent exprès d'une langue)
// - chaque cas d'usage a sa maquette et son icône, chaque maquette de la vitrine ses textes, et l'inverse
// - chaque article a son texte et son illustration dans chaque langue
// - deux pages n'ont jamais la même adresse
// Affiche tous les problèmes trouvés, puis échoue s'il y en a.
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const { LANGS } = require("./i18n.js");
const items = require("./items.js");

const src = path.join(__dirname, "..", "src");
const problems = [];
const exists = (...p) => fs.existsSync(path.join(src, ...p));
const ids = (dir, ext) => fs.readdirSync(path.join(src, dir)).filter((f) => f.endsWith(ext) && !f.slice(0, -ext.length).includes(".")).map((f) => f.slice(0, -ext.length));

// Un objet dont toutes les clés sont des langues est un texte traduit : il lui faut toutes les langues
function translations(value, file, where = "") {
  if (Array.isArray(value)) return value.forEach((v, i) => translations(v, file, `${where}[${i}]`));
  if (!value || typeof value !== "object") return;
  const keys = Object.keys(value);
  if (keys.length && keys.every((k) => LANGS.includes(k))) {
    const missing = LANGS.filter((l) => !keys.includes(l));
    if (missing.length) problems.push(`${file}, ${where} : pas de texte en ${missing.join(", ")}`);
    return;
  }
  for (const k of keys) translations(value[k], file, where ? `${where}.${k}` : k);
}
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".yaml")) translations(yaml.load(fs.readFileSync(p, "utf8")), path.relative(src, p));
  }
})(src);

// Un fichier d'un côté sans son pendant de l'autre
function pairs(a, b, what) {
  const [listA, listB] = [ids(...a), ids(...b)];
  for (const id of listA) if (!listB.includes(id)) problems.push(`${what} « ${id} » : ${a[0]}/${id}${a[1]} n'a pas de ${b[0]}/${id}${b[1]}`);
  for (const id of listB) if (!listA.includes(id)) problems.push(`${what} « ${id} » : ${b[0]}/${id}${b[1]} n'a pas de ${a[0]}/${id}${a[1]}`);
}
pairs(["content/usecases", ".yaml"], ["_includes/usecases", ".njk"], "Cas d'usage");
for (const id of ids("content/usecases", ".yaml")) if (!exists("_includes", "icons", id + ".svg")) problems.push(`Cas d'usage « ${id} » : pas d'icône _includes/icons/${id}.svg`);
pairs(["content/showcase", ".yaml"], ["_includes/showcase", ".njk"], "Maquette de la vitrine");

const routes = require("../src/_data/routes.js");
for (const [id, item] of Object.entries(items("articles"))) {
  for (const lang of LANGS) {
    if (!(item.body || {})[lang]) problems.push(`Article « ${id} » : pas de texte content/articles/${id}.${lang}.md`);
    const url = (routes["article:" + id] || {})[lang];
    for (const ext of ["webp", "png"]) if (url && !exists("static", url, "illustration." + ext)) problems.push(`Article « ${id} » : pas d'illustration static${url}illustration.${ext}`);
  }
}

// Une adresse par page et par langue, jamais deux fois la même
const seen = {};
for (const [key, urls] of Object.entries(routes)) {
  for (const lang of LANGS) {
    const url = urls[lang];
    if (!url) problems.push(`Page « ${key} » : pas d'adresse en ${lang}`);
    else if (seen[url]) problems.push(`Adresse ${url} donnée à « ${seen[url]} » et à « ${key} » (${lang})`);
    else seen[url] = key;
  }
}

if (problems.length) {
  console.error(`Vérification des sources : ${problems.length} problème(s)\n- ` + problems.join("\n- "));
  process.exit(1);
}
console.log("Vérification des sources : tout est en ordre");
