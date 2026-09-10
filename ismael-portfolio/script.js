const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const translations = {
  fr: {
    navProfile:'Profil', navPortfolio:'Portfolio', navPerformance:'Performance', navJourney:'Approche', navContact:'Contact',
    heroEyebrow:'Natural Athletic Model · Fitness · Lifestyle', heroTagline:'Discipline. Nutrition. Constance.', heroPortfolio:'Voir le portfolio', heroCollab:'Collaboration', scroll:'DÉFILER ↓',
    profileLabel:'Profil', profileTitle:'Un physique construit par la constance.', profileText:"Ismaël développe son physique par l'entraînement régulier, une alimentation structurée et la persévérance. Cette page présentera son profil de modèle sportif, son évolution et son univers visuel.", profileNote:"Le texte définitif sera rédigé avec Ismaël afin de rester fidèle à son parcours et à sa méthode.",
    height:'Taille', weight:'Poids', chest:'Poitrine', waist:'Tour de taille', shoe:'Pointure', location:'Localisation', complete:'À compléter',
    workLabel:'Sélection', physique:'Physique', portrait:'Portrait', training:'Entraînement', lifestyle:'Lifestyle / Sportswear', editorial:'Éditorial',
    performanceTitle:'Des résultats qui se mesurent.', perf:'Performance', document:'À documenter',
    journeyLabel:'Parcours naturel', journeyTitle:'Pas de raccourci.<br>Une méthode.', trainingDesc:'Régularité, progression et exécution.', nutrition:'Nutrition', nutritionDesc:'Une alimentation adaptée à ses objectifs.', recovery:'Récupération', recoveryDesc:"Sommeil, repos et gestion de l'effort.", perseverance:'Persévérance', perseveranceDesc:'La progression se construit dans le temps.',
    available:'Disponible pour', collabLine:'SPORTSWEAR · FITNESS · LIFESTYLE · ÉDITORIAL · CAMPAGNES · CONTENU ·', workWith:'Travailler avec Ismaël', contactTitle:'Construisons quelque chose de fort.', contactText:'Disponible pour shootings, contenus sportifs, campagnes sportswear, fitness et lifestyle.', proContact:'Contact professionnel', modelCard:'Model Card — bientôt', footer:'Natural Athletic Model'
  },
  es: {
    navProfile:'Perfil', navPortfolio:'Portafolio', navPerformance:'Rendimiento', navJourney:'Enfoque', navContact:'Contacto',
    heroEyebrow:'Modelo Atlético Natural · Fitness · Lifestyle', heroTagline:'Disciplina. Nutrición. Constancia.', heroPortfolio:'Ver el portafolio', heroCollab:'Colaboración', scroll:'DESLIZA ↓',
    profileLabel:'Perfil', profileTitle:'Un físico construido con constancia.', profileText:'Ismaël desarrolla su físico mediante un entrenamiento regular, una alimentación estructurada y perseverancia. Esta página presenta su perfil como modelo deportivo, su evolución y su universo visual.', profileNote:'El texto definitivo se redactará con Ismaël para mantenerse fiel a su trayectoria y a su método.',
    height:'Altura', weight:'Peso', chest:'Pecho', waist:'Cintura', shoe:'Calzado', location:'Ubicación', complete:'Por completar',
    workLabel:'Selección', physique:'Físico', portrait:'Retrato', training:'Entrenamiento', lifestyle:'Lifestyle / Sportswear', editorial:'Editorial',
    performanceTitle:'Resultados que se pueden medir.', perf:'Rendimiento', document:'Por documentar',
    journeyLabel:'Trayectoria natural', journeyTitle:'Sin atajos.<br>Un método.', trainingDesc:'Regularidad, progresión y ejecución.', nutrition:'Nutrición', nutritionDesc:'Una alimentación adaptada a sus objetivos.', recovery:'Recuperación', recoveryDesc:'Sueño, descanso y gestión del esfuerzo.', perseverance:'Perseverancia', perseveranceDesc:'El progreso se construye con el tiempo.',
    available:'Disponible para', collabLine:'SPORTSWEAR · FITNESS · LIFESTYLE · EDITORIAL · CAMPAÑAS · CONTENIDO ·', workWith:'Trabaja con Ismaël', contactTitle:'Construyamos algo fuerte.', contactText:'Disponible para sesiones fotográficas, contenido deportivo y campañas de sportswear, fitness y lifestyle.', proContact:'Contacto profesional', modelCard:'Model Card — próximamente', footer:'Modelo Atlético Natural'
  },
  en: {
    navProfile:'Profile', navPortfolio:'Portfolio', navPerformance:'Performance', navJourney:'Approach', navContact:'Contact',
    heroEyebrow:'Natural Athletic Model · Fitness · Lifestyle', heroTagline:'Discipline. Nutrition. Consistency.', heroPortfolio:'View Portfolio', heroCollab:'Collaboration', scroll:'SCROLL ↓',
    profileLabel:'Profile', profileTitle:'A physique built through consistency.', profileText:'Ismaël develops his physique through consistent training, structured nutrition and perseverance. This page presents his athletic model profile, progression and visual universe.', profileNote:'The final text will be written with Ismaël to remain faithful to his journey and method.',
    height:'Height', weight:'Weight', chest:'Chest', waist:'Waist', shoe:'Shoe size', location:'Location', complete:'To complete',
    workLabel:'Selected Work', physique:'Physique', portrait:'Portrait', training:'Training', lifestyle:'Lifestyle / Sportswear', editorial:'Editorial',
    performanceTitle:'Results you can measure.', perf:'Performance', document:'To document',
    journeyLabel:'Natural Journey', journeyTitle:'No shortcuts.<br>A method.', trainingDesc:'Consistency, progression and execution.', nutrition:'Nutrition', nutritionDesc:'Nutrition tailored to his goals.', recovery:'Recovery', recoveryDesc:'Sleep, rest and effort management.', perseverance:'Perseverance', perseveranceDesc:'Progress is built over time.',
    available:'Available For', collabLine:'SPORTSWEAR · FITNESS · LIFESTYLE · EDITORIAL · CAMPAIGNS · CONTENT ·', workWith:'Work With Ismaël', contactTitle:"Let's build something strong.", contactText:'Available for shoots, sports content, sportswear, fitness and lifestyle campaigns.', proContact:'Professional Contact', modelCard:'Model Card — coming soon', footer:'Natural Athletic Model'
  }
};

function applyLanguage(lang) {
  const t = translations[lang] || translations.fr;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.innerHTML = t[key];
  });
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const active = btn.dataset.lang === lang;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
  localStorage.setItem('ismael-language', lang);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLanguage(btn.dataset.lang));
});

applyLanguage(localStorage.getItem('ismael-language') || 'fr');
document.getElementById('year').textContent = new Date().getFullYear();
