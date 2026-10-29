// Carte de l'accueil : un seul clic par fiche ; au toucher, un premier appui sur une ville ouvre sa fiche, le second ouvre la page
(function () {
  var cities = document.querySelectorAll(".city");
  var touch = window.matchMedia("(hover: none)").matches;
  cities.forEach(function (city) {
    city.querySelector("a").addEventListener("click", function (e) {
      if (document.querySelector(".city.is-going")) { e.preventDefault(); return; }
      if (touch && !city.classList.contains("is-open")) {
        e.preventDefault();
        cities.forEach(function (c) { c.classList.remove("is-open"); });
        city.classList.add("is-open");
        return;
      }
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      city.classList.add("is-going");
    });
  });
  // Retour arrière : la page revient du cache avec la fiche encore enfoncée
  window.addEventListener("pageshow", function () {
    cities.forEach(function (c) { c.classList.remove("is-going"); });
  });
  if (!touch) return;
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".city")) return;
    cities.forEach(function (c) { c.classList.remove("is-open"); });
  });
})();
