// Met à jour src/_data/rates.json : les taux de change entre les monnaies du site, d'après CoinGecko
// (gratuit, sans clé). Lancé chaque semaine par .github/workflows/rates.yml, qui commite le fichier
// s'il a changé ; Vercel remet alors le site en ligne. À la main : node lib/update-rates.js
//
// Un seul appel suffit : le prix d'un bitcoin dans chaque monnaie donne aussi les taux entre elles.
// Pour proposer une nouvelle monnaie dans cities.js (currencies), l'ajouter d'abord à CODES.
const fs = require("fs");
const path = require("path");

const CODES = ["EUR", "USD", "GBP", "BRL", "ZAR", "BTC"];
const FILE = path.join(__dirname, "..", "src", "_data", "rates.json");
// Garde-fou : un taux qui serait plus que doublé ou divisé par deux en une semaine est sans doute une
// erreur de la source ; la mise à jour échoue alors, sans rien changer, et GitHub prévient par e-mail
const MAX_CHANGE = 2;

async function main() {
  const fiat = CODES.filter((c) => c !== "BTC").map((c) => c.toLowerCase());
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=" + fiat.join(",");
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`CoinGecko a répondu ${res.status}`);
  const btc = (await res.json()).bitcoin || {};

  // Prix d'un bitcoin dans chaque monnaie (1 pour le bitcoin lui-même)
  const perBtc = { BTC: 1 };
  for (const c of fiat) {
    if (!(btc[c] > 0)) throw new Error(`Cours du bitcoin en ${c.toUpperCase()} absent de la réponse`);
    perBtc[c.toUpperCase()] = btc[c];
  }

  // rates[base][code] : combien vaut 1 unité de base, en code ; 6 chiffres significatifs
  const rates = {};
  for (const base of CODES) {
    rates[base] = {};
    for (const code of CODES) {
      if (code !== base) rates[base][code] = Number((perBtc[code] / perBtc[base]).toPrecision(6));
    }
  }

  const previous = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")).rates : null;
  if (previous) {
    for (const base of CODES) {
      for (const code of Object.keys(rates[base])) {
        const before = previous[base] && previous[base][code];
        const ratio = before ? rates[base][code] / before : 1;
        if (ratio > MAX_CHANGE || ratio < 1 / MAX_CHANGE) {
          throw new Error(`Taux ${base} → ${code} suspect : ${before} la dernière fois, ${rates[base][code]} maintenant`);
        }
      }
    }
  }

  const data = { date: new Date().toISOString().slice(0, 10), source: "CoinGecko", rates };
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
  const eur = rates.EUR;
  console.log(`Taux du ${data.date} : 1 € = ${eur.GBP} £ = ${eur.USD} $ = ${eur.BTC} ₿`);
}

main().catch((e) => {
  console.error("Mise à jour des taux impossible : " + e.message);
  process.exit(1);
});
