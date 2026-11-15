/* Bandeau global d'alerte événementielle — Le Numérique Vient à Vous.
   Pour ajouter un événement, renseigner date, titre et lien dans evenements. */
(function () {
  'use strict';
  var evenements = [
    { date: '2026-12-05', titre: 'Soirée au Marigot · Canteleu', lien: '/evenements.html#evenements-a-venir' }
  ];
  var seuilJours = 7;
  function joursRestants(date) {
    var parties = date.split('-').map(Number);
    if (parties.length !== 3 || parties.some(function (n) { return !Number.isInteger(n); })) return Infinity;
    var d = new Date(parties[0], parties[1] - 1, parties[2]);
    if (d.getFullYear() !== parties[0] || d.getMonth() !== parties[1] - 1 || d.getDate() !== parties[2]) return Infinity;
    var maintenant = new Date();
    var utcAujourdhui = Date.UTC(maintenant.getFullYear(), maintenant.getMonth(), maintenant.getDate());
    return Math.round((Date.UTC(parties[0], parties[1] - 1, parties[2]) - utcAujourdhui) / 86400000);
  }
  function init() {
    if (document.getElementById('alerte-evenement-globale')) return;
    var styles = document.createElement('style');
    styles.textContent = [
      '#alerte-evenement-globale{position:fixed;z-index:2147483000;left:12px;right:12px;bottom:12px;display:none;max-width:760px;margin:auto;background:#efffc5;color:#19360c;border:2px solid #84cc16;border-radius:16px;box-shadow:0 0 14px rgba(132,204,22,.55),0 12px 32px rgba(0,0,0,.22);font:700 15px/1.45 system-ui,-apple-system,Segoe UI,sans-serif}',
      '#alerte-evenement-globale.is-visible{display:block}',
      '#alerte-evenement-globale a{display:flex;align-items:center;gap:12px;min-height:55px;padding:10px 18px;color:inherit;text-decoration:none}',
      '#alerte-evenement-globale a:hover,#alerte-evenement-globale a:focus-visible{text-decoration:underline;outline-offset:2px}',
      '#alerte-evenement-globale .alerte-led{width:14px;height:14px;flex:0 0 14px;border-radius:50%;background:#65a30d;box-shadow:0 0 7px #84cc16,0 0 15px #bef264;animation:alerte-led-pulse 2.5s ease-in-out infinite}',
      '#alerte-evenement-globale .alerte-texte{flex:1;min-width:0}',
      '#alerte-evenement-globale .alerte-detail{font-weight:500;font-size:13px;display:block}',
      '#alerte-evenement-globale .alerte-fleche{font-size:19px}',
      '@keyframes alerte-led-pulse{0%,100%{opacity:1;box-shadow:0 0 7px #84cc16,0 0 15px #bef264}50%{opacity:.45;box-shadow:0 0 2px #84cc16,0 0 5px #bef264}}',
      '@media(prefers-reduced-motion:reduce){#alerte-evenement-globale .alerte-led{animation:none}}',
      '@media(max-width:480px){#alerte-evenement-globale{left:8px;right:8px;bottom:8px;font-size:13px}#alerte-evenement-globale a{gap:8px;padding:9px 12px}#alerte-evenement-globale .alerte-detail{font-size:12px}}'
    ].join('\n');
    document.head.appendChild(styles);
    var bandeau = document.createElement('aside');
    bandeau.id = 'alerte-evenement-globale';
    bandeau.setAttribute('aria-label', 'Prochain événement');
    var lien = document.createElement('a');
    var led = document.createElement('span');
    led.className = 'alerte-led';
    led.setAttribute('aria-hidden', 'true');
    var titre = document.createElement('span');
    titre.className = 'alerte-texte';
    var fleche = document.createElement('span');
    fleche.className = 'alerte-fleche';
    fleche.setAttribute('aria-hidden', 'true');
    fleche.textContent = '›';
    lien.append(led, titre, fleche);
    bandeau.appendChild(lien);
    document.body.appendChild(bandeau);
    function mettreAJour() {
      var proche = evenements.map(function(e){ return { e:e, jours:joursRestants(e.date) }; })
        .filter(function(x){ return x.jours>=0 && x.jours<=seuilJours; })
        .sort(function(a,b){ return a.jours-b.jours; })[0];
      if (!proche) {
        bandeau.classList.remove('is-visible');
        return;
      }
      var delai=proche.jours===0 ? "Aujourd'hui !" : proche.jours===1 ? 'Demain !' : 'Dans '+proche.jours+' jours';
      titre.textContent='';
      var fort=document.createElement('strong');
      fort.textContent='✨ Événement proche · '+delai;
      var detail=document.createElement('span');
      detail.className='alerte-detail';
      detail.textContent=proche.e.titre+' — Voir les détails';
      titre.append(fort,detail);
      lien.href=proche.e.lien;
      bandeau.classList.add('is-visible');
    }
    mettreAJour();
    window.setInterval(mettreAJour,60*60*1000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init);
  else init();
})();
