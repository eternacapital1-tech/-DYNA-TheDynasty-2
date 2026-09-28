/* The Dynasty — Navigation
   Menangani: scroll state navbar, mobile menu, active page, smooth close.
*/

(function () {
  'use strict';

  const SCROLL_THRESHOLD = 40;
  const MOBILE_BREAKPOINT = 1100;

  let header = null;
  let nav = null;
  let toggle = null;
  let backdrop = null;
  let isOpen = false;
  let ticking = false;

  function updateScrollState() {
    if (!header) return;
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      updateScrollState();
      ticking = false;
    });
  }

  function lockBody(lock) {
    document.body.classList.toggle('is-locked', lock);
  }

  function openMenu() {
    if (!nav || !toggle) return;
    isOpen = true;
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Tutup menu');
    if (backdrop) backdrop.classList.add('is-open');
    lockBody(true);
  }

  function closeMenu() {
    if (!nav || !toggle) return;
    isOpen = false;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Buka menu');
    if (backdrop) backdrop.classList.remove('is-open');
    lockBody(false);
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function handleResize() {
    if (window.innerWidth > MOBILE_BREAKPOINT && isOpen) {
      closeMenu();
    }
  }

  function handleKeydown(event) {
    if (event.key === 'Escape' && isOpen) {
      closeMenu();
      if (toggle) toggle.focus();
    }
  }

  function init() {
    header = document.getElementById('dynasty-header');
    nav = document.getElementById('dynasty-nav-menu');
    toggle = document.getElementById('dynasty-nav-toggle');
    backdrop = document.getElementById('dynasty-menu-backdrop');

    if (!header || !nav || !toggle) return;

    updateScrollState();
    window.addEventListener('scroll', onScroll, { passive: true });

    toggle.addEventListener('click', toggleMenu);

    if (backdrop) {
      backdrop.addEventListener('click', closeMenu);
    }

    // Tutup menu setelah memilih link (mobile)
    nav.addEventListener('click', function (event) {
      const link = event.target.closest('a');
      if (link && isOpen) {
        closeMenu();
      }
    });

    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleKeydown);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();