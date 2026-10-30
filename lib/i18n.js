// Textes traduits : une valeur { fr, en, pt } donne le texte de la langue ; le reste est gardé tel quel.
const LANGS = ["fr", "en", "pt"];

function isTranslation(v) {
  return v && typeof v === "object" && !Array.isArray(v) && Object.keys(v).length && Object.keys(v).every((k) => LANGS.includes(k));
}

function resolve(value, lang) {
  if (isTranslation(value)) return value[lang];
  if (Array.isArray(value)) return value.map((v) => resolve(v, lang));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, resolve(v, lang)]));
  return value;
}

module.exports = { LANGS, resolve };
