// Traduction Google : boutons FR / ES / EN avec drapeaux.
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'fr',
    includedLanguages: 'fr,es,en',
    autoDisplay: false
  }, 'google_translate_element');
}

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

function changeLanguage(lang) {
  setTranslateCookie(lang);
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }
  setTimeout(() => window.location.reload(), 300);
}

// Lecteur musique méditation permanent : Play / Pause / Volume synchronisés.
const meditationAudio = document.getElementById('meditationAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const miniPlayPauseBtn = document.getElementById('miniPlayPauseBtn');
const volumeControl = document.getElementById('volumeControl');
const miniVolumeControl = document.getElementById('miniVolumeControl');
const audioStatus = document.getElementById('audioStatus');
const miniAudioStatus = document.getElementById('miniAudioStatus');

const meditationAudioSources = [
  new URL('musique/Musique_Gratuite_Libre_de_droit_Sappheiros_Awake.mp3', document.baseURI).href,
  'https://raw.githubusercontent.com/grial71/11_Michel-Portfolio/main/musique/Musique_Gratuite_Libre_de_droit_Sappheiros_Awake.mp3'
];
let meditationAudioSourceIndex = 0;
let meditationAudioFallbackTried = false;

function setAudioMessage(message) {
  if (audioStatus) audioStatus.textContent = message;
  if (miniAudioStatus) miniAudioStatus.textContent = message;
}

function updatePlayButtons() {
  const text = meditationAudio && !meditationAudio.paused ? '⏸️ Pause' : '▶️ Play';
  if (playPauseBtn) playPauseBtn.textContent = text;
  if (miniPlayPauseBtn) miniPlayPauseBtn.textContent = text;
}

function loadMeditationSource(index) {
  if (!meditationAudio) return;
  meditationAudioSourceIndex = Math.max(0, Math.min(index, meditationAudioSources.length - 1));
  const target = meditationAudioSources[meditationAudioSourceIndex];
  if (meditationAudio.src !== target) meditationAudio.src = target;
  meditationAudio.preload = 'metadata';
  meditationAudio.load();
}

async function toggleMeditationAudio() {
  if (!meditationAudio) return;
  try {
    if (meditationAudio.paused) {
      if (!meditationAudio.src) loadMeditationSource(0);
      setAudioMessage('Chargement de la musique…');
      await meditationAudio.play();
      setAudioMessage('Musique en lecture.');
    } else {
      meditationAudio.pause();
      setAudioMessage('Musique en pause.');
    }
    updatePlayButtons();
  } catch (error) {
    if (!meditationAudioFallbackTried && meditationAudioSources.length > 1) {
      meditationAudioFallbackTried = true;
      loadMeditationSource(1);
      try {
        await meditationAudio.play();
        setAudioMessage('Musique en lecture.');
        updatePlayButtons();
        return;
      } catch (fallbackError) {
        // Le message détaillé ci-dessous sera affiché.
      }
    }
    setAudioMessage('La musique ne peut pas être lue pour le moment. Rechargez la page puis réessayez.');
    updatePlayButtons();
  }
}

function setVolume(value) {
  if (!meditationAudio) return;
  const volume = Number(value);
  meditationAudio.volume = volume;
  if (volumeControl) volumeControl.value = String(volume);
  if (miniVolumeControl) miniVolumeControl.value = String(volume);
}

if (meditationAudio) {
  loadMeditationSource(0);
  setVolume(0.55);
  if (playPauseBtn) playPauseBtn.addEventListener('click', toggleMeditationAudio);
  if (miniPlayPauseBtn) miniPlayPauseBtn.addEventListener('click', toggleMeditationAudio);
  if (volumeControl) volumeControl.addEventListener('input', () => setVolume(volumeControl.value));
  if (miniVolumeControl) miniVolumeControl.addEventListener('input', () => setVolume(miniVolumeControl.value));

  meditationAudio.addEventListener('canplay', () => {
    if (meditationAudio.paused) setAudioMessage('Musique prête. Appuyez sur Play.');
  });
  meditationAudio.addEventListener('play', updatePlayButtons);
  meditationAudio.addEventListener('pause', updatePlayButtons);
  meditationAudio.addEventListener('ended', () => {
    updatePlayButtons();
    setAudioMessage('Musique terminée.');
  });
  meditationAudio.addEventListener('error', () => {
    if (!meditationAudioFallbackTried && meditationAudioSourceIndex === 0 && meditationAudioSources.length > 1) {
      meditationAudioFallbackTried = true;
      loadMeditationSource(1);
      setAudioMessage('Chargement de la musique depuis la source de secours…');
      return;
    }
    setAudioMessage('Audio momentanément indisponible. Rechargez la page puis réessayez.');
  });
}

// Menu mobile accessible.
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.getElementById('navigation-principale');

// Accès à la vitrine professionnelle : priorité dans le menu principal.
(() => {
  const proUrl = 'https://www.lenumeriquevientavous.fr/pro/';

  if (navigation && !navigation.querySelector('[data-pro-access]')) {
    const proNavLink = document.createElement('a');
    proNavLink.href = proUrl;
    proNavLink.textContent = '💼 Vitrine professionnelle';
    proNavLink.className = 'nav-cta';
    proNavLink.dataset.proAccess = 'true';
    proNavLink.setAttribute('aria-label', 'Accéder à la vitrine professionnelle de Michel Quinones');
    const firstMenuLink = navigation.querySelector('a');
    if (firstMenuLink) navigation.insertBefore(proNavLink, firstMenuLink);
    else navigation.appendChild(proNavLink);
  }

  const heroActions = document.querySelector('.hero-actions');
  if (heroActions && !heroActions.querySelector('[data-pro-access]')) {
    const proHeroLink = document.createElement('a');
    proHeroLink.href = proUrl;
    proHeroLink.textContent = '💼 Découvrir ma vitrine professionnelle';
    proHeroLink.className = 'btn btn-primary';
    proHeroLink.dataset.proAccess = 'true';
    proHeroLink.setAttribute('aria-label', 'Découvrir la vitrine professionnelle Communication et Valorisation');
    heroActions.appendChild(proHeroLink);
  }
})();

// Encadré public : sessions en bibliothèque et groupe WhatsApp facultatif.
(() => {
  if (document.getElementById('sessions-bibliotheque')) return;
  const contactSection = document.getElementById('contact');
  if (!contactSection) return;

  const section = document.createElement('section');
  section.id = 'sessions-bibliotheque';
  section.className = 'library-sessions-section';
  section.innerHTML = `
    <div class="container">
      <div class="library-sessions-card">
        <div class="library-sessions-copy">
          <div class="badge"><span class="pulse"></span> Sessions gratuites en petit groupe</div>
          <h2>Envie de participer à une session dans une bibliothèque ?</h2>
          <p>Selon les disponibilités et l'accord de la bibliothèque municipale, des rencontres gratuites peuvent être organisées dans une salle mise à disposition pour découvrir le numérique, l'intelligence artificielle, la sécurité en ligne, la création de projets et les outils que nous abordons ensemble.</p>
          <div class="check-list">
            <div class="check"><b>✓</b><span>Vous pouvez me signaler votre intérêt et les sujets que vous aimeriez travailler.</span></div>
            <div class="check"><b>✓</b><span>Les dates seront proposées en fonction des demandes et des créneaux réellement disponibles.</span></div>
            <div class="check"><b>✓</b><span>Vous pouvez aussi demander à rejoindre un groupe WhatsApp facultatif pour recevoir les informations, échanger et partager autour des matières traitées.</span></div>
          </div>
          <p class="library-privacy"><strong>WhatsApp :</strong> rejoindre le groupe reste entièrement facultatif. Dans un groupe WhatsApp classique, votre numéro de téléphone peut être visible par les autres membres.</p>
        </div>
        <div class="library-sessions-actions">
          <a class="btn btn-primary" href="https://compose.mail.yahoo.com/?to=quinones.michel%40yahoo.fr&subject=Int%C3%A9r%C3%AAt%20pour%20une%20session%20en%20biblioth%C3%A8que&body=Bonjour%20Michel%2C%0A%0AJe%20suis%20int%C3%A9r%C3%A9ss%C3%A9(e)%20par%20une%20session%20gratuite%20en%20biblioth%C3%A8que.%0A%0ASujets%20qui%20m%27int%C3%A9ressent%20%3A%0AMes%20disponibilit%C3%A9s%20%3A%0AJe%20souhaite%20%C3%AAtre%20inform%C3%A9(e)%20des%20prochaines%20dates%20%3A%20oui%20%2F%20non%0AJe%20souhaite%20recevoir%20des%20informations%20sur%20le%20groupe%20WhatsApp%20%3A%20oui%20%2F%20non%0A%0AMerci." target="_blank" rel="noopener">📚 Je suis intéressé(e)</a>
          <a class="btn btn-secondary" href="#contact">✉️ Autres moyens de contact</a>
        </div>
      </div>
    </div>`;

  const style = document.createElement('style');
  style.textContent = `
    .library-sessions-section{padding:72px 0;position:relative}
    .library-sessions-card{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(240px,.7fr);gap:28px;align-items:center;padding:34px;border:1px solid rgba(110,168,255,.24);border-radius:26px;background:linear-gradient(135deg,rgba(10,31,58,.94),rgba(8,18,34,.94));box-shadow:0 24px 70px rgba(0,0,0,.24)}
    .library-sessions-card h2{margin:16px 0 12px;font-size:clamp(1.8rem,4vw,2.7rem)}
    .library-sessions-card p{line-height:1.7}
    .library-sessions-actions{display:flex;flex-direction:column;gap:12px}
    .library-sessions-actions .btn{text-align:center;justify-content:center}
    .library-privacy{margin-top:18px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.055);font-size:.92rem}
    @media (max-width:780px){.library-sessions-card{grid-template-columns:1fr;padding:24px}.library-sessions-section{padding:52px 0}}
  `;
  document.head.appendChild(style);
  contactSection.parentNode.insertBefore(section, contactSection);

  if (navigation && !navigation.querySelector('a[href="#sessions-bibliotheque"]')) {
    const link = document.createElement('a');
    link.href = '#sessions-bibliotheque';
    link.textContent = 'Sessions';
    const contactLink = navigation.querySelector('a[href="#contact"]');
    navigation.insertBefore(link, contactLink || null);
  }
})();

function closeMenu() {
  if (!menuToggle || !navigation) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      menuToggle.focus();
    }
  });
}

