(function () {
  var root = document.documentElement;
  root.classList.add("js");

  // La retouche demandée dans l'annotation du titre est « livrée » peu après l'affichage.
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.setTimeout(function () {
    root.classList.add("is-fixed");
    window.setTimeout(placeLeader, reduce ? 0 : 550);
  }, reduce ? 0 : 1400);

  // Icônes des garanties : l'animation se rejoue au toucher (mobile) ou au clic
  document.querySelectorAll(".assurances > div").forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.remove("is-anim");
      void card.offsetWidth;
      card.classList.add("is-anim");
      window.setTimeout(function () { card.classList.remove("is-anim"); }, 1300);
    });
  });

  // Le trait de renvoi de l'annotation rejoint exactement le mot encadré
  var target = document.getElementById("target");
  var note = document.querySelector(".note");
  function placeLeader() {
    if (!target || !note) return;
    // Le trait part après l'astérisque quand il y en a une (version anglaise)
    var star = document.querySelector(".star");
    var right = star ? Math.max(star.getBoundingClientRect().right, target.getBoundingClientRect().right) : target.getBoundingClientRect().right;
    var gap = note.getBoundingClientRect().left - right;
    note.style.setProperty("--leader", Math.max(0, gap - 28) + "px");
  }
  placeLeader();
  window.addEventListener("resize", placeLeader);
  if (document.fonts) document.fonts.ready.then(placeLeader);

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

  // Étapes « Comment ça marche » : sur mobile, toucher un titre affiche ou masque sa description
  document.querySelectorAll(".step-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var li = btn.closest("li");
      var open = !li.classList.contains("is-open");
      li.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
})();
