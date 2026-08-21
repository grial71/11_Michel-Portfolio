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

    function setAudioMessage(message) {
      if (audioStatus) audioStatus.textContent = message;
      if (miniAudioStatus) miniAudioStatus.textContent = message;
    }

    function updatePlayButtons() {
      const text = meditationAudio && !meditationAudio.paused ? '⏸️ Pause' : '▶️ Play';
      if (playPauseBtn) playPauseBtn.textContent = text;
      if (miniPlayPauseBtn) miniPlayPauseBtn.textContent = text;
    }

    async function toggleMeditationAudio() {
      if (!meditationAudio) return;
      try {
        if (meditationAudio.paused) {
          await meditationAudio.play();
          setAudioMessage('Musique en lecture.');
        } else {
          meditationAudio.pause();
          setAudioMessage('Musique en pause.');
        }
        updatePlayButtons();
      } catch (error) {
        setAudioMessage('Le fichier audio n’est pas trouvé ou le navigateur bloque la lecture. Vérifiez le dossier musique et le nom exact du fichier MP3.');
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
      setVolume(0.55);
      if (playPauseBtn) playPauseBtn.addEventListener('click', toggleMeditationAudio);
      if (miniPlayPauseBtn) miniPlayPauseBtn.addEventListener('click', toggleMeditationAudio);
      if (volumeControl) volumeControl.addEventListener('input', () => setVolume(volumeControl.value));
      if (miniVolumeControl) miniVolumeControl.addEventListener('input', () => setVolume(miniVolumeControl.value));

      meditationAudio.addEventListener('play', updatePlayButtons);
      meditationAudio.addEventListener('pause', updatePlayButtons);
      meditationAudio.addEventListener('ended', () => {
        updatePlayButtons();
        setAudioMessage('Musique terminée.');
      });
      meditationAudio.addEventListener('error', () => {
        setAudioMessage('Audio introuvable : créez un dossier musique et mettez-y le fichier MP3 avec le même nom que dans le code.');
      });
    }

    // Menu mobile accessible.
    const menuToggle = document.querySelector('.menu-toggle');
    const navigation = document.getElementById('navigation-principale');

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
    const animatedElements = document.querySelectorAll('.card,.step,.offer,.contact-box,.proof-box,.audio-box,.video-request,.project-card,.confidential-note,.timeline-stage,.case-study,.privacy-panel,.vision-step,.pillar,.support-use-panel');
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

