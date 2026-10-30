// Menu mobile : le bouton hamburger ouvre et ferme la navigation
(function () {
  var bar = document.querySelector(".bar");
  var btn = document.querySelector(".menu-btn");
  if (!bar || !btn) return;
  function setOpen(open) {
    bar.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    // La rangée des langues défile pour montrer la langue en cours, même si elle est la dernière
    var langs = bar.querySelector(".bar-nav .picker-lang .picker-menu");
    var current = langs && langs.querySelector("[aria-current]");
    if (open && current && langs.scrollWidth > langs.clientWidth) {
      langs.scrollLeft = current.offsetLeft + current.offsetWidth - langs.clientWidth + parseFloat(getComputedStyle(langs).paddingRight);
    }
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

  // Sur ordinateur, le second hamburger ouvre le menu « plus » (Cas d'usage, À propos, Articles)
  var more = document.querySelector(".nav-more");
  var moreBtn = document.querySelector(".more-btn");
  if (!more || !moreBtn) return;
  function setMore(open) {
    more.classList.toggle("is-open", open);
    moreBtn.setAttribute("aria-expanded", open ? "true" : "false");
  }
  moreBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    setMore(moreBtn.getAttribute("aria-expanded") !== "true");
  });
  document.addEventListener("click", function (e) {
    if (!more.contains(e.target)) setMore(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && more.classList.contains("is-open")) { setMore(false); moreBtn.focus(); }
  });
})();
