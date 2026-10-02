// GitHub Pages SPA redirect restore.
// El 404.html de GitHub Pages convierte la ruta pedida en un query-string
// (?/ruta) para que esta página la restaure antes de montar React.
(function (l) {
  if (l.search[1] === "/") {
    var decoded = l.search
      .slice(1)
      .split("&")
      .map(function (s) {
        return s.replace(/~and~/g, "&");
      })
      .join("?");
    window.history.replaceState(null, null, l.pathname.slice(0, -1) + decoded + l.hash);
  }
})(window.location);
