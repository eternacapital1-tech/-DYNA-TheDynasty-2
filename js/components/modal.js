/* The Dynasty — Modal Component
   - API: DynastyModal.open({ title, image, imageAlt, caption, html })
          DynastyModal.close()
*/

(function () {
  'use strict';

  let modalEl = null;
  let dialogEl = null;
  let titleEl = null;
  let bodyEl = null;
  let closeBtn = null;
  let backdropEl = null;
  let lastFocused = null;

  function build() {
    modalEl = document.createElement('div');
    modalEl.className = 'modal';
    modalEl.id = 'dynasty-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-hidden', 'true');

    backdropEl = document.createElement('div');
    backdropEl.className = 'modal__backdrop';
    backdropEl.setAttribute('data-modal-close', 'true');

    dialogEl = document.createElement('div');
    dialogEl.className = 'modal__dialog';
    dialogEl.setAttribute('role', 'document');

    const headerEl = document.createElement('div');
    headerEl.className = 'modal__header';

    titleEl = document.createElement('h2');
    titleEl.className = 'modal__title';
    titleEl.id = 'dynasty-modal-title';

    closeBtn = document.createElement('button');
    closeBtn.className = 'modal__close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', 'Tutup');
    closeBtn.setAttribute('data-modal-close', 'true');
    closeBtn.textContent = '✕';

    headerEl.appendChild(titleEl);
    headerEl.appendChild(closeBtn);

    bodyEl = document.createElement('div');
    bodyEl.className = 'modal__body';

    dialogEl.appendChild(headerEl);
    dialogEl.appendChild(bodyEl);

    modalEl.appendChild(backdropEl);
    modalEl.appendChild(dialogEl);

    document.body.appendChild(modalEl);

    modalEl.setAttribute('aria-labelledby', 'dynasty-modal-title');

    modalEl.addEventListener('click', function (event) {
      const target = event.target;
      if (target && target.getAttribute && target.getAttribute('data-modal-close') === 'true') {
        close();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modalEl.classList.contains('is-open')) {
        close();
      }
    });
  }

  function lockBody(lock) {
    document.body.classList.toggle('is-locked', lock);
  }

  function open(options) {
    if (!modalEl) build();

    const opts = options || {};

    lastFocused = document.activeElement;

    titleEl.textContent = opts.title || 'Detail';
    bodyEl.textContent = '';

    if (opts.image) {
      const img = document.createElement('img');
      img.src = opts.image;
      img.alt = opts.imageAlt || opts.title || '';
      img.loading = 'lazy';
      bodyEl.appendChild(img);
    }

    if (opts.html) {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = opts.html;
      bodyEl.appendChild(wrapper);
    }

    if (opts.caption) {
      const caption = document.createElement('p');
      caption.className = 'modal__caption';
      caption.textContent = opts.caption;
      bodyEl.appendChild(caption);
    }

    modalEl.classList.add('is-open');
    modalEl.setAttribute('aria-hidden', 'false');
    lockBody(true);

    window.requestAnimationFrame(function () {
      closeBtn.focus();
    });
  }

  function close() {
    if (!modalEl) return;

    modalEl.classList.remove('is-open');
    modalEl.setAttribute('aria-hidden', 'true');
    lockBody(false);

    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  function init() {
    if (!document.getElementById('dynasty-modal')) {
      build();
    }
  }

  window.DynastyModal = { open: open, close: close, init: init };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();