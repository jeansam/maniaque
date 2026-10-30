// Charge les fichiers YAML d'un dossier de src/content/ (un par cas d'usage, un par article), dans l'ordre de leur champ « order »
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

module.exports = function items(dir) {
  const full = path.join(__dirname, "..", "src", "content", dir);
  const list = fs.readdirSync(full).filter((f) => f.endsWith(".yaml")).map((f) => ({ id: path.basename(f, ".yaml"), ...yaml.load(fs.readFileSync(path.join(full, f), "utf8")) }));
  list.sort((a, b) => a.order - b.order);
  return Object.fromEntries(list.map((item) => [item.id, item]));
};