// Animation légère des cartes au défilement, sans dépendance externe.
const animatedElements = document.querySelectorAll('.card,.step,.offer,.contact-box,.proof-box,.audio-box,.video-request,.project-card,.confidential-note,.timeline-stage,.case-study,.privacy-panel,.vision-step,.pillar,.support-use-panel,.library-sessions-card');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.animate([
          { opacity: 0, transform: 'translateY(26px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 650, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  animatedElements.forEach(el => {
    el.style.opacity = 0;
    observer.observe(el);
  });
}

// Questionnaire bénévole : navigation accessible et conservation locale uniquement.
const surveyPanel = document.getElementById('surveyPanel');
const surveyForm = document.getElementById('needsSurvey');
const surveyQuestions = Array.from(document.querySelectorAll('.survey-question'));
const surveyStep = document.getElementById('surveyStep');
const surveyProgress = document.getElementById('surveyProgress');
const surveyPrev = document.getElementById('surveyPrev');
const surveyNext = document.getElementById('surveyNext');
const surveySubmit = document.getElementById('surveySubmit');
const surveyError = document.getElementById('surveyError');
const surveySuccess = document.getElementById('surveySuccess');
const suggestion = surveyForm && surveyForm.elements.suggestion;
let currentSurveyQuestion = 0;
const surveyApi = 'https://etude-numerique-benevole.grial888.chatgpt.site/api/survey';

