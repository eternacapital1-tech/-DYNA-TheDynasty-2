/* The Dynasty — Application Bootstrap
   Menangani:
   - Inisialisasi modul global
   - Halaman Ranks (data/ranks.json)
   - Form feedback berbasis mailto
*/

(function () {
  'use strict';

  const FEEDBACK_EMAIL = 'apphubid@gmail.com';
  const FEEDBACK_SUBJECT = 'The Dynasty Website Feedback';

  function getBasePath() {
    return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : './';
  }

  /* ---------------------------------------------------------
     Ranks Page
     --------------------------------------------------------- */

  const RANK_ORDER = ['P5', 'P4', 'P3', 'P2', 'P1'];

  function renderRankCard(rank) {
    const card = document.createElement('article');
    card.className = 'rank-card';
    if (rank.code === 'P5') {
      card.classList.add('rank-card--top');
    }

    const code = document.createElement('span');
    code.className = 'rank-card__code';
    code.textContent = rank.code || '—';
    card.appendChild(code);

    const name = document.createElement('h3');
    name.className = 'rank-card__name';
    name.textContent = rank.name || 'Rank ' + (rank.code || '');
    card.appendChild(name);

    const desc = document.createElement('p');
    desc.className = rank.description ? 'rank-card__desc' : 'rank-card__empty';
    desc.textContent = rank.description || 'Deskripsi rank belum tersedia.';
    card.appendChild(desc);

    return card;
  }

  function renderRanksError(container, message) {
    container.textContent = '';
    const box = document.createElement('div');
    box.className = 'empty-state';
    box.innerHTML =
      '<p class="empty-state__icon" aria-hidden="true">⚠</p>' +
      '<p class="empty-state__title">Data rank tidak dapat dimuat</p>';
    const text = document.createElement('p');
    text.className = 'empty-state__text';
    text.textContent = message;
    box.appendChild(text);
    container.appendChild(box);
  }

  function initRanksPage() {
    const container = document.getElementById('rank-list');
    if (!container) return;

    const base = getBasePath();

    fetch(base + 'data/ranks.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('HTTP ' + response.status);
        }
        return response.json();
      })
      .then(function (data) {
        const ranks = Array.isArray(data && data.ranks) ? data.ranks : [];
        if (!ranks.length) {
          renderRanksError(container, 'Belum ada data rank yang tersedia saat ini.');
          return;
        }

        const sorted = ranks.slice().sort(function (a, b) {
          const ai = RANK_ORDER.indexOf(a.code);
          const bi = RANK_ORDER.indexOf(b.code);
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });

        container.textContent = '';
        sorted.forEach(function (rank) {
          container.appendChild(renderRankCard(rank));
        });
      })
      .catch(function () {
        renderRanksError(
          container,
          'Periksa koneksi Anda atau buka kembali halaman ini nanti.'
        );
      });
  }

  /* ---------------------------------------------------------
     Feedback Form (mailto)
     --------------------------------------------------------- */

  function setFieldError(field, hasError) {
    const wrapper = field.closest('.field');
    const errorEl = document.getElementById(field.id + '-error');
    if (wrapper) {
      wrapper.classList.toggle('is-invalid', hasError);
    }
    if (errorEl) {
      errorEl.hidden = !hasError;
    }
    field.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function validateFeedbackForm(form) {
    const name = form.elements.name;
    const email = form.elements.email;
    const category = form.elements.category;
    const message = form.elements.message;

    let valid = true;

    const nameOk = name.value.trim().length >= 2;
    setFieldError(name, !nameOk);
    if (!nameOk) valid = false;

    const emailOk = isValidEmail(email.value.trim());
    setFieldError(email, !emailOk);
    if (!emailOk) valid = false;

    const categoryOk = category.value.trim() !== '';
    setFieldError(category, !categoryOk);
    if (!categoryOk) valid = false;

    const messageOk = message.value.trim().length >= 10;
    setFieldError(message, !messageOk);
    if (!messageOk) valid = false;

    return valid;
  }

  function buildMailtoBody(name, email, category, message) {
    const lines = [
      'Nama: ' + name,
      'Email: ' + email,
      'Kategori: ' + category,
      '',
      'Feedback:',
      message,
      '',
      '---',
      'Dikirim dari website The Dynasty'
    ];
    return lines.join('\n');
  }

  function initFeedbackForm() {
    const form = document.getElementById('feedback-form');
    if (!form) return;

    const status = document.getElementById('feedback-status');

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      if (!status) return;

      status.classList.remove('is-error', 'is-success');
      status.textContent = '';

      if (!validateFeedbackForm(form)) {
        status.textContent = 'Mohon lengkapi seluruh kolom yang wajib diisi.';
        status.classList.add('is-error');
        const firstInvalid = form.querySelector('.field.is-invalid .field__input');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const category = form.elements.category.value;
      const message = form.elements.message.value.trim();

      const mailto =
        'mailto:' +
        FEEDBACK_EMAIL +
        '?subject=' +
        encodeURIComponent(FEEDBACK_SUBJECT) +
        '&body=' +
        encodeURIComponent(buildMailtoBody(name, email, category, message));

      status.textContent =
        'Email draft berhasil disiapkan. Silakan kirim melalui aplikasi email Anda.';
      status.classList.add('is-success');

      window.location.href = mailto;
    });

    form.addEventListener('reset', function () {
      Array.prototype.forEach.call(form.querySelectorAll('.field'), function (field) {
        field.classList.remove('is-invalid');
      });
      Array.prototype.forEach.call(form.querySelectorAll('.field__error'), function (el) {
        el.hidden = true;
      });
      if (status) {
        status.classList.remove('is-error', 'is-success');
        status.textContent = '';
      }
    });

    Array.prototype.forEach.call(form.querySelectorAll('.field__input'), function (input) {
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('is-invalid')) {
          setFieldError(input, false);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     Bootstrap
     --------------------------------------------------------- */

  function bootstrap() {
    // Modul global diinisialisasi lebih awal oleh masing-masing script
    // (navbar, footer, modal, navigation, animation) pada DOMContentLoaded.
    // Di sini kita hanya menangani hal yang bersifat lintas halaman.

    initRanksPage();
    initFeedbackForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();