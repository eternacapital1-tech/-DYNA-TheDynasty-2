/* The Dynasty — Servers Page */

(function () {
  'use strict';

  const RANK_KEYS = ['P5', 'P4', 'P3', 'P2', 'P1'];

  function getBasePath() {
    return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : './';
  }

  function formatNumber(value) {
    if (typeof value !== 'number' || !isFinite(value)) return '—';
    return new Intl.NumberFormat('id-ID').format(value);
  }

  function hasValue(value) {
    return value !== null && value !== undefined && value !== '';
  }

  function statusModifier(status) {
    if (!status) return '';
    const normalized = String(status).toLowerCase();
    if (normalized.indexOf('maintenance') !== -1) return ' status-pill--maintenance';
    if (normalized.indexOf('active') !== -1 || normalized.indexOf('online') !== -1) {
      return ' status-pill--online';
    }
    return '';
  }

  /* ---------------------------------------------------------
     Fact Tile
     --------------------------------------------------------- */

  function buildFact(label, value) {
    const fact = document.createElement('div');
    fact.className = 'server-fact';

    const labelEl = document.createElement('span');
    labelEl.className = 'server-fact__label';
    labelEl.textContent = label;

    const valueEl = document.createElement('span');
    valueEl.className = 'server-fact__value';
    if (hasValue(value)) {
      valueEl.textContent = value;
    } else {
      valueEl.textContent = '—';
      valueEl.classList.add('server-fact__value--empty');
    }

    fact.appendChild(labelEl);
    fact.appendChild(valueEl);

    return fact;
  }

  /* ---------------------------------------------------------
     Rank Progress
     --------------------------------------------------------- */

  function parseRankValue(raw) {
    if (raw === null || raw === undefined || raw === '') return null;
    const str = String(raw);

    // Format "a/b" -> { current: a, max: b }
    if (str.indexOf('/') !== -1) {
      const parts = str.split('/');
      const current = parseFloat(parts[0]);
      const max = parseFloat(parts[1]);
      if (!isFinite(current) || !isFinite(max) || max <= 0) return null;
      return { current: current, max: max, label: str };
    }

    const num = parseFloat(str);
    if (!isFinite(num)) return null;
    return { current: num, max: num, label: str, isTotal: true };
  }

  function buildRankRow(key, raw) {
    const wrapper = document.createElement('div');

    const head = document.createElement('div');
    head.className = 'rank-progress__head';

    const label = document.createElement('span');
    label.textContent = key;

    const value = document.createElement('strong');
    value.textContent = hasValue(raw) ? String(raw) : '—';
    if (!hasValue(raw)) {
      value.style.color = 'var(--color-muted)';
    }

    head.appendChild(label);
    head.appendChild(value);
    wrapper.appendChild(head);

    const parsed = parseRankValue(raw);
    const bar = document.createElement('div');
    bar.className = 'progress-bar';

    const fill = document.createElement('div');
    fill.className = 'progress-bar__fill';

    if (parsed && !parsed.isTotal) {
      const percent = Math.max(0, Math.min(100, (parsed.current / parsed.max) * 100));
      fill.setAttribute('data-progress', percent.toFixed(1));
    } else {
      fill.setAttribute('data-progress', '0');
      fill.style.opacity = '0.25';
    }

    bar.appendChild(fill);
    wrapper.appendChild(bar);

    return wrapper;
  }

  /* ---------------------------------------------------------
     Server Card
     --------------------------------------------------------- */

  function buildServerCard(server, base) {
    const card = document.createElement('article');
    card.className = 'server-card';

    /* --- Media --- */
    const media = document.createElement('div');
    media.className = 'server-card__media';

    if (server.image) {
      const img = document.createElement('img');
      img.src = base + server.image;
      img.alt = 'Server ' + server.server + ' — ' + (server.alliance || '');
      img.loading = 'lazy';

      img.addEventListener('error', function () {
        media.textContent = '';
        media.classList.add('server-card__media--empty');
        const span = document.createElement('span');
        span.textContent = 'Gambar belum tersedia';
        media.appendChild(span);
      });

      media.appendChild(img);
    } else {
      media.classList.add('server-card__media--empty');
      const span = document.createElement('span');
      span.textContent = 'Gambar belum tersedia';
      media.appendChild(span);
    }

    /* --- Body --- */
    const body = document.createElement('div');
    body.className = 'server-card__body';

    const top = document.createElement('div');
    top.className = 'server-card__top';

    const serverLabel = document.createElement('span');
    serverLabel.className = 'server-card__server';
    serverLabel.textContent = 'SERVER ' + server.server;
    top.appendChild(serverLabel);

    const statusPill = document.createElement('span');
    statusPill.className = 'status-pill' + statusModifier(server.status);
    statusPill.textContent = server.status || 'Data belum tersedia';
    top.appendChild(statusPill);

    body.appendChild(top);

    const title = document.createElement('h2');
    title.className = 'server-card__title';
    title.textContent = server.alliance || 'Aliansi belum tersedia';
    body.appendChild(title);

    /* --- Facts --- */
    const facts = document.createElement('div');
    facts.className = 'server-facts';

    facts.appendChild(buildFact('Level', hasValue(server.level) ? String(server.level) : null));
    facts.appendChild(buildFact('Power', hasValue(server.power) ? formatNumber(server.power) : null));
    facts.appendChild(
      buildFact('Total Slot', hasValue(server.totalMembers) ? String(server.totalMembers) : null)
    );

    body.appendChild(facts);

    /* --- Rank Overview --- */
    const rankBlock = document.createElement('div');
    rankBlock.className = 'rank-progress';

    const rankTitle = document.createElement('div');
    rankTitle.className = 'rank-progress__head';
    rankTitle.innerHTML = '<span>Rank Overview</span>';
    rankBlock.appendChild(rankTitle);

    const ranks = server.ranks || {};
    RANK_KEYS.forEach(function (key) {
      rankBlock.appendChild(buildRankRow(key, ranks[key]));
    });

    body.appendChild(rankBlock);

    /* --- Note --- */
    if (server.note) {
      const note = document.createElement('p');
      note.className = 'server-card__note';
      note.textContent = server.note;
      body.appendChild(note);
    }

    /* --- Actions --- */
    const actions = document.createElement('div');
    actions.className = 'server-card__actions';

    const joinBtn = document.createElement('a');
    joinBtn.className = 'btn btn--primary';
    joinBtn.href = 'recruitment.html';
    joinBtn.textContent = 'JOIN SERVER INI';
    actions.appendChild(joinBtn);

    const discordBtn = document.createElement('a');
    discordBtn.className = 'btn btn--ghost';
    discordBtn.href = 'https://discord.gg/narcoempire';
    discordBtn.target = '_blank';
    discordBtn.rel = 'noopener noreferrer';
    discordBtn.textContent = 'TANYA DI DISCORD';
    actions.appendChild(discordBtn);

    body.appendChild(actions);

    card.appendChild(media);
    card.appendChild(body);

    return card;
  }

  /* ---------------------------------------------------------
     Render
     --------------------------------------------------------- */

  function renderServers(servers, base) {
    const list = document.getElementById('server-list');
    if (!list) return;

    list.textContent = '';

    if (!servers.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.innerHTML =
        '<p class="empty-state__icon" aria-hidden="true">◈</p>' +
        '<p class="empty-state__title">Data server belum tersedia</p>' +
        '<p class="empty-state__text">Silakan periksa kembali nanti.</p>';
      list.appendChild(empty);
      return;
    }

    servers.forEach(function (server) {
      list.appendChild(buildServerCard(server, base));
    });
  }

  function renderError() {
    const list = document.getElementById('server-list');
    if (!list) return;

    list.textContent = '';
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML =
      '<p class="empty-state__icon" aria-hidden="true">⚠</p>' +
      '<p class="empty-state__title">Data server tidak dapat dimuat</p>' +
      '<p class="empty-state__text">Periksa koneksi Anda lalu muat ulang halaman.</p>';
    list.appendChild(empty);
  }

  function init() {
    const list = document.getElementById('server-list');
    if (!list) return;

    const base = getBasePath();

    fetch(base + 'data/servers.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        const servers = Array.isArray(data && data.servers) ? data.servers : [];
        renderServers(servers, base);
        // Progress bar akan dianimasikan oleh js/animation.js
        document.dispatchEvent(new CustomEvent('dynasty:content-updated'));
      })
      .catch(renderError);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();