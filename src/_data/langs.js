// Les langues du site, dans l'ordre des liens hreflang ; le menu des langues a son propre ordre (langMenu.js).
// C'est la seule liste des langues : le reste du code (lib/i18n.js, eleventy.config.js) la lit ici.
// locale : pour écrire les nombres (7,5 en français, 7.5 en anglais) ; dateLocale : pour écrire les dates (23 October 2026)
module.exports = [
  { code: "fr", htmlLang: "fr", locale: "fr", dateLocale: "fr", short: "FR", name: "Français", versionLabel: "Version française" },
  { code: "en", htmlLang: "en", locale: "en", dateLocale: "en-GB", short: "EN", name: "English", versionLabel: "English version" },
  { code: "pt", htmlLang: "pt-BR", locale: "pt-BR", dateLocale: "pt-BR", short: "PT", name: "Português", versionLabel: "Versão em português" }
];
