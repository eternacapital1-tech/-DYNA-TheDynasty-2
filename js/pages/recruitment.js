/* The Dynasty — Recruitment Page */

(function () {
  'use strict';

  function getBasePath() {
    return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : './';
  }

  function hasValue(value) {
    return value !== null && value !== undefined && value !== '';
  }

  function formatNumber(value) {
    if (typeof value !== 'number' || !isFinite(value)) return String(value);
    return new Intl.NumberFormat('id-ID').format(value);
  }

  /* ---------------------------------------------------------
     Requirements
     --------------------------------------------------------- */

  function buildReqTile(label, value, hint) {
    const tile = document.createElement('article');
    tile.className = 'req-tile';

    const labelEl = document.createElement('p');
    labelEl.className = 'req-tile__label';
    labelEl.textContent = label;

    const valueEl = document.createElement('p');
    valueEl.className = 'req-tile__value';
    valueEl.textContent = hasValue(value) ? String(value) : '—';

    tile.appendChild(labelEl);
    tile.appendChild(valueEl);

    if (hint) {
      const hintEl = document.createElement('p');
      hintEl.className = 'req-tile__hint';
      hintEl.textContent = hint;
      tile.appendChild(hintEl);
    }

    return tile;
  }

  function renderRequirements(data) {
    const grid = document.getElementById('recruit-req-grid');
    if (!grid) return;

    grid.textContent = '';

    const req = (data && data.requirements) || {};

    grid.appendChild(
      buildReqTile(
        'POWER MINIMUM',
        hasValue(req.power) ? formatNumber(req.power) : null,
        'Power minimal saat mendaftar.'
      )
    );

    grid.appendChild(
      buildReqTile(
        'LEVEL BANGUNAN',
        hasValue(req.buildingLevel) ? req.buildingLevel : null,
        'Level bangunan utama yang disyaratkan.'
      )
    );

    if (hasValue(req.approval)) {
      grid.appendChild(
        buildReqTile('PERSETUJUAN', req.approval, 'Disetujui oleh rank yang berwenang.')
      );
    }
  }

  /* ---------------------------------------------------------
     Expectation Lists
     --------------------------------------------------------- */

  function renderList(containerId, items) {
    const list = document.getElementById(containerId);
    if (!list) return;

    list.textContent = '';

    if (!Array.isArray(items) || !items.length) {
      const li = document.createElement('li');
      li.className = 'check-list__item';
      li.textContent = 'Belum ada informasi yang tersedia.';
      list.appendChild(li);
      return;
    }

    items.forEach(function (text) {
      const li = document.createElement('li');
      li.className = 'check-list__item';
      li.textContent = text;
      list.appendChild(li);
    });
  }

  /* ---------------------------------------------------------
     Approval & Rules
     --------------------------------------------------------- */

  function renderApproval(data) {
    const box = document.getElementById('recruit-approval');
    if (!box) return;

    box.textContent = '';

    const label = document.createElement('p');
    label.className = 'approval-box__label';
    label.textContent = 'PERSETUJUAN DIPERLUKAN';

    const text = document.createElement('p');
    text.className = 'approval-box__text';

    const approval =
      (data && data.requirements && data.requirements.approval) || null;

    text.textContent = approval
      ? approval
      : 'Data persetujuan belum tersedia.';

    box.appendChild(label);
    box.appendChild(text);
  }

  function renderRule(data) {
    const el = document.getElementById('recruit-rule');
    if (!el) return;

    const rule = data && data.rules ? data.rules : null;
    el.textContent = rule || 'Belum ada aturan tambahan yang tercatat.';
  }

  /* ---------------------------------------------------------
     Server Selection
     --------------------------------------------------------- */

  function buildServerCard(server) {
    const card = document.createElement('article');
    card.className = 'recruit-server-card';

    const serverLabel = document.createElement('span');
    serverLabel.className = 'recruit-server-card__server';
    serverLabel.textContent = 'SERVER ' + server.server;
    card.appendChild(serverLabel);

    const name = document.createElement('h3');
    name.className = 'recruit-server-card__name';
    name.textContent = server.alliance || 'Aliansi belum tersedia';
    card.appendChild(name);

    const note = document.createElement('p');
    note.className = 'recruit-server-card__note';
    note.textContent = server.status
      ? 'Status saat ini: ' + server.status + '.'
      : 'Status server belum tersedia.';
    card.appendChild(note);

    const actions = document.createElement('a');
    actions.className = 'btn btn--outline btn--sm';
    actions.href = 'https://discord.gg/narcoempire';
    actions.target = '_blank';
    actions.rel = 'noopener noreferrer';
    actions.textContent = 'AJUKAN DI DISCORD';
    card.appendChild(actions);

    return card;
  }

  function renderServers(servers) {
    const grid = document.getElementById('recruit-server-grid');
    if (!grid) return;

    grid.textContent = '';

    if (!servers.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.style.gridColumn = '1 / -1';
      empty.innerHTML =
        '<p class="empty-state__icon" aria-hidden="true">◈</p>' +
        '<p class="empty-state__title">Data server belum tersedia</p>' +
        '<p class="empty-state__text">Hubungi kami di Discord untuk informasi server terbaru.</p>';
      grid.appendChild(empty);
      return;
    }

    servers.forEach(function (server) {
      grid.appendChild(buildServerCard(server));
    });
  }

  /* ---------------------------------------------------------
     Bootstrap
     --------------------------------------------------------- */

  function init() {
    const base = getBasePath();

    fetch(base + 'data/recruitment.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        renderRequirements(data);
        renderList('recruit-behavior-list', data && data.behavior);
        renderList('recruit-activity-list', data && data.activity);
        renderApproval(data);
        renderRule(data);
      })
      .catch(function () {
        renderRequirements(null);
        renderList('recruit-behavior-list', []);
        renderList('recruit-activity-list', []);
        renderApproval(null);
        renderRule(null);
      });

    fetch(base + 'data/servers.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        renderServers(Array.isArray(data && data.servers) ? data.servers : []);
      })
      .catch(function () {
        renderServers([]);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();