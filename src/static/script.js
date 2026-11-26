(function () {
  var root = document.documentElement;
  root.classList.add("js");

  // Icônes des garanties : l'animation se rejoue au toucher (mobile) ou au clic
  document.querySelectorAll(".assurances > div").forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.remove("is-anim");
      void card.offsetWidth;
      card.classList.add("is-anim");
      window.setTimeout(function () { card.classList.remove("is-anim"); }, 1300);
    });
  });

  // FAQ : le profil choisi (« Je suis… ») filtre les questions, dirigeant par défaut
  var roles = document.querySelectorAll(".role");
  function setRole(role) {
    roles.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-role") === role ? "true" : "false");
    });
    document.querySelectorAll(".faq details").forEach(function (d) {
      d.hidden = d.getAttribute("data-roles").split(" ").indexOf(role) < 0;
    });
  }
  roles.forEach(function (b) {
    b.addEventListener("click", function () { setRole(b.getAttribute("data-role")); });
  });
  if (roles.length) setRole("ceo");

  // Tarifs : le curseur des demandes fonctionnelles montre le palier choisi (0 : à l'unité)
  document.querySelectorAll("[data-tiers]").forEach(function (box) {
    var range = box.querySelector(".tier-range");
    var panels = box.querySelectorAll(".tier-panel");
    var marks = box.querySelectorAll(".tier-mark");
    function show(i) {
      panels.forEach(function (p) { p.classList.toggle("is-active", p.getAttribute("data-tier") === String(i)); });
      marks.forEach(function (m) { m.classList.toggle("is-active", m.getAttribute("data-tier-to") === String(i)); });
      range.style.setProperty("--fill", (i / range.max) * 100 + "%");
      range.setAttribute("aria-valuetext", panels[i].querySelector(".tier-name").textContent);
    }
    range.addEventListener("input", function () { show(Number(range.value)); });
    marks.forEach(function (m) {
      m.addEventListener("click", function () {
        range.value = m.getAttribute("data-tier-to");
        show(Number(range.value));
        range.focus();
      });
    });
    show(Number(range.value));
  });

  // Tarifs, « C'est quoi, une demande ? » : sur mobile, un onglet montre une seule colonne d'exemples
  document.querySelectorAll("[data-kinds]").forEach(function (box) {
    var tabs = box.querySelectorAll(".kind-tab");
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-pressed", on ? "true" : "false");
          document.getElementById(t.getAttribute("aria-controls")).classList.toggle("is-active", on);
        });
      });
    });
  });

  // Étapes « Comment ça marche » et notes sous les tarifs : sur mobile, toucher un titre affiche ou masque son texte
  document.querySelectorAll(".step-toggle, .note-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.closest("li, p");
      var open = !li.classList.contains("is-open");
      li.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
})();
