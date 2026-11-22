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
  // Traduction V3 : un controleur unique, chargement Google apres choix volontaire.
  // Les pages chargent le document en francais avant toute traduction.
  var LANGS = ['fr', 'es', 'en', 'ca'];
  var KEY = 'v3_lang_choice';
  var googleStarted = false;
  var navigationPending = false;

  function getChoice() {
    try {
      var value = sessionStorage.getItem(KEY);
      return LANGS.indexOf(value) >= 0 ? value : 'fr';
    } catch (e) { return 'fr'; }
  }
  function rememberChoice(lang) {
    try { sessionStorage.setItem(KEY, lang); } catch (e) { /* cookies suffisent */ }
  }
  function cookieScopes() {
    var host = location.hostname;
    var scopes = [''];
    if (host && host.indexOf('.') !== -1) {
      scopes.push(host, '.' + host);
      if (host.slice(0, 4) === 'www.') {
        scopes.push(host.slice(4), '.' + host.slice(4));
      }
    }
    return Array.from(new Set(scopes));
  }
  function syncGoogleCookie(lang) {
    cookieScopes().forEach(function (domain) {
      var domainAttr = domain ? '; domain=' + domain : '';
      document.cookie = 'googtrans=; Max-Age=0; path=/' + domainAttr + '; SameSite=Lax';
    });
    if (lang !== 'fr') {
      document.cookie = 'googtrans=/fr/' + lang + '; path=/; SameSite=Lax';
    }
  }
  function getButtonLang(button) {
    var attr = button.getAttribute('onclick') || '';
    var found = attr.match(/\(['"](fr|es|en|ca)['"]\)/);
    return found ? found[1] : null;
  }
  var selector = 'button[onclick*="changeLanguage"],button[onclick*="changeArtistLanguage"],' +
    'button[onclick*="changeProLanguage"],button[onclick*="changeGlobalLanguage"]';
  function syncButtonState() {
    var lang = getChoice();
    document.querySelectorAll(selector).forEach(function (button) {
      var value = getButtonLang(button);
      if (value) button.setAttribute('aria-pressed', String(value === lang));
    });
  }
  // Le chargement externe n'a lieu qu'apres une demande explicite de traduction.
  function startGoogle() {
    if (googleStarted || getChoice() === 'fr') return;
    var holder = document.getElementById('google_translate_element_global') ||
                 document.getElementById('google_translate_element');
    if (!holder) return;
    googleStarted = true;
    window.v3GoogleTranslationInit = function () {
      if (!(window.google && google.translate && google.translate.TranslateElement)) return;
      new google.translate.TranslateElement({
        pageLanguage: 'fr',
        includedLanguages: 'fr,es,en,ca',
        autoDisplay: false
      }, holder.id);
      // Google applique la langue memorisee dans le cookie au chargement.
      // Ne JAMAIS ajouter un evenement change ici : deux traductions
      // simultanees melangent le contenu de la page.
    };
    var tag = document.createElement('script');
    tag.src = 'https://translate.google.com/translate_a/element.js?cb=v3GoogleTranslationInit';
    tag.async = true;
    tag.onerror = function () {
      googleStarted = false;
      console.warn('Service de traduction temporairement indisponible');
    };
    document.head.appendChild(tag);
  }
  // Capturer avant tout onclick historique de l'accueil, Artistes et Pro.
  document.addEventListener('click', function (event) {
    var button = event.target.closest(selector);
    if (!button) return;
    var lang = getButtonLang(button);
    if (!lang) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (navigationPending) return;
    navigationPending = true;
    rememberChoice(lang);
    syncGoogleCookie(lang);
    // Le rechargement repart du contenu FR d'origine, jamais d'un DOM deja traduit.
    location.reload();
  }, true);

  function initLanguage() {
    syncButtonState();
    var choice = getChoice();
    if (choice !== 'fr') {
      syncGoogleCookie(choice);
      startGoogle();
    }
  }
  // Compatibilite si une ancienne page appelle directement une fonction.
  window.v3SelectLanguage = function (lang) {
    if (LANGS.indexOf(lang) < 0 || navigationPending) return;
    navigationPending = true;
    rememberChoice(lang);
    syncGoogleCookie(lang);
    location.reload();
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLanguage);
  } else {
    initLanguage();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTranslation);
  } else {
    startTranslation();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepareEmbeds);
  else prepareEmbeds();
})();
