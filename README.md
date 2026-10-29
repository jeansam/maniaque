# Maniaque

Site vitrine de l'offre Maniaque : outils sur mesure pour PME, demandes illimitées par abonnement.

Site statique, sans étape de build : Vercel le sert tel quel.

- `index.html` : la page d'accueil (toute l'offre)
- `styles.css` : la charte (papier millimétré, encre bleue, rouge de correction)
- `script.js` : l'animation du titre, le filtre de la FAQ par profil et les étapes repliables sur mobile
- `cas-d-usage/` (et `en/use-cases/`, `pt/casos-de-uso/`) : la page Cas d'usage, avec un dossier par exemple détaillé (`crm/`, `devis-et-chiffrages/`…)
- `a-propos/` (et `en/about/`, `pt/sobre/`) : la page À propos, avec la personne qui répond dans chaque ville
- `city.js` : la ville choisie dans l'en-tête (Marseille, São Paulo, Johannesbourg). **C'est le seul endroit où changer, par ville, le lien du bouton d'audit, les prix, et le prénom et la photo (`images/avatar-…webp`) de la personne affichée en haut de page** (liste `CITIES`). La ville est gardée dans le navigateur et ne change pas quand on change de langue ; choisir une ville ouvre la page dans sa langue (français, portugais, anglais). Dans le HTML :
  - `data-book` sur un lien : il pointe vers le lien d'audit de la ville
  - `data-price="monthly|first|maintenance|hosting|none"` : le montant, dans la devise de la ville
  - `data-city-only="sao-paulo"` (etc.) : le bloc ne s'affiche que pour cette ville (FAQ sur l'hébergement, personne de l'À propos)
  - un lien `?ville=sao-paulo` (ou `johannesburg`, `marseille`) choisit la ville
- `nav.js` : le menu hamburger sur mobile et tablette, et le menu « plus » (Cas d'usage, À propos, Articles) sur ordinateur
- `articles/` : la liste des articles (`articles/index.html`) et un dossier par article, avec son illustration
- `en/` : la version anglaise
- `pt/` : la version en portugais du Brésil (`pt/casos-de-uso/`, `pt/sobre/`, `pt/artigos/`), illustrations des articles comprises, dont les exemples des écrans sont en reais
- `mentions-legales.html` (et `en/legal-notice/`, `pt/aviso-legal/`) : à compléter (adresse)

## À compléter avant diffusion

- Liens d'audit de São Paulo (WhatsApp pour l'instant) et de Johannesbourg (LinkedIn de Nthuseni pour l'instant), dans `city.js`
- Prix en rands de Johannesbourg (conversion approximative), dans `city.js`

- Compléter les champs `[À compléter]` des mentions légales, dans les trois langues (`[To be completed]`, `[A preencher]`)
