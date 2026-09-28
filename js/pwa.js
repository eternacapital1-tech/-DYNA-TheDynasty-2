/* The Dynasty — PWA Registration */

(function () {
  'use strict';

  function register() {
    if (!('serviceWorker' in navigator)) return;

    const isSecure =
      window.location.protocol === 'https:' ||
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (!isSecure) return;

    const base = window.location.pathname.indexOf('/pages/') !== -1 ? '../' : './';

    navigator.serviceWorker.register(base + 'service-worker.js').catch(function () {
      // Registrasi gagal (misal: file tidak ditemukan atau browser membatasi).
      // Tidak ada aksi tambahan yang diperlukan; website tetap berjalan normal.
    });
  }

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register);
  }
})();