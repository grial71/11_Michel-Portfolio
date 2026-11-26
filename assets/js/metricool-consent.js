/* Metricool analytics — opt-in explicite, sans chargement préalable. */
(function () {
  'use strict';
  var KEY = 'lnvv_metricool_consent_v1';
  var TRACKER_URL = 'https://tracker.metricool.com/resources/be.js';
  var HASH = 'dd86b6afd7a4779444cb27ab9314d91';
  var started = false;

  function readChoice() {
    try {
      var value = localStorage.getItem(KEY);
      return value === 'accepted' || value === 'refused' ? value : null;
    } catch (e) {
      return null;
    }
  }

  function storeChoice(value) {
    try {
      localStorage.setItem(KEY, value);
      return true;
    } catch (e) {
      return false;
    }
  }

  function startMetricool() {
    if (started || readChoice() !== 'accepted') return;
    started = true;
    var script = document.createElement('script');
    script.src = TRACKER_URL;
    script.async = true;
    script.onload = function () {
      if (window.beTracker && typeof window.beTracker.t === 'function') {
        window.beTracker.t({ hash: HASH });
      }
    };
    document.head.appendChild(script);
  }

  function init() {
    var style = document.createElement('style');
    style.textContent =
      '.lnvv-consent-manage{position:fixed;left:12px;bottom:12px;z-index:9998;padding:8px 12px;border:1px solid #556277;border-radius:10px;background:#fff;color:#152735;font:600 13px system-ui,sans-serif;cursor:pointer;box-shadow:0 3px 12px #0003}' +
      '.lnvv-consent-box{position:fixed;left:12px;bottom:62px;z-index:9999;box-sizing:border-box;width:min(410px,calc(100vw - 24px));padding:18px;border:1px solid #8795a7;border-radius:14px;background:#fff;color:#152735;box-shadow:0 12px 34px #0004;font:15px/1.5 system-ui,sans-serif}' +
      '.lnvv-consent-box p{margin:8px 0 14px;color:#243746}' +
      '.lnvv-consent-box a{color:#174b8b;text-decoration:underline}' +
      '.lnvv-consent-actions{display:flex;flex-wrap:wrap;gap:8px}' +
      '.lnvv-consent-actions button{padding:10px 12px;border:2px solid #20313a;border-radius:9px;font:700 14px system-ui,sans-serif;cursor:pointer}' +
      '.lnvv-consent-reject{background:#fff;color:#20313a}' +
      '.lnvv-consent-accept{background:#20313a;color:#fff}' +
      '.lnvv-consent-box button:focus-visible,.lnvv-consent-manage:focus-visible{outline:3px solid #ffbd38;outline-offset:3px}';
    document.head.appendChild(style);

    var manage = document.createElement('button');
    manage.type = 'button';
    manage.className = 'lnvv-consent-manage';
    manage.textContent = 'Statistiques et confidentialité';
    manage.setAttribute('aria-label', 'Gérer le suivi statistique Metricool');
    document.body.appendChild(manage);

    var dialog = document.createElement('section');
    dialog.className = 'lnvv-consent-box';
    dialog.setAttribute('aria-label', 'Choix du suivi statistique');
    var title = document.createElement('strong');
    title.textContent = 'Autoriser les statistiques Metricool ?';
    var description = document.createElement('p');
    description.append('Avec votre accord, Metricool mesurera les visites du site. Vous pouvez refuser sans conséquence et changer d’avis à tout moment. ');
    var link = document.createElement('a');
    link.href = '/confidentialite.html';
    link.textContent = 'En savoir plus';
    description.appendChild(link);
    var actions = document.createElement('div');
    actions.className = 'lnvv-consent-actions';
    var reject = document.createElement('button');
    reject.type = 'button';
    reject.className = 'lnvv-consent-reject';
    reject.textContent = 'Refuser';
    var accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'lnvv-consent-accept';
    accept.textContent = 'Accepter';
    actions.appendChild(reject);
    actions.appendChild(accept);
    dialog.appendChild(title);
    dialog.appendChild(description);
    dialog.appendChild(actions);
    document.body.appendChild(dialog);

    function show() { dialog.hidden = false; dialog.style.display = 'block'; }
    function hide() { dialog.hidden = true; dialog.style.display = 'none'; }

    manage.addEventListener('click', show);
    reject.addEventListener('click', function () {
      var wasAccepted = readChoice() === 'accepted';
      storeChoice('refused');
      hide();
      // Un script deja charge ne peut etre decharge : recharger la page.
      if (wasAccepted) window.location.reload();
    });
    accept.addEventListener('click', function () {
      if (storeChoice('accepted')) {
        hide();
        startMetricool();
      } else {
        // Si le navigateur refuse le stockage, ne pas charger le tracker.
        hide();
      }
    });

    if (readChoice() === null) show();
    else hide();
    if (readChoice() === 'accepted') startMetricool();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
