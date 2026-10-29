// Carte de l'accueil : un clic sur la fiche d'une ville ouvre sa page, faire glisser la photo vers la droite aussi.
// Au toucher, un premier appui sur la ville ouvre sa fiche. Sur mobile, la carte défile du doigt.
(function () {
  var cities = document.querySelectorAll(".city");
  var touch = window.matchMedia("(hover: none)").matches;
  var going = function () { return document.querySelector(".city.is-going"); };
  var closeAll = function () { cities.forEach(function (c) { c.classList.remove("is-open"); }); };

  cities.forEach(function (city) {
    var a = city.querySelector("a");
    var card = city.querySelector(".city-card");
    var knob = card.querySelector("img");
    var start = 0, max = 0, p = 0, dragging = false, dragged = false;

    function set(v) {
      p = v;
      card.style.setProperty("--dx", (v * max) + "px");
      card.style.setProperty("--p", v);
    }
    a.addEventListener("click", function (e) {
      if (going()) { e.preventDefault(); return; }
      if (dragged) { dragged = false; e.preventDefault(); return; }
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      if (touch && e.detail && !city.classList.contains("is-open")) {
        e.preventDefault(); closeAll(); city.classList.add("is-open"); return;
      }
      city.classList.add("is-going");
    });

    // Sans cela, le navigateur tire le lien entier au lieu de la photo et annule le geste
    a.draggable = false;
    a.addEventListener("dragstart", function (e) { e.preventDefault(); });
    knob.addEventListener("pointerdown", function (e) {
      if (e.button || going()) return;
      if (touch && !city.classList.contains("is-open")) return;
      max = card.clientWidth - knob.offsetWidth - 2 * knob.offsetLeft;
      start = e.clientX; dragging = true; dragged = false;
      knob.setPointerCapture(e.pointerId);
      city.classList.add("is-dragging", "is-open");
    });
    knob.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var dx = Math.min(Math.max(e.clientX - start, 0), max);
      if (dx > 4) dragged = true;
      set(max ? dx / max : 0);
    });
    function release() {
      if (!dragging) return;
      dragging = false;
      city.classList.remove("is-dragging");
      if (p >= 0.8) {
        set(1);
        city.classList.add("is-going");
        window.location.href = a.href;
      } else {
        set(0);
        if (!touch) city.classList.remove("is-open");
      }
    }
    knob.addEventListener("pointerup", release);
    knob.addEventListener("pointercancel", release);
  });

  // Retour arrière : la page revient du cache avec la photo encore au bout de sa course
  window.addEventListener("pageshow", function () {
    cities.forEach(function (c) {
      c.classList.remove("is-going", "is-open");
      c.querySelector(".city-card").style.cssText = "";
    });
  });
  // La carte plus large que l'écran s'ouvre sur son centre, entre Marseille et Johannesbourg
  var scroller = document.querySelector(".map-scroll");
  if (scroller && scroller.scrollWidth > scroller.clientWidth) {
    scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;
  }
  if (!touch) return;
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".city")) return;
    closeAll();
  });
})();
