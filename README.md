# Maniaque

Site vitrine de l'offre Maniaque : outils sur mesure pour PME, demandes illimitées par abonnement.

Site généré avec [Eleventy](https://www.11ty.dev/) : chaque page est écrite une seule fois, et générée dans les trois langues (français, anglais, portugais du Brésil). Vercel lance la génération (`npm run build`) et sert le dossier `_site/`.

```bash
npm install
```

```bash
npm start
```

`npm start` génère le site et le sert en local, rechargé à chaque modification ; `npm run build` le génère seulement.

## Où changer quoi

- **Un texte** : dans les fichiers YAML, les trois langues côte à côte (`fr`, `en`, `pt`). Une valeur sans langue est la même partout
  - `src/_data/ui.yaml` : l'interface commune (en-tête, menus, pied de page, encart « Réserver un audit », jours de la semaine…)
  - `src/_data/strings/<page>.yaml` : les textes d'une page (`home`, `offer`, `usecaseIndex`, `about`, `articleIndex`, `legal`, et les textes communs aux pages de cas d'usage, `usecase`, et d'articles, `article`)
  - `src/content/showcase/<maquette>.yaml` : les textes d'une maquette d'écran de la vitrine de l'offre
  - `src/content/usecases/<cas>.yaml` : un cas d'usage (son adresse dans chaque langue, son titre, la citation et le résumé de la page Cas d'usage, et les textes de sa maquette d'écran) ; `order` donne sa place dans les listes
  - `src/content/articles/<article>.yaml` : un article (adresse, date, durée de lecture, résumé, introduction, légende de l'illustration et références) ; **son texte est en Markdown, un fichier par langue** : `<article>.fr.md`, `<article>.en.md`, `<article>.pt.md` (`## ` pour un intertitre, `**gras**`, `[lien](https://…)` ; les liens externes s'ouvrent dans un nouvel onglet ; le HTML reste permis, pour un tableau par exemple)
- **Une ville** : `src/_data/cities.js`, **seul endroit où changer, par ville, le lien du bouton d'audit, les prix et la devise, et la personne qui répond** (prénom, nom, photos, LinkedIn), ainsi que sa place sur la carte de l'accueil. `city.js` est généré à partir de ce fichier
- **Une adresse de page** : `src/_data/routes.js` (et le `slug` des cas d'usage et des articles)
- **Une langue** : `src/_data/langs.js`, seule liste des langues (code, `lang` du HTML, façon d'écrire les nombres et les dates) ; l'ordre du menu des langues est dans `src/_data/langMenu.js`

## Organisation

- `src/_includes/base.njk` : le squelette de toutes les pages (`<head>`, en-tête avec les menus des villes et des langues, pied de page) ; trois variantes : page courante, accueil (`variant: home`) et mentions légales (`variant: legal`)
- `src/_includes/components.njk` : les blocs partagés (encart d'audit, éléments répétés des maquettes d'écran : menu latéral, en-tête, tableau, indicateurs…)
- `src/pages/` : un modèle par type de page, générée dans chaque langue (et pour chaque cas d'usage ou article). Le début du fichier dit quelles pages il produit et leurs particularités (titre, balises de partage, scripts)
  - `home.njk` : l'accueil, en anglais à la racine (`/fr/`, `/pt/`) : une carte du monde avec les trois villes ; survoler une ville montre la personne qui y répond, cliquer ouvre l'offre dans la langue de la ville
  - `offer.njk` : la page de l'offre ; chaque maquette d'écran de la vitrine a son modèle dans `src/_includes/showcase/<maquette>.njk` et ses textes dans `src/content/showcase/<maquette>.yaml`
  - `usecaseIndex.njk` et `usecase.njk` : la page Cas d'usage et la page de chaque cas ; la maquette d'écran de chaque cas est dans `src/_includes/usecases/<cas>.njk`, son icône dans `src/_includes/icons/<cas>.svg`
  - `about.njk` : la page À propos, avec la personne qui répond dans chaque ville
  - `articleIndex.njk` et `article.njk` : la liste des articles et chaque article
  - `legal.njk` : les mentions légales
- `src/city.njk` : donne `city.js`, fait des villes de `cities.js` et du code de `src/_includes/city.js` : la ville choisie dans l'en-tête (Marseille, São Paulo, Johannesbourg). La ville est gardée dans le navigateur et ne change pas quand on change de langue ; choisir une ville ouvre la page dans sa langue. Dans le HTML :
  - `data-book` sur un lien : il pointe vers le lien d'audit de la ville
  - `data-price="monthly|first|maintenance|hosting|none"` : le montant, dans la devise de la ville
  - `data-city-only="sao-paulo"` (etc.) : le bloc ne s'affiche que pour cette ville (FAQ sur l'hébergement, personne de l'À propos)
  - un lien `?ville=sao-paulo` (ou `johannesburg`, `marseille`) choisit la ville

  Sans JavaScript, chaque page montre les prix et le lien d'audit de sa ville par défaut (celle de sa langue) : la génération les remplit (`eleventy.config.js`)
- `src/static/` : les fichiers servis tels quels
  - `styles.css` : la charte (papier millimétré, encre bleue, rouge de correction)
  - `script.js` : l'animation du titre de l'offre, le filtre de la FAQ par profil et les étapes repliables sur mobile
  - `nav.js` : le menu hamburger sur mobile et tablette, le menu « plus » (Cas d'usage, À propos, Articles) sur ordinateur, et les menus flottants de la ville et de la langue
  - `map.js` : l'appui sur la carte de l'accueil sur mobile (premier appui : la fiche, second : la page)
  - les images, et l'illustration de chaque article dans chaque langue (celles en portugais ont leurs montants en reais)
  - `en/index.html` : redirige `/en/` vers l'accueil anglais, à la racine
- `vercel.json` : la génération, et sur l'accueil (`/`), la redirection selon le pays du visiteur (France → `/fr/`, Brésil → `/pt/`, ailleurs : anglais). Dès qu'on choisit une langue ou une ville à la main, un cookie `maniaque-lang` (posé par `city.js`) l'emporte sur le pays

## À compléter avant diffusion

- Liens d'audit de São Paulo (WhatsApp pour l'instant) et de Johannesbourg (LinkedIn de Nthuseni pour l'instant), dans `src/_data/cities.js`
- Prix en rands de Johannesbourg (conversion approximative), dans `src/_data/cities.js`
