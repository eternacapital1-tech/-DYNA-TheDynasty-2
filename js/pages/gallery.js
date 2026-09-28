/* The Dynasty — Gallery Page
   Membaca gambar dari assets/images/gallery/.
   Gambar yang tidak ditemukan otomatis diabaikan.
*/

(function () {
  'use strict';

  // Daftar nama file yang diharapkan ada di assets/images/gallery/.
  // Tambahkan atau kurangi sesuai isi folder Anda.
  const GALLERY_FILES = [
    'gallery-01.jpg',
    'gallery-02.jpg',
    'gallery-03.jpg',
    'gallery-04.jpg',
    'gallery-05.jpg',
    'gallery-06.jpg',
    'gallery-07.jpg',
    'gallery-08.jpg',
    'gallery-09.jpg',
    'gallery-10.jpg',
    'gallery-11.jpg',
    'gallery-12.jpg'
  ];

  function getBasePath() {
    return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : './';
  }

  function buildTitleFromFile(filename) {
    const withoutExt = filename.replace(/\.[^.]+$/, '');
    const spaced = withoutExt.replace(/[-_]+/g, ' ');
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  function buildGalleryItem(file, base, index) {
    const button = document.createElement('button');
    button.className = 'gallery-item';
    button.type = 'button';
    button.setAttribute('aria-label', 'Buka gambar: ' + buildTitleFromFile(file));

    const img = document.createElement('img');
    img.src = base + 'assets/images/gallery/' + file;
    img.alt = buildTitleFromFile(file);
    img.loading = 'lazy';

    const overlay = document.createElement('div');
    overlay.className = 'gallery-item__overlay';

    const overlayLabel = document.createElement('span');
    overlayLabel.textContent = 'Lihat';
    overlay.appendChild(overlayLabel);

    button.appendChild(img);
    button.appendChild(overlay);

    button.addEventListener('click', function () {
      if (window.DynastyModal) {
        window.DynastyModal.open({
          title: buildTitleFromFile(file),
          image: base + 'assets/images/gallery/' + file,
          imageAlt: buildTitleFromFile(file),
          caption: 'The Dynasty — Gallery'
        });
      }
    });

    // Simpan index untuk urutan stabil
    button.setAttribute('data-index', String(index));

    return button;
  }

  function showEmptyState(grid, status) {
    grid.textContent = '';
    status.hidden = false;
    status.className = 'gallery-status';
    status.innerHTML =
      '<div class="empty-state">' +
      '<p class="empty-state__icon" aria-hidden="true">🖼</p>' +
      '<p class="empty-state__title">Belum ada gambar galeri</p>' +
      '<p class="empty-state__text">' +
      'Tambahkan gambar ke folder <strong>assets/images/gallery/</strong> dengan nama ' +
      '<strong>gallery-01.jpg</strong> hingga <strong>gallery-12.jpg</strong>, ' +
      'lalu muat ulang halaman ini.' +
      '</p>' +
      '</div>';
  }

  function probeImage(src) {
    return new Promise(function (resolve) {
      const probe = new Image();
      probe.onload = function () { resolve(true); };
      probe.onerror = function () { resolve(false); };
      probe.src = src;
    });
  }

  function init() {
    const grid = document.getElementById('gallery-grid');
    const status = document.getElementById('gallery-status');
    if (!grid || !status) return;

    const base = getBasePath();

    const checks = GALLERY_FILES.map(function (file) {
      const src = base + 'assets/images/gallery/' + file;
      return probeImage(src).then(function (ok) {
        return ok ? file : null;
      });
    });

    Promise.all(checks).then(function (results) {
      const available = results.filter(Boolean);

      if (!available.length) {
        showEmptyState(grid, status);
        return;
      }

      status.hidden = true;
      grid.textContent = '';

      available.forEach(function (file, index) {
        grid.appendChild(buildGalleryItem(file, base, index));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();