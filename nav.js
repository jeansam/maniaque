// Menu mobile : le bouton hamburger ouvre et ferme la navigation
(function () {
  var bar = document.querySelector(".bar");
  var btn = document.querySelector(".menu-btn");
  if (!bar || !btn) return;
  function setOpen(open) {
    bar.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  btn.addEventListener("click", function () {
    setOpen(btn.getAttribute("aria-expanded") !== "true");
  });
  // Un lien choisi ferme le menu
  bar.querySelectorAll(".bar-nav a").forEach(function (a) {
    a.addEventListener("click", function () { setOpen(false); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { setOpen(false); btn.focus(); }
  });
})();
