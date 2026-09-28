/* The Dynasty — Navbar Component */

(function () {
  'use strict';

  const NAV_ITEMS = [
    { label: 'HOME', file: 'index.html', inPages: false },
    { label: 'ABOUT', file: 'about.html', inPages: true },
    { label: 'SERVERS', file: 'servers.html', inPages: true },
    { label: 'REQUIREMENTS', file: 'requirements.html', inPages: true },
    { label: 'RANKS', file: 'ranks.html', inPages: true },
    { label: 'GUIDE', file: 'guide.html', inPages: true },
    { label: 'GALLERY', file: 'gallery.html', inPages: true },
    { label: 'NEWS', file: 'news.html', inPages: true },
    { label: 'RECRUITMENT', file: 'recruitment.html', inPages: true },
    { label: 'CONTACT', file: 'contact.html', inPages: true }
  ];

  function getBasePath() {
    return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : './';
  }

  function getCurrentFile() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    const last = segments.length ? segments[segments.length - 1] : '';

    if (!last || last === 'the-dynasty') {
      return 'index.html';
    }
    if (last.indexOf('.') === -1) {
      return 'index.html';
    }
    return last;
  }

  function buildBrand(base) {
    const brand = document.createElement('a');
    brand.className = 'dynasty-brand';
    brand.href = base + 'index.html';
    brand.setAttribute('aria-label', 'The Dynasty — Beranda');

    const img = document.createElement('img');
    img.className = 'dynasty-brand__logo';
    img.src = base + 'assets/images/logo/the-dynasty.png';
    img.alt = 'Logo The Dynasty';
    img.width = 38;
    img.height = 38;

    img.addEventListener('error', function () {
      const mark = document.createElement('span');
      mark.className = 'dynasty-brand__mark';
      mark.textContent = 'TD';
      mark.setAttribute('aria-hidden', 'true');
      if (img.parentNode) {
        img.parentNode.replaceChild(mark, img);
      }
    });

    const text = document.createElement('span');
    text.className = 'dynasty-brand__text';

    const strong = document.createElement('strong');
    strong.textContent = 'THE DYNASTY';

    const small = document.createElement('small');
    small.textContent = 'Narco Empire';

    text.appendChild(strong);
    text.appendChild(small);

    brand.appendChild(img);
    brand.appendChild(text);

    return brand;
  }

  function buildNavList(base, currentFile) {
    const list = document.createElement('ul');
    list.className = 'dynasty-nav__list';

    NAV_ITEMS.forEach(function (item) {
      const li = document.createElement('li');
      const link = document.createElement('a');

      link.className = 'dynasty-nav__link';
      link.href = item.inPages ? base + 'pages/' + item.file : base + item.file;
      link.textContent = item.label;

      if (item.file === currentFile) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }

      li.appendChild(link);
      list.appendChild(li);
    });

    return list;
  }

  function buildToggle() {
    const button = document.createElement('button');
    button.className = 'dynasty-nav-toggle';
    button.id = 'dynasty-nav-toggle';
    button.type = 'button';
    button.setAttribute('aria-label', 'Buka menu');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', 'dynasty-nav-menu');

    for (let i = 0; i < 3; i += 1) {
      button.appendChild(document.createElement('span'));
    }

    return button;
  }

  function buildBackdrop() {
    const backdrop = document.createElement('div');
    backdrop.className = 'dynasty-menu-backdrop';
    backdrop.id = 'dynasty-menu-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    return backdrop;
  }

  function render() {
    const root = document.getElementById('dynasty-navbar-root');
    if (!root) return;

    const base = getBasePath();
    const currentFile = getCurrentFile();

    const header = document.createElement('header');
    header.className = 'dynasty-header';
    header.id = 'dynasty-header';

    const navbar = document.createElement('div');
    navbar.className = 'dynasty-navbar';

    const nav = document.createElement('nav');
    nav.className = 'dynasty-nav';
    nav.id = 'dynasty-nav-menu';
    nav.setAttribute('aria-label', 'Navigasi utama');

    nav.appendChild(buildNavList(base, currentFile));

    navbar.appendChild(buildBrand(base));
    navbar.appendChild(buildToggle());
    navbar.appendChild(nav);

    header.appendChild(navbar);

    root.appendChild(header);
    root.appendChild(buildBackdrop());
  }

  window.DynastyNavbar = { render: render };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();