/* Progressive enhancement: content stays visible if JavaScript is unavailable. */
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window)) return;
  const targets = [...document.querySelectorAll('#mon-livre .book-copy, #mon-livre .book-cover, .section-head, .security-card, .about-copy')];
  let observer;
  function configure() {
    observer?.disconnect();
    targets.forEach(el => el.classList.remove('is-waiting', 'is-visible'));
    if (motion.matches) return;
    observer = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.remove('is-waiting');
        target.classList.add('is-visible');
        observer.unobserve(target);
      });
    }, { threshold: 0, rootMargin: '0px 0px 40px 0px' });
    targets.forEach(el => {
      el.classList.add('portfolio-reveal');
      // Animate only elements initially below the viewport; never hide visible text.
      if (el.getBoundingClientRect().top >= window.innerHeight) {
        el.classList.add('is-waiting');
        observer.observe(el);
      }
    });
  }
  configure();
  motion.addEventListener('change', configure);
  function pauseWhenHidden() {
    document.documentElement.classList.toggle('portfolio-effects-paused', document.hidden);
  }
  document.addEventListener('visibilitychange', pauseWhenHidden);
  pauseWhenHidden();
})();
