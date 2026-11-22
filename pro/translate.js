// Traduction centralisée par assets/js/conformite-v3.js.
// L'espace Pro ne pilote plus Google ou les cookies de son côté.
window.changeProLanguage = function(lang) {
  if (typeof window.v3SelectLanguage === 'function') window.v3SelectLanguage(lang);
};
