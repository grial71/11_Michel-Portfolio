/* V3 : chargement explicite de services externes, pas de suivi ajouté. */
(function () {
  'use strict';
  function prepareEmbeds() {
    document.querySelectorAll('iframe[data-activation-src]').forEach(function (frame) {
      const origin = frame.getAttribute('data-activation-src') || '';
      if (!/^https:\/\/(www\.youtube-nocookie\.com|w\.soundcloud\.com)\//.test(origin)) return;
      const parent = frame.parentElement;
      if (!parent) return;
      parent.classList.add('v3-external-container');
      const curtain = document.createElement('div');
      curtain.className = 'v3-external-overlay';
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = 'Activer ' + (origin.includes('youtube') ? 'la vidéo YouTube' : 'le lecteur SoundCloud');
      const info = document.createElement('small');
      info.textContent = 'Le contenu externe sera chargé uniquement après votre clic et pourra transmettre des données techniques au prestataire.';
      btn.addEventListener('click', function () {
        frame.setAttribute('src', origin);
        frame.style.visibility = 'visible';
        curtain.remove();
      });
      curtain.appendChild(btn);
      curtain.appendChild(info);
      parent.appendChild(curtain);
    });
  }
  // Traduction à la demande : ne jamais provoquer de rechargement de page.
  var translationLoading = false;
  function languageFromButton(button) {
    var attr = button.getAttribute('onclick') || '';
    var match = attr.match(/\(['"](fr|es|en|ca)['"]\)/);
    return match ? match[1] : null;
  }
  function applyLanguage(lang) {
    var select = document.querySelector('.goog-te-combo');
    if (!select) return false;
    select.value = lang;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
  document.addEventListener('click', function (event) {
    var button = event.target.closest('button[onclick*="changeLanguage"], button[onclick*="changeArtistLanguage"], button[onclick*="changeProLanguage"], button[onclick*="changeGlobalLanguage"]');
    if (!button) return;
    var lang = languageFromButton(button);
    if (!lang) return;
    var serviceReady = !!(window.google && google.translate && google.translate.TranslateElement);
    if (serviceReady && document.querySelector('.goog-te-combo')) return; // les fonctions existantes prennent le relais
    event.preventDefault();
    event.stopImmediatePropagation();
    if (translationLoading) return;
    translationLoading = true;
    var callbackMeta = document.querySelector('meta[name="v3-google-translate-callback"]');
    var cb = callbackMeta ? callbackMeta.content : 'googleTranslateElementInit';
    function finish() {
      var attempts = 0;
      var poll = setInterval(function () {
        attempts++;
        if (applyLanguage(lang)) { clearInterval(poll); translationLoading = false; }
        else if (attempts >= 50) { clearInterval(poll); translationLoading = false; console.warn('Google Traduction indisponible'); }
      }, 100);
    }
    if (serviceReady) { finish(); return; }
    var script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=' + encodeURIComponent(cb);
    script.async = true;
    script.onload = finish;
    script.onerror = function () { translationLoading = false; alert('Traduction indisponible. Réessayez plus tard.'); };
    document.head.appendChild(script);
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepareEmbeds);
  else prepareEmbeds();
})();
