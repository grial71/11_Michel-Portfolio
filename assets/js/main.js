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

    if (surveyForm) surveyForm.addEventListener('submit', event => {
      event.preventDefault();
      if (!surveyForm.elements.privacy_ack.checked) {
        surveyError.textContent = 'Veuillez confirmer la notice de confidentialité.';
        return;
      }
      const payload = {};
      new FormData(surveyForm).forEach((value, key) => {
        if (key === 'privacy_ack') return;
        if (Object.prototype.hasOwnProperty.call(payload, key)) payload[key] = [].concat(payload[key], value);
        else payload[key] = value;
      });
      try {
        const localResponses = JSON.parse(localStorage.getItem('michel_benevole_survey') || '[]');
        localResponses.push({ answers: payload });
        localStorage.setItem('michel_benevole_survey', JSON.stringify(localResponses));
        localStorage.setItem('michel_benevole_survey_done', '1');
      } catch (error) {
        surveyError.textContent = "Votre navigateur empêche l'enregistrement local. Aucune donnée n'a été envoyée.";
        return;
      }
      surveyForm.hidden = true;
      surveySuccess.hidden = false;
      surveySuccess.focus();
      if (document.getElementById('surveyCount')) document.getElementById('surveyCount').textContent = 'Participation enregistrée sur cet appareil';
    });

    try {
      if (localStorage.getItem('michel_benevole_survey_done') === '1' && document.getElementById('surveyCount')) {
        document.getElementById('surveyCount').textContent = 'Vous avez déjà participé sur cet appareil';
      }
    } catch (error) {
      // Le questionnaire reste consultable si le stockage du navigateur est bloqué.
    }

