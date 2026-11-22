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
  // Traduction a la demande : un seul clic, aucun rechargement pour ES/EN/CA.
  // Capture TOUS les clics pour neutraliser les anciens onclick et leurs reload().
  var loadingPromise = null;
  var requestId = 0;
  function languageFromButton(button) {
    var match = (button.getAttribute('onclick') || '').match(/\(['"](fr|es|en|ca)['"]\)/);
    return match ? match[1] : null;
  }
  function selectReady() {
    var select = document.querySelector('.goog-te-combo');
    return select && select.options && select.options.length ? select : null;
  }
  function waitForSelect() {
    return new Promise(function (resolve, reject) {
      var attempts = 0;
      var poll = setInterval(function () {
        var select = selectReady();
        if (select && ['es', 'en', 'ca'].every(function (lang) {
          return Array.from(select.options).some(function (option) { return option.value === lang; });
        })) {
          clearInterval(poll);
          // Google peut ajouter ses ecouteurs apres les options : attendre sa fin.
          setTimeout(function () { resolve(select); }, 400);
        } else if (++attempts >= 100) {
          clearInterval(poll);
          reject(new Error('Google Traduction indisponible'));
        }
      }, 100);
    });
  }
  function startTranslator() {
    if (loadingPromise) return loadingPromise;
    if (selectReady()) return waitForSelect();
    loadingPromise = new Promise(function (resolve, reject) {
      var ready = !!(window.google && window.google.translate && window.google.translate.TranslateElement);
      if (ready) { resolve(); return; }
      var meta = document.querySelector('meta[name="v3-google-translate-callback"]');
      var callbackName = meta ? meta.content : 'googleTranslateElementInit';
      var script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=' + encodeURIComponent(callbackName);
      script.async = true;
      script.onload = resolve;
      script.onerror = function () { reject(new Error('Chargement de traduction impossible')); };
      document.head.appendChild(script);
    }).then(waitForSelect).catch(function (error) {
      loadingPromise = null;
      throw error;
    });
    return loadingPromise;
  }
  function setTranslateCookie(lang) {
    var value = lang === 'fr' ? '/fr/fr' : '/fr/' + lang;
    document.cookie = 'googtrans=' + value + '; path=/; SameSite=Lax';
    var host = window.location.hostname;
    if (host && host.includes('.')) {
      document.cookie = 'googtrans=' + value + '; path=/; domain=' + host + '; SameSite=Lax';
    }
  }
  function applyLanguage(select, lang) {
    if (!select.isConnected) select = selectReady();
    if (!select) return;
    select.value = lang;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }
  document.addEventListener('click', function (event) {
    var button = event.target.closest('button[onclick*="changeLanguage"], button[onclick*="changeArtistLanguage"], button[onclick*="changeProLanguage"], button[onclick*="changeGlobalLanguage"]');
    if (!button) return;
    var lang = languageFromButton(button);
    if (!lang) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    var ownRequest = ++requestId;
    setTranslateCookie(lang);
    // Le contenu source est en francais ; on le restaure sans appel externe.
    if (lang === 'fr') { window.location.reload(); return; }
    button.setAttribute('aria-busy', 'true');
    startTranslator().then(function (select) {
      if (ownRequest !== requestId) return;
      applyLanguage(select, lang);
      // Rattrapage si le service a fini son initialisation apres le 1er change.
      setTimeout(function () {
        if (ownRequest !== requestId) return;
        var translated = document.documentElement.classList.contains('translated-ltr') ||
                         document.documentElement.classList.contains('translated-rtl');
        if (!translated) applyLanguage(select, lang);
        button.removeAttribute('aria-busy');
      }, 850);
    }).catch(function () {
      button.removeAttribute('aria-busy');
      alert('Traduction indisponible pour le moment. Veuillez reessayer plus tard.');
    });
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepareEmbeds);
  else prepareEmbeds();
})();
