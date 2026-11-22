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
  // Un choix volontaire vaut pour les pages suivantes dans le même onglet.
  var languages = ['fr', 'es', 'en', 'ca'];
  var key = 'v3_native_translation_choice';
  var switchTimer;
  var leaving = false;
  var selector = 'button[onclick*="changeLanguage"],button[onclick*="changeArtistLanguage"],' +
    'button[onclick*="changeProLanguage"],button[onclick*="changeGlobalLanguage"]';

  function getChoice() {
    try {
      var value = sessionStorage.getItem(key);
      if (languages.includes(value)) return value;
    } catch (_) { /* Le stockage peut être désactivé. */ }
    return 'fr';
  }

  function clearLegacyCookie() {
    var host = location.hostname;
    var domains = ['', host];
    if (host.startsWith('www.')) domains.push(host.slice(4));
    domains.forEach(function (domain) {
      document.cookie = 'googtrans=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '');
    });
  }

  function buttonLanguage(button) {
    var match = (button.getAttribute('onclick') || '').match(/\(['"](fr|es|en|ca)['"]\)/);
    return match && match[1];
  }

  function showLanguage(lang) {
    document.querySelectorAll(selector).forEach(function (button) {
      button.setAttribute('aria-pressed', String(buttonLanguage(button) === lang));
    });
  }

  function reportUnavailable(lang) {
    // Un échec annule le choix mémorisé. Le prochain essai exige un clic.
    try { sessionStorage.removeItem(key); } catch (_) { /* Le stockage peut être désactivé. */ }
    showLanguage('fr');
    var firstButton = document.querySelector(selector);
    if (!firstButton) return;
    var controls = firstButton.closest('.global-language-switcher') || firstButton.parentElement;
    if (document.getElementById('v3-translation-status')) return;
    var status = document.createElement('div');
    status.id = 'v3-translation-status';
    status.className = 'v3-translation-note';
    status.setAttribute('role', 'status');
    controls.after(status);
    status.append('Traduction momentanément indisponible. ');
    var retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = 'Réessayez.';
    retry.addEventListener('click', function () { requestLanguage(lang); });
    status.appendChild(retry);
  }

  function startGoogle(lang) {
    var holder = document.getElementById('google_translate_element_global') ||
                 document.getElementById('google_translate_element');
    if (!holder) {
      reportUnavailable(lang);
      return;
    }

    var settled = false;
    var observer;
    var timeout;
    var script = document.createElement('script');

    function finish() {
      settled = true;
      clearTimeout(timeout);
      if (observer) observer.disconnect();
      script.onerror = null;
    }

    function unavailable() {
      if (settled) return;
      finish();
      script.remove();
      reportUnavailable(lang);
    }

    function selectLanguage() {
      if (settled) return;
      var combo = holder.querySelector('.goog-te-combo');
      if (!combo || !Array.from(combo.options).some(function (option) {
        return option.value === lang;
      })) return;
      finish();
      combo.value = lang;
      combo.dispatchEvent(new Event('change', { bubbles: true }));
      showLanguage(lang);
    }

    window.v3GoogleTranslationInit = function () {
      if (settled || observer) return;
      if (!window.google || !google.translate || !google.translate.TranslateElement) {
        unavailable();
        return;
      }
      observer = new MutationObserver(selectLanguage);
      observer.observe(holder, { childList: true, subtree: true });
      try {
        new google.translate.TranslateElement({
          pageLanguage: 'fr',
          includedLanguages: 'es,en,ca',
          autoDisplay: false
        }, holder.id);
        selectLanguage();
      } catch (_) {
        unavailable();
      }
    };
    timeout = setTimeout(unavailable, 12000);
    script.src = 'https://translate.google.com/translate_a/element.js?cb=v3GoogleTranslationInit';
    script.async = true;
    script.onerror = unavailable;
    document.head.appendChild(script);
  }

  function requestLanguage(lang) {
    if (!languages.includes(lang) || leaving) return;
    clearTimeout(switchTimer);
    // Les clics rapprochés ne déclenchent qu'une navigation, avec le dernier choix.
    switchTimer = setTimeout(function () {
      try {
        sessionStorage.setItem(key, lang);
      } catch (_) {
        reportUnavailable(lang);
        return;
      }
      leaving = true;
      // Toujours repartir du HTML d'origine, sans enchaîner des traductions sur le même DOM.
      location.reload();
    }, 180);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest(selector);
    if (!button) return;
    var lang = buttonLanguage(button);
    if (!lang) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    requestLanguage(lang);
  }, true);

  window.v3SelectLanguage = requestLanguage;

  function initLanguage() {
    showLanguage('fr');
    clearLegacyCookie();
    var choice = getChoice();
    if (choice !== 'fr') startGoogle(choice);
  }

  // Une page restaurée depuis le cache de navigation peut être dans l'ancienne langue.
  window.addEventListener('pageshow', function (event) {
    if (event.persisted && documentChoice !== getChoice()) location.reload();
  });
  var documentChoice = getChoice();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
  } else {
    initLanguage();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepareEmbeds);
  else prepareEmbeds();
})();
