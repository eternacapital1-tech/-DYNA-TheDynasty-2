/* The Dynasty — News Page */

(function () {
  'use strict';

  function getBasePath() {
    return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : './';
  }

  function buildNewsCard(item, base) {
    const article = document.createElement('article');
    article.className = 'news-card';

    const media = document.createElement('div');
    media.className = 'news-card__media';

    if (item.image) {
      const img = document.createElement('img');
      img.src = base + item.image;
      img.alt = item.title || 'Gambar berita';
      img.loading = 'lazy';

      img.addEventListener('error', function () {
        media.textContent = '';
        media.classList.add('news-card__media--empty');
        const span = document.createElement('span');
        span.textContent = 'Gambar belum tersedia';
        media.appendChild(span);
      });

      media.appendChild(img);
    } else {
      media.classList.add('news-card__media--empty');
      const span = document.createElement('span');
      span.textContent = 'Gambar belum tersedia';
      media.appendChild(span);
    }

    const body = document.createElement('div');
    body.className = 'news-card__body';

    const meta = document.createElement('div');
    meta.className = 'news-card__meta';

    if (item.category) {
      const cat = document.createElement('span');
      cat.className = 'news-card__category';
      cat.textContent = item.category;
      meta.appendChild(cat);
    }

    if (item.date) {
      const date = document.createElement('span');
      date.textContent = item.date;
      meta.appendChild(date);
    }

    if (meta.childNodes.length) {
      body.appendChild(meta);
    }

    const title = document.createElement('h2');
    title.className = 'news-card__title';
    title.textContent = item.title || 'Tanpa judul';
    body.appendChild(title);

    if (item.excerpt) {
      const excerpt = document.createElement('p');
      excerpt.className = 'news-card__excerpt';
      excerpt.textContent = item.excerpt;
      body.appendChild(excerpt);
    }

    if (item.link) {
      const link = document.createElement('a');
      link.className = 'news-card__link';
      link.href = item.link;
      link.textContent = 'Baca selengkapnya →';
      if (/^https?:\/\//i.test(item.link)) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      body.appendChild(link);
    }

    article.appendChild(media);
    article.appendChild(body);

    return article;
  }

  function showEmpty(list, status, title, text) {
    list.textContent = '';
    status.hidden = false;
    status.className = 'news-status';

    const box = document.createElement('div');
    box.className = 'empty-state';

    const icon = document.createElement('p');
    icon.className = 'empty-state__icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = '✦';

    const titleEl = document.createElement('p');
    titleEl.className = 'empty-state__title';
    titleEl.textContent = title;

    const textEl = document.createElement('p');
    textEl.className = 'empty-state__text';
    textEl.textContent = text;

    box.appendChild(icon);
    box.appendChild(titleEl);
    box.appendChild(textEl);

    status.appendChild(box);
  }

  function init() {
    const list = document.getElementById('news-list');
    const status = document.getElementById('news-status');
    if (!list || !status) return;

    const base = getBasePath();

    fetch(base + 'data/news.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        const items = Array.isArray(data && data.items) ? data.items : [];

        if (!items.length) {
          showEmpty(
            list,
            status,
            'Belum ada berita terbaru',
            'Pengumuman dan kabar aliansi akan muncul di halaman ini begitu tersedia.'
          );
          return;
        }

        status.hidden = true;
        list.textContent = '';

        items.forEach(function (item) {
          list.appendChild(buildNewsCard(item, base));
        });
      })
      .catch(function () {
        showEmpty(
          list,
          status,
          'Data berita tidak dapat dimuat',
          'Periksa koneksi Anda lalu muat ulang halaman ini.'
        );
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();