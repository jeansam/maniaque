// Navigation : le hamburger sur mobile, le menu « Plus » sur ordinateur, la barre d'audit en bas d'écran, le filtre des cas d'usage et les menus flottants de la ville et de la langue
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

// Mobile et tablette : la barre « Réserver mon audit » apparaît en bas une fois le haut de page passé,
// et s'efface quand un autre bouton d'audit est déjà à l'écran (encart de fin de page, tarifs…)
(function () {
  var bar = document.querySelector(".book-bar");
  if (!bar) return;
  var link = bar.querySelector("a");
  var visible = new Set();
  function update() {
    var show = window.scrollY > window.innerHeight * 0.6 && visible.size === 0;
    bar.classList.toggle("is-shown", show);
    link.tabIndex = show ? 0 : -1;
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); });
      update();
    });
    document.querySelectorAll("main a[data-book]").forEach(function (a) { io.observe(a); });
  }
  window.addEventListener("scroll", update, { passive: true });
  update();
})();

// Page Cas d'usage : les familles (Ventes et clients, Opérations…) filtrent les cartes
(function () {
  var filter = document.querySelector(".uses-filter");
  if (!filter) return;
  var buttons = filter.querySelectorAll("[data-group]");
  var cards = document.querySelectorAll(".uses > li[data-group]");
  filter.hidden = false;
  buttons.forEach(function (b) {
    b.addEventListener("click", function () {
      var group = b.getAttribute("data-group");
      buttons.forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
      cards.forEach(function (li) { li.hidden = group !== "all" && li.getAttribute("data-group") !== group; });
    });
  });
})();

// Menus flottants (ville, langue) : clic pour ouvrir, clic à l'extérieur ou Échap pour fermer
(function () {
  var pickers = document.querySelectorAll(".picker");
  function close(except) {
    pickers.forEach(function (p) {
      if (p === except) return;
      p.classList.remove("is-open");
      p.querySelector(".picker-btn").setAttribute("aria-expanded", "false");
    });
  }
  pickers.forEach(function (p) {
    var btn = p.querySelector(".picker-btn");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = !p.classList.contains("is-open");
      close(p);
      p.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  document.addEventListener("click", function (e) {
    var inside = e.target.closest && e.target.closest(".picker");
    close(inside);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var open = document.querySelector(".picker.is-open");
    if (open) { close(); open.querySelector(".picker-btn").focus(); }
  });
})();
