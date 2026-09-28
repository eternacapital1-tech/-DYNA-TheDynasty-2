/* The Dynasty — Animation System
   - Scroll reveal dengan IntersectionObserver
   - Parallax halus untuk hero
   - Partikel ambient untuk hero
   - Menghormati prefers-reduced-motion
*/

(function () {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Scroll Reveal
     --------------------------------------------------------- */

  function initReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(elements, function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          window.setTimeout(function () {
            el.classList.add('is-visible');
          }, isNaN(delay) ? 0 : delay);
          observer.unobserve(el);
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12
      }
    );

    Array.prototype.forEach.call(elements, function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------
     Parallax
     --------------------------------------------------------- */

  function initParallax() {
    if (prefersReducedMotion) return;

    const targets = document.querySelectorAll('[data-parallax]');
    if (!targets.length) return;

    let ticking = false;

    function update() {
      const scrollY = window.scrollY;
      Array.prototype.forEach.call(targets, function (el) {
        const speed = parseFloat(el.getAttribute('data-parallax')) || 0.15;
        const offset = scrollY * speed;
        el.style.transform = 'translate3d(0, ' + offset.toFixed(2) + 'px, 0) scale(1.06)';
      });
      ticking = false;
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------------------------------------------------------
     Ambient Particles (Hero)
     --------------------------------------------------------- */

  function initParticles() {
    const container = document.getElementById('hero-particles');
    if (!container) return;
    if (prefersReducedMotion) return;

    const isSmallScreen = window.innerWidth < 768;
    const count = isSmallScreen ? 12 : 24;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'hero-particle';

      const size = Math.random() * 5 + 2;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 12 + 10;
      const delay = Math.random() * 10;
      const driftX = (Math.random() - 0.5) * 120;

      particle.style.width = size.toFixed(2) + 'px';
      particle.style.height = size.toFixed(2) + 'px';
      particle.style.left = left.toFixed(2) + '%';
      particle.style.top = top.toFixed(2) + '%';
      particle.style.animationDuration = duration.toFixed(2) + 's';
      particle.style.animationDelay = delay.toFixed(2) + 's';
      particle.style.setProperty('--drift-x', driftX.toFixed(0) + 'px');

      fragment.appendChild(particle);
    }

    container.appendChild(fragment);
  }

  /* ---------------------------------------------------------
     Progress Bars (animasi saat masuk viewport)
     --------------------------------------------------------- */

  function initProgressBars() {
    const bars = document.querySelectorAll('.progress-bar__fill[data-progress]');
    if (!bars.length) return;

    function applyProgress(el) {
      const value = Math.max(0, Math.min(100, parseFloat(el.getAttribute('data-progress')) || 0));
      el.style.width = value + '%';
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(bars, applyProgress);
      return;
    }

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          applyProgress(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    Array.prototype.forEach.call(bars, function (el) {
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------
     Bootstrap
     --------------------------------------------------------- */

  function init() {
    initReveal();
    initParallax();
    initParticles();
    initProgressBars();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();