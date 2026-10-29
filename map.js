// Carte de l'accueil : au toucher, un premier appui sur une ville ouvre sa fiche, le second ouvre la page
(function () {
  if (!window.matchMedia("(hover: none)").matches) return;
  var cities = document.querySelectorAll(".city");
  cities.forEach(function (city) {
    city.querySelector("a").addEventListener("click", function (e) {
      if (city.classList.contains("is-open")) return;
      e.preventDefault();
      cities.forEach(function (c) { c.classList.remove("is-open"); });
      city.classList.add("is-open");
    });
  });
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".city")) return;
    cities.forEach(function (c) { c.classList.remove("is-open"); });
  });
})();
