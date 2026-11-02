// Vérifie le site généré (_site/), après la génération : chaque lien, image ou script vers le site lui-même
// (href="/…", src="/…", href="#…") mène à un fichier qui existe et, s'il vise un endroit de la page (#tarifs), à un id de cette page.
// Les liens vers d'autres sites ne sont pas vérifiés. Affiche tous les liens cassés, puis échoue s'il y en a.
const fs = require("fs");
const path = require("path");

const site = path.join(__dirname, "..", "_site");
const pages = [];
(function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith(".html")) pages.push(p);
  }
})(site);

// Le fichier servi pour une adresse : /offre/ donne offre/index.html
function file(url) {
  const p = path.join(site, decodeURIComponent(url));
  if (fs.existsSync(p) && fs.statSync(p).isDirectory()) return path.join(p, "index.html");
  return fs.existsSync(p) ? p : null;
}
const idsCache = {};
const ids = (p) => (idsCache[p] ||= new Set([...fs.readFileSync(p, "utf8").matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));

const broken = [];
for (const page of pages) {
  const html = fs.readFileSync(page, "utf8");
  const from = "/" + path.relative(site, page);
  for (const [, attr, value] of html.matchAll(/\s(href|src|content)="([/#][^"]*)"/g)) {
    // content="…" ne compte que pour une adresse (l'image de partage), pas pour une couleur (#F6F8FA)
    if (value.startsWith("//") || (attr === "content" && value.startsWith("#"))) continue;
    const [url, hash] = value.split("?")[0].split("#");
    const target = url ? file(url) : page;
    if (!target) broken.push(`${from} : ${attr}="${value}" ne mène à aucun fichier`);
    else if (hash && target.endsWith(".html") && !ids(target).has(decodeURIComponent(hash))) broken.push(`${from} : ${attr}="${value}" vise un id absent de la page`);
  }
}

if (broken.length) {
  console.error(`Vérification des liens : ${broken.length} lien(s) cassé(s)\n- ` + broken.join("\n- "));
  process.exit(1);
}
console.log(`Vérification des liens : ${pages.length} pages, aucun lien cassé`);
