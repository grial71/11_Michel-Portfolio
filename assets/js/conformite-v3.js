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
  // V3.2 : un seul controleur de traduction pour toutes les pages.
  // Le choix de langue provoque UN rechargement, jamais des traductions
  // concurrentes sur le meme DOM (source des melanges ES / EN).
  var supported = ['fr', 'es', 'en', 'ca'];
  var storageKey = 'v3_traduction_choisie';
  var initialized = false;

  function readChoice() {
    try {
      var stored = window.sessionStorage.getItem(storageKey);
      return supported.indexOf(stored) !== -1 ? stored : 'fr';
    } catch (_) { return 'fr'; }
  }

  function writeChoice(lang) {
    try { window.sessionStorage.setItem(storageKey, lang); } catch (_) {}
  }

  function cookieDomainVariants() {
    var hostname = window.location.hostname;
    var list = [''];
    if (hostname && hostname.indexOf('.') !== -1) {
      list.push(hostname);
      list.push('.' + hostname);
      if (hostname.indexOf('www.') === 0) {
        list.push(hostname.substring(4));
        list.push('.' + hostname.substring(4));
      }
    }
    return Array.from(new Set(list));
  }

  function clearTranslateCookies() {
    cookieDomainVariants().forEach(function (domain) {
      var suffix = domain ? '; domain=' + domain : '';
      document.cookie = 'googtrans=; Max-Age=0; path=/' + suffix + '; SameSite=Lax';
    });
  }

  function setTranslateCookie(lang) {
    clearTranslateCookies();
    if (lang === 'fr') return;
    document.cookie = 'googtrans=/fr/' + lang + '; path=/; SameSite=Lax';
  }

  function languageFromButton(button) {
    var match = (button.getAttribute('onclick') || '').match(/\(['"](fr|es|en|ca)['"]\)/);
    return match ? match[1] : null;
  }

  function updateButtonState(lang) {
    document.querySelectorAll(
      'button[onclick*="changeLanguage"],button[onclick*="changeArtistLanguage"],' +
      'button[onclick*="changeProLanguage"],button[onclick*="changeGlobalLanguage"]'
    ).forEach(function (button) {
      var choice = languageFromButton(button);
      if (choice) button.setAttribute('aria-pressed', String(choice === lang));
    });
  }

  function getTranslateHolder() {
    return document.getElementById('google_translate_element_global') ||
           document.getElementById('google_translate_element');
  }

  function initSelectedLanguage(lang) {
    if (initialized || lang === 'fr') return;
    var holder = getTranslateHolder();
    if (!holder) return;
    var meta = document.querySelector('meta[name="v3-google-translate-callback"]');
    // Ignore les callbacks anciens de chacune des pages.
    // Un seul callback commun garantit une initialisation coherente.
    window.v3TranslateInit = function () {
      if (initialized) return;
      if (!(window.google && window.google.translate && window.google.translate.TranslateElement)) return;
      initialized = true;
      new window.google.translate.TranslateElement({
        pageLanguage: 'fr',
        includedLanguages: 'fr,es,en,ca',
        autoDisplay: false
      }, holder.id);
      // Le cookie a ete defini AVANT le chargement et Google le lit au demarrage.
      // Si le widget ne prend pas encore le choix, un seul changement est effectue.
      var attempts = 0;
      var timer = setInterval(function () {
        var combo = holder.querySelector('.goog-te-combo') ||
                    document.querySelector('.goog-te-combo');
        if (!combo || !combo.options || !combo.options.length) {
          if (++attempts > 80) clearInterval(timer);
          return;
        }
        clearInterval(timer);
        setTimeout(function () {
          if (readChoice() !== lang) return;
          if (combo.value !== lang) {
            combo.value = lang;
            combo.dispatchEvent(new Event('change', { bubbles: true }));
          }
        }, 500);
      }, 100);
    };
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://translate.google.com/translate_a/element.js?cb=v3TranslateInit';
    script.onerror = function () {
      console.warn('La traduction externe est momentanement indisponible.');
    };
    document.head.appendChild(script);
  }

  // Capture avant les onclick historiques, qui provoquent des rechargements
  // ou des changements de langue concurrents.
  document.addEventListener('click', function (event) {
    var button = event.target.closest(
      'button[onclick*="changeLanguage"],button[onclick*="changeArtistLanguage"],' +
      'button[onclick*="changeProLanguage"],button[onclick*="changeGlobalLanguage"]'
    );
    if (!button) return;
    var lang = languageFromButton(button);
    if (!lang) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    // Enregistrer le choix de facon synchrone avant de naviguer.
    writeChoice(lang);
    setTranslateCookie(lang);
    updateButtonState(lang);
    // Un seul chargement sur une page francaise neuve empeche ES/EN de se melanger.
    window.location.reload();
  }, true);

  function startTranslation() {
    var lang = readChoice();
    updateButtonState(lang);
    if (lang !== 'fr') {
      setTranslateCookie(lang);
      initSelectedLanguage(lang);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTranslation);
  } else {
    startTranslation();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepareEmbeds);
  else prepareEmbeds();
})();