const surveyLabels = {
  aisance: {'pas-du-tout': "Pas du tout à l'aise", peu: "Peu à l'aise", simple: 'Usages simples', plutot: "Plutôt à l'aise", tres: "Très à l'aise"},
  besoins: {'prise-main': "Prise en main d'un appareil", demarches: 'Démarches numériques', installation: 'Installation et configuration', depannage: 'Dépannage informatique', securite: 'Sécurité et arnaques', fichiers: 'Photos et sauvegardes', communication: 'E-mails et visioconférence', ia: 'Intelligence artificielle'},
  format: {domicile: 'À domicile', distance: 'À distance', individuel: 'Rendez-vous individuel', atelier: 'Atelier en petit groupe', 'sans-preference': 'Sans préférence', aucun: 'Aucun actuellement'},
  disponibilites: {'semaine-matin': 'En semaine le matin', 'semaine-apres-midi': "En semaine l'après-midi", 'semaine-soir': 'En semaine le soir', samedi: 'Le samedi', variable: 'Selon les semaines'}
};

function getMostFrequent(counts, total) {
  const winner = Object.entries(counts || {}).sort((a, b) => b[1] - a[1])[0];
  if (!winner) return null;
  return {value: winner[0], count: Number(winner[1]), percent: Math.round((Number(winner[1]) / total) * 100)};
}

