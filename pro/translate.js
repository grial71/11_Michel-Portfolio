(() => {
  function setTranslateCookie(lang) {
    const value = lang === 'fr' ? '/fr/fr' : '/fr/' + lang;
    const hostname = window.location.hostname;
    document.cookie = 'googtrans=' + value + '; path=/';
    if (hostname) {
      document.cookie = 'googtrans=' + value + '; path=/; domain=' + hostname;
      const parts = hostname.split('.');
      if (parts.length > 2) {
        document.cookie = 'googtrans=' + value + '; path=/; domain=.' + parts.slice(-2).join('.');
      }
    }
  }

  function currentLanguage() {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    if (!match) return 'fr';
    const value = decodeURIComponent(match[1]);
    const lang = value.split('/').filter(Boolean).pop();
    return ['fr', 'es', 'en'].includes(lang) ? lang : 'fr';
  }

  function updateActiveLanguage() {
    const active = currentLanguage();
    document.querySelectorAll('[data-pro-lang]').forEach(button => {
      const selected = button.dataset.proLang === active;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    document.documentElement.lang = active;
  }

  window.googleTranslateElementInit = function () {
    if (!window.google || !google.translate) return;
    new google.translate.TranslateElement({
      pageLanguage: 'fr',
      includedLanguages: 'fr,es,en',
      autoDisplay: false
    }, 'google_translate_element');
    updateActiveLanguage();
  };

  window.changeProLanguage = function (lang) {
    if (!['fr', 'es', 'en'].includes(lang)) return;
    setTranslateCookie(lang);
    const select = document.querySelector('.goog-te-combo');
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event('change'));
    }
    updateActiveLanguage();
    setTimeout(() => window.location.reload(), 250);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateActiveLanguage);
  } else {
    updateActiveLanguage();
  }
})();