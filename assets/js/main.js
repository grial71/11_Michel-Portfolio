// Boutons historiques : délégation au contrôleur unique V3.
function changeLanguage(lang) {
  if (typeof window.v3SelectLanguage === 'function') window.v3SelectLanguage(lang);
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
    .library-sessions-card{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(240px,.7fr);gap:28px;align-items:center;padding:34px;border:1px solid rgba(110,168,255,.24);border-radius:26px;background:linear-gradient(135deg,rgba(10,31,58,.96),rgba(8,18,34,.96));box-shadow:0 24px 70px rgba(0,0,0,.24);color:#f4f8fa}
    .library-sessions-card h2{margin:16px 0 12px;font-size:clamp(1.8rem,4vw,2.7rem);color:#fff}
    .library-sessions-card p{line-height:1.7;color:#d9e6eb}
    .library-sessions-card .check{color:#d9e6eb}
    .library-sessions-card .check b{color:#73c995}
    .library-sessions-card .badge{color:#a7eee4;border-color:rgba(128,226,215,.35);background:rgba(18,54,64,.72)}
    .library-sessions-actions{display:flex;flex-direction:column;gap:12px}
    .library-sessions-actions .btn{text-align:center;justify-content:center}
    .library-sessions-actions .btn-secondary{background:rgba(255,255,255,.92);color:#20313a;border-color:rgba(255,255,255,.28)}
    .library-sessions-actions .btn-secondary:hover{background:#fff;color:#20313a}
    .library-privacy{margin-top:18px;padding:12px 14px;border-radius:14px;background:rgba(255,255,255,.07);font-size:.92rem;color:#c8d8de!important}
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

const portfolioHeader = document.querySelector('#accueil.cinematic-hero')
  ? navigation?.closest('nav')
  : null;
if (portfolioHeader) {
  let headerOffset = 0;
  let viewportWidth = window.innerWidth;
  let viewportHeight = window.innerHeight;
  let alignedTarget = null;

  const rememberAlignedAnchor = () => {
    if (viewportWidth !== window.innerWidth || viewportHeight !== window.innerHeight) return;
    const target = document.querySelector(':target');
    const margin = target ? parseFloat(getComputedStyle(target).scrollMarginTop) || 0 : 0;
    alignedTarget = target && Math.abs(target.getBoundingClientRect().top - headerOffset - margin) <= 2
      ? target
      : null;
  };
  const updateAnchorOffset = () => {
    const offset = Math.ceil(portfolioHeader.getBoundingClientRect().height) + 12;
    if (offset === headerOffset && viewportWidth === window.innerWidth
        && viewportHeight === window.innerHeight) return;
    const target = alignedTarget === document.querySelector(':target') ? alignedTarget : null;
    headerOffset = offset;
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    document.documentElement.style.setProperty('--portfolio-header-offset', `${offset}px`);
    if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' });
    rememberAlignedAnchor();
  };
  updateAnchorOffset();
  window.addEventListener('scroll', rememberAlignedAnchor, { passive: true });
  window.addEventListener('hashchange', rememberAlignedAnchor);
  window.addEventListener('resize', updateAnchorOffset);
  if ('ResizeObserver' in window) {
    const headerObserver = new ResizeObserver(updateAnchorOffset);
    headerObserver.observe(portfolioHeader);
  }
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

// Le fond photo est disponible avant tout chargement de la vidéo décorative.
const heroVideo = document.querySelector('#accueil .hero-bg-video');
const heroVideoSource = heroVideo?.querySelector('source[data-src]');
if (heroVideoSource) {
  const videoAllowed = window.matchMedia('(min-width: 981px) and (prefers-reduced-motion: no-preference)');
  const updateHeroVideo = () => {
    if (videoAllowed.matches && !heroVideo.hasAttribute('src')) {
      heroVideo.src = heroVideoSource.dataset.src;
    } else if (!videoAllowed.matches && heroVideo.hasAttribute('src')) {
      heroVideo.pause();
      heroVideo.removeAttribute('src');
      heroVideo.load();
    }
  };
  updateHeroVideo();
  videoAllowed.addEventListener('change', updateHeroVideo);
}

// Animation légère des cartes au défilement, sans dépendance externe.
const animatedElements = document.querySelectorAll('.card,.step,.offer,.contact-box,.proof-box,.audio-box,.video-request,.project-card,.confidential-note,.timeline-stage,.case-study,.privacy-panel,.vision-step,.pillar,.support-use-panel,.library-sessions-card');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!reduceMotion.matches && 'IntersectionObserver' in window && 'animate' in Element.prototype) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!reduceMotion.matches) {
          entry.target.animate([
            { transform: 'translateY(8px)' },
            { transform: 'translateY(0)' }
          ], { duration: 360, easing: 'ease-out' });
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12 });

  animatedElements.forEach(el => observer.observe(el));
}

// Questionnaire externe supprimé : aucune collecte ni connexion à l’API d’étude.