function updateStatCard(data, key, valueId, detailId, barId) {
  const result = data.thresholdReached ? getMostFrequent(data.counts[key], data.total) : null;
  const value = document.getElementById(valueId);
  const detail = document.getElementById(detailId);
  const bar = document.getElementById(barId);
  if (!result) {
    if (value) value.textContent = 'En attente';
    if (detail) detail.textContent = 'Aucune donnée regroupée pour le moment.';
    if (bar) bar.style.width = '0';
    return;
  }
  if (value) value.textContent = surveyLabels[key][result.value] || result.value;
  if (detail) detail.textContent = `${result.percent} % des participations`;
  if (bar) bar.style.width = `${Math.min(result.percent, 100)}%`;
}

function renderSurveyStats(data) {
  const total = document.getElementById('statTotal');
  if (total) total.textContent = String(data.total || 0);
  const totalLabel = document.querySelector('.stat-total p');
  if (totalLabel) totalLabel.textContent = `participation${data.total > 1 ? 's' : ''} enregistrée${data.total > 1 ? 's' : ''}`;
  updateStatCard(data, 'aisance', 'statAisance', 'statAisanceDetail', 'statAisanceBar');
  updateStatCard(data, 'besoins', 'statBesoin', 'statBesoinDetail', 'statBesoinBar');
  updateStatCard(data, 'format', 'statFormat', 'statFormatDetail', 'statFormatBar');
  updateStatCard(data, 'disponibilites', 'statDisponibilite', 'statDisponibiliteDetail', 'statDisponibiliteBar');
}

async function loadSurveyStats() {
  try {
    const response = await fetch(surveyApi, {headers: {'Accept': 'application/json'}});
    if (!response.ok) throw new Error('Statistiques indisponibles');
    const data = await response.json();
    renderSurveyStats(data);
    const count = document.getElementById('surveyCount');
    if (count) count.textContent = `${data.total} participation${data.total > 1 ? 's' : ''}`;
  } catch (error) {
    const scope = document.getElementById('statsScope');
    if (scope) scope.textContent = 'Le compteur partagé est momentanément indisponible.';
  }
}

