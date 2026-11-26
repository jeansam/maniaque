// Vidéo du portfolio : un clic sur la miniature (a[data-video]) ouvre la vidéo YouTube dans une fenêtre au milieu
// de la page, en lecture tout de suite. Fermer (bouton, Échap, clic à côté) retire le lecteur, donc coupe le son.
// Sans JavaScript, le lien mène simplement à la vidéo sur YouTube.
(function () {
  var dialog = document.querySelector(".video-dialog");
  if (!dialog || typeof dialog.showModal !== "function") return;
  var frame = dialog.querySelector(".video-frame");

  document.querySelectorAll("a[data-video]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      var iframe = document.createElement("iframe");
      // youtube-nocookie : pas de cookie YouTube avant que la vidéo ne soit lancée
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(link.getAttribute("data-video")) + "?autoplay=1&rel=0&playsinline=1";
      iframe.title = link.querySelector(".video-play span").textContent;
      iframe.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      iframe.allowFullscreen = true;
      frame.appendChild(iframe);
      dialog.showModal();
    });
  });

  dialog.querySelector(".video-close").addEventListener("click", function () { dialog.close(); });
  // Un clic sur le fond sombre, hors du lecteur, ferme aussi
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("close", function () { frame.innerHTML = ""; });
})();
