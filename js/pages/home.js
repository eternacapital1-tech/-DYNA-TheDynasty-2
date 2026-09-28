/* The Dynasty — Home Page */

(function () {
  'use strict';

  function getBasePath() {
    return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : './';
  }

  function formatNumber(value) {
    if (typeof value !== 'number' || !isFinite(value)) return null;
    return new Intl.NumberFormat('id-ID').format(value);
  }

  function displayValue(value, suffix) {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    if (typeof value === 'number') {
      const formatted = formatNumber(value);
      if (formatted === null) return '—';
      return suffix ? formatted + suffix : formatted;
    }
    return String(value);
  }

  /* ---------------------------------------------------------
     Server Preview
     --------------------------------------------------------- */

  function buildServerPreview(server, base) {
    const article = document.createElement('article');
    article.className = 'server-preview';

    const media = document.createElement('div');
    media.className = 'server-preview__media';

    if (server.image) {
      const img = document.createElement('img');
      img.src = base + server.image;
      img.alt = 'Server ' + server.server + ' — ' + server.alliance;
      img.loading = 'lazy';

      img.addEventListener('error', function () {
        media.textContent = '';
        media.classList.add('server-preview__media--empty');
        const label = document.createElement('span');
        label.textContent = 'Gambar belum tersedia';
        media.appendChild(label);
      });

      media.appendChild(img);
    } else {
      media.classList.add('server-preview__media--empty');
      const label = document.createElement('span');
      label.textContent = 'Gambar belum tersedia';
      media.appendChild(label);
    }

    const body = document.createElement('div');
    body.className = 'server-preview__body';

    const name = document.createElement('h3');
    name.className = 'server-preview__name';
    name.textContent = server.alliance || ('Server ' + server.server);
    body.appendChild(name);

    const meta = document.createElement('div');
    meta.className = 'server-preview__meta';

    const statusItem = document.createElement('span');
    statusItem.textContent = 'Status: ';
    const statusStrong = document.createElement('strong');
    statusStrong.textContent = server.status || 'Data belum tersedia';
    statusItem.appendChild(statusStrong);
    meta.appendChild(statusItem);

    if (server.level !== null && server.level !== undefined) {
      const levelItem = document.createElement('span');
      levelItem.textContent = 'Level: ';
      const levelStrong = document.createElement('strong');
      levelStrong.textContent = String(server.level);
      levelItem.appendChild(levelStrong);
      meta.appendChild(levelItem);
    }

    if (server.power !== null && server.power !== undefined) {
      const powerItem = document.createElement('span');
      powerItem.textContent = 'Power: ';
      const powerStrong = document.createElement('strong');
      powerStrong.textContent = displayValue(server.power);
      powerItem.appendChild(powerStrong);
      meta.appendChild(powerItem);
    }

    body.appendChild(meta);

    const link = document.createElement('a');
    link.className = 'link-arrow';
    link.href = base + 'pages/servers.html';
    link.textContent = 'Lihat detail server';
    body.appendChild(link);

    article.appendChild(media);
    article.appendChild(body);

    return article;
  }

  function renderServers(servers, base) {
    const grid = document.getElementById('home-server-grid');
    if (!grid) return;

    grid.textContent = '';

    if (!servers.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML =
        '<p class="empty-state__icon" aria-hidden="true">◈</p>' +
        '<p class="empty-state__title">Data server belum tersedia</p>' +
        '<p class="empty-state__text">Silakan periksa kembali nanti.</p>';
      grid.appendChild(empty);
      return;
    }

    servers.forEach(function (server) {
      grid.appendChild(buildServerPreview(server, base));
    });
  }

  /* ---------------------------------------------------------
     Statistics
     --------------------------------------------------------- */

  function buildStat(value, label) {
    const stat = document.createElement('div');
    stat.className = 'stat';

    const valueEl = document.createElement('span');
    valueEl.className = 'stat__value';
    valueEl.textContent = value;

    const labelEl = document.createElement('span');
    labelEl.className = 'stat__label';
    labelEl.textContent = label;

    stat.appendChild(valueEl);
    stat.appendChild(labelEl);

    return stat;
  }

  function renderStats(servers, dynasty) {
    const container = document.getElementById('home-stats');
    if (!container) return;

    container.textContent = '';

    const serverCount = servers.length;

    const totalPower = servers.reduce(function (sum, s) {
      return sum + (typeof s.power === 'number' ? s.power : 0);
    }, 0);

    const maxLevel = servers.reduce(function (max, s) {
      if (typeof s.level === 'number' && s.level > max) return s.level;
      return max;
    }, 0);

    const activeRanks = servers.reduce(function (sum, s) {
      return sum + (typeof s.totalMembers === 'number' ? s.totalMembers : 0);
    }, 0);

    container.appendChild(buildStat(String(serverCount), 'Server Aktif'));

    if (totalPower > 0) {
      container.appendChild(buildStat(formatNumber(totalPower), 'Total Power'));
    } else {
      container.appendChild(buildStat('—', 'Total Power'));
    }

    if (maxLevel > 0) {
      container.appendChild(buildStat(String(maxLevel), 'Level Tertinggi'));
    } else {
      container.appendChild(buildStat('—', 'Level Tertinggi'));
    }

    if (activeRanks > 0) {
      container.appendChild(buildStat(formatNumber(activeRanks), 'Total Slot Rank'));
    } else {
      container.appendChild(buildStat('—', 'Total Slot Rank'));
    }

    if (dynasty && dynasty.tagline) {
      container.setAttribute('data-tagline', dynasty.tagline);
    }
  }

  /* ---------------------------------------------------------
     News Preview
     --------------------------------------------------------- */

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
        const label = document.createElement('span');
        label.textContent = 'Gambar belum tersedia';
        media.appendChild(label);
      });

      media.appendChild(img);
    } else {
      media.classList.add('news-card__media--empty');
      const label = document.createElement('span');
      label.textContent = 'Gambar belum tersedia';
      media.appendChild(label);
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

    body.appendChild(meta);

    const title = document.createElement('h3');
    title.className = 'news-card__title';
    title.textContent = item.title || 'Tanpa judul';
    body.appendChild(title);

    if (item.excerpt) {
      const excerpt = document.createElement('p');
      excerpt.className = 'news-card__excerpt';
      excerpt.textContent = item.excerpt;
      body.appendChild(excerpt);
    }

    article.appendChild(media);
    article.appendChild(body);

    return article;
  }

  function renderNews(items, base) {
    const grid = document.getElementById('home-news-grid');
    if (!grid) return;

    grid.textContent = '';

    if (!items.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.style.gridColumn = '1 / -1';
      empty.innerHTML =
        '<p class="empty-state__icon" aria-hidden="true">✦</p>' +
        '<p class="empty-state__title">Belum ada berita terbaru</p>' +
        '<p class="empty-state__text">Pengumuman terbaru akan muncul di sini.</p>';
      grid.appendChild(empty);
      return;
    }

    items.slice(0, 3).forEach(function (item) {
      grid.appendChild(buildNewsCard(item, base));
    });
  }

  /* ---------------------------------------------------------
     Bootstrap
     --------------------------------------------------------- */

  function init() {
    const base = getBasePath();

    const serversGrid = document.getElementById('home-server-grid');
    const newsGrid = document.getElementById('home-news-grid');
    const statsContainer = document.getElementById('home-stats');

    // Dynasty data (untuk tagline) — opsional, kegagalan tidak memblokir halaman.
    const dynastyPromise = fetch(base + 'data/dynasty.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });

    if (serversGrid || statsContainer) {
      fetch(base + 'data/servers.json', { cache: 'no-store' })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.json();
        })
        .then(function (data) {
          const servers = Array.isArray(data && data.servers) ? data.servers : [];
          renderServers(servers, base);
          return dynastyPromise.then(function (dynasty) {
            renderStats(servers, dynasty);
          });
        })
        .catch(function () {
          if (serversGrid) {
            serversGrid.textContent = '';
            const empty = document.createElement('div');
            empty.className = 'empty-state';
            empty.style.gridColumn = '1 / -1';
            empty.innerHTML =
              '<p class="empty-state__icon" aria-hidden="true">⚠</p>' +
              '<p class="empty-state__title">Data server tidak dapat dimuat</p>' +
              '<p class="empty-state__text">Silakan muat ulang halaman ini.</p>';
            serversGrid.appendChild(empty);
          }

          if (statsContainer) {
            statsContainer.textContent = '';
            statsContainer.appendChild(buildStat('—', 'Data belum tersedia'));
          }
        });
    }

    if (newsGrid) {
      fetch(base + 'data/news.json', { cache: 'no-store' })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          return response.json();
        })
        .then(function (data) {
          const items = Array.isArray(data && data.items) ? data.items : [];
          renderNews(items, base);
        })
        .catch(function () {
          renderNews([], base);
        });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();