(function () {
  var root = document.documentElement;
  root.classList.add("js");

  // La retouche demandée dans l'annotation du titre est « livrée » peu après l'affichage.
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.setTimeout(function () {
    root.classList.add("is-fixed");
    window.setTimeout(placeLeader, reduce ? 0 : 550);
  }, reduce ? 0 : 1400);

  // Dates de la liste d'exemple, relatives à aujourd'hui
  var en = (root.lang || "fr").slice(0, 2) === "en";
  var T = en ? {
    locale: "en-GB",
    empty: "Write a request, even a tiny one.",
    limit: "This is a demo: the real list has no limit.",
    feature: "Feature",
    planned: "Planned",
    added: "Added. Delivery planned for "
  } : {
    locale: "fr-FR",
    empty: "Écrivez une demande, même toute petite.",
    limit: "C'est une démo : la vraie liste, elle, n'a pas de limite.",
    feature: "Fonctionnalité",
    planned: "Prévu",
    added: "Ajouté. Livraison prévue le "
  };
  var fmt = new Intl.DateTimeFormat(T.locale, { day: "numeric", month: "short" });
  var longFmt = new Intl.DateTimeFormat(T.locale, { weekday: "long", day: "numeric", month: "long" });

  // Le trait de renvoi de l'annotation rejoint exactement le mot encadré
  var target = document.getElementById("target");
  var note = document.querySelector(".note");
  function placeLeader() {
    if (!target || !note) return;
    var gap = note.getBoundingClientRect().left - target.getBoundingClientRect().right;
    note.style.setProperty("--leader", Math.max(0, gap - 28) + "px");
  }
  placeLeader();
  window.addEventListener("resize", placeLeader);
  if (document.fonts) document.fonts.ready.then(placeLeader);
  function inDays(n) {
    var d = new Date();
    d.setDate(d.getDate() + n);
    // Pas de livraison le week-end : on ramène au vendredi
    var day = d.getDay();
    if (day === 6) d.setDate(d.getDate() - 1);
    if (day === 0) d.setDate(d.getDate() - 2);
    return d;
  }
  document.querySelectorAll("[data-offset]").forEach(function (cell) {
    cell.textContent = fmt.format(inDays(parseInt(cell.getAttribute("data-offset"), 10)));
  });

  // Ajout d'une demande : elle prend sa place en fin de liste, une semaine après la précédente
  var form = document.getElementById("backlog-form");
  var input = document.getElementById("demande");
  var body = document.getElementById("backlog-body");
  var msg = document.getElementById("backlog-msg");
  var lastOffset = 18;
  var added = 0;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var text = input.value.trim();
    if (!text) {
      msg.textContent = T.empty;
      input.focus();
      return;
    }
    if (added >= 5) {
      msg.textContent = T.limit;
      return;
    }
    lastOffset += 7;
    added += 1;
    var date = fmt.format(inDays(lastOffset));

    var tr = document.createElement("tr");
    tr.className = "is-new";
    var td1 = document.createElement("td");
    var req = document.createElement("span");
    req.className = "req";
    req.textContent = text;
    var pill = document.createElement("span");
    pill.className = "pill pill-feature";
    pill.textContent = T.feature;
    td1.append(req, pill);
    var td2 = document.createElement("td");
    var st = document.createElement("span");
    st.className = "status";
    st.textContent = T.planned;
    td2.appendChild(st);
    var td3 = document.createElement("td");
    td3.textContent = date;
    tr.append(td1, td2, td3);
    body.appendChild(tr);

    input.value = "";
    msg.textContent = T.added + longFmt.format(inDays(lastOffset)) + ".";
  });
})();