function showSurveyQuestion(index) {
  currentSurveyQuestion = Math.max(0, Math.min(index, surveyQuestions.length - 1));
  surveyQuestions.forEach((question, position) => question.classList.toggle('is-active', position === currentSurveyQuestion));
  if (surveyStep) surveyStep.textContent = `Question ${currentSurveyQuestion + 1} sur ${surveyQuestions.length}`;
  if (surveyProgress) surveyProgress.style.width = `${((currentSurveyQuestion + 1) / surveyQuestions.length) * 100}%`;
  if (surveyPrev) surveyPrev.hidden = currentSurveyQuestion === 0;
  if (surveyNext) surveyNext.hidden = currentSurveyQuestion === surveyQuestions.length - 1;
  if (surveySubmit) surveySubmit.hidden = currentSurveyQuestion !== surveyQuestions.length - 1;
  if (surveyError) surveyError.textContent = '';
  const legend = surveyQuestions[currentSurveyQuestion].querySelector('legend');
  if (legend && index > 0) legend.focus?.();
}

function hasAnswer(question) {
  if (question.dataset.question === '10') return Boolean(surveyForm.elements.privacy_ack.checked);
  return Boolean(question.querySelector('input:checked'));
}

document.querySelectorAll('[data-max-choices]').forEach(group => {
  const limit = Number(group.dataset.maxChoices);
  group.addEventListener('change', event => {
    const checked = group.querySelectorAll('input:checked');
    if (checked.length > limit) {
      event.target.checked = false;
      if (surveyError) surveyError.textContent = `Vous pouvez choisir au maximum ${limit} réponses.`;
    } else if (surveyError) surveyError.textContent = '';
  });
});

const openSurvey = document.getElementById('openSurvey');
const closeSurvey = document.getElementById('closeSurvey');
if (openSurvey && surveyPanel) openSurvey.addEventListener('click', () => {
  surveyPanel.hidden = false;
  showSurveyQuestion(0);
  surveyPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
});
if (closeSurvey && surveyPanel) closeSurvey.addEventListener('click', () => {
  surveyPanel.hidden = true;
  openSurvey.focus();
});
if (surveyNext) surveyNext.addEventListener('click', () => {
  if (!hasAnswer(surveyQuestions[currentSurveyQuestion])) {
    surveyError.textContent = 'Choisissez au moins une réponse pour continuer.';
    return;
  }
  showSurveyQuestion(currentSurveyQuestion + 1);
});
if (surveyPrev) surveyPrev.addEventListener('click', () => showSurveyQuestion(currentSurveyQuestion - 1));
if (suggestion) suggestion.addEventListener('input', () => {
  const counter = document.getElementById('charCount');
  if (counter) counter.textContent = String(suggestion.value.length);
});

if (surveyForm) surveyForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!surveyForm.elements.privacy_ack.checked) {
    surveyError.textContent = 'Veuillez confirmer la notice de confidentialité.';
    return;
  }
  const payload = {};
  new FormData(surveyForm).forEach((value, key) => {
    if (key === 'privacy_ack' || key === 'suggestion') return;
    if (Object.prototype.hasOwnProperty.call(payload, key)) payload[key] = [].concat(payload[key], value);
    else payload[key] = value;
  });
  try {
    surveySubmit.disabled = true;
    surveySubmit.textContent = 'Envoi en cours…';
    const response = await fetch(surveyApi, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)});
    if (!response.ok) throw new Error('Envoi refusé');
    localStorage.setItem('michel_benevole_survey_done', '1');
  } catch (error) {
    surveyError.textContent = "La participation n'a pas pu être enregistrée. Vérifiez votre connexion et réessayez.";
    surveySubmit.disabled = false;
    surveySubmit.textContent = 'Valider ma participation';
    return;
  }
  surveyForm.hidden = true;
  surveySuccess.hidden = false;
  surveySuccess.focus();
  if (document.getElementById('surveyCount')) document.getElementById('surveyCount').textContent = 'Participation enregistrée';
  await loadSurveyStats();
});

try {
  if (localStorage.getItem('michel_benevole_survey_done') === '1' && document.getElementById('surveyCount')) {
    document.getElementById('surveyCount').textContent = 'Vous avez déjà participé sur cet appareil';
  }
} catch (error) {
  // Le questionnaire reste consultable si le stockage du navigateur est bloqué.
}
loadSurveyStats();
