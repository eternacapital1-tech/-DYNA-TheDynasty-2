/* The Dynasty — Footer Component */

(function () {
  'use strict';

  const DISCORD_URL = 'https://discord.gg/narcoempire';
  const GAME_URL = 'https://play.google.com/store/apps/details?id=com.spark.sp.gp';
  const EMAIL = 'apphubid@gmail.com';

  const NAV_LINKS = [
    { label: 'Home', href: 'index.html', inPages: false },
    { label: 'About', href: 'about.html', inPages: true },
    { label: 'Servers', href: 'servers.html', inPages: true },
    { label: 'Requirements', href: 'requirements.html', inPages: true },
    { label: 'Ranks', href: 'ranks.html', inPages: true }
  ];

  const RESOURCE_LINKS = [
    { label: 'Guide', href: 'guide.html', inPages: true },
    { label: 'Gallery', href: 'gallery.html', inPages: true },
    { label: 'News', href: 'news.html', inPages: true },
    { label: 'Recruitment', href: 'recruitment.html', inPages: true },
    { label: 'Contact & Feedback', href: 'contact.html', inPages: true }
  ];

  function getBasePath() {
    return window.location.pathname.indexOf('/pages/') !== -1 ? '../' : './';
  }

  function buildLinkList(title, links, base) {
    const wrapper = document.createElement('div');

    const heading = document.createElement('h3');
    heading.className = 'dynasty-footer__title';
    heading.textContent = title;
    wrapper.appendChild(heading);

    const list = document.createElement('ul');
    list.className = 'dynasty-footer__links';

    links.forEach(function (item) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.className = 'dynasty-footer__link';
      a.href = item.inPages ? base + 'pages/' + item.href : base + item.href;
      a.textContent = item.label;
      li.appendChild(a);
      list.appendChild(li);
    });

    wrapper.appendChild(list);
    return wrapper;
  }

  function buildSocialLink(href, iconSrc, alt, label, external) {
    const a = document.createElement('a');
    a.className = 'dynasty-footer__social-link';
    a.href = href;

    if (external) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }

    const img = document.createElement('img');
    img.src = iconSrc;
    img.alt = alt;
    img.loading = 'lazy';
    img.width = 20;
    img.height = 20;

    img.addEventListener('error', function () {
      if (img.parentNode) img.parentNode.removeChild(img);
    });

    const span = document.createElement('span');
    span.textContent = label;

    a.appendChild(img);
    a.appendChild(span);

    return a;
  }

  function render() {
    const root = document.getElementById('dynasty-footer-root');
    if (!root) return;

    const base = getBasePath();

    const footer = document.createElement('footer');
    footer.className = 'dynasty-footer';

    const inner = document.createElement('div');
    inner.className = 'dynasty-footer__inner container';

    /* --- Brand Column --- */
    const brandCol = document.createElement('div');
    brandCol.className = 'dynasty-footer__brand';

    const logoRow = document.createElement('div');
    logoRow.className = 'dynasty-footer__logo';

    const logoImg = document.createElement('img');
    logoImg.src = base + 'assets/images/logo/the-dynasty.png';
    logoImg.alt = 'Logo The Dynasty';
    logoImg.loading = 'lazy';
    logoImg.width = 42;
    logoImg.height = 42;

    logoImg.addEventListener('error', function () {
      if (logoImg.parentNode) logoImg.parentNode.removeChild(logoImg);
    });

    const logoText = document.createElement('strong');
    logoText.textContent = 'THE DYNASTY';

    logoRow.appendChild(logoImg);
    logoRow.appendChild(logoText);

    const tagline = document.createElement('p');
    tagline.className = 'dynasty-footer__tagline';
    tagline.textContent = 'Built From Zero. Built Together.';

    const desc = document.createElement('p');
    desc.className = 'dynasty-footer__desc';
    desc.textContent =
      'Aliansi Narco Empire di Server 32 dan Server 53. Tumbuh, berkembang, dan menjadi kuat bersama.';

    brandCol.appendChild(logoRow);
    brandCol.appendChild(tagline);
    brandCol.appendChild(desc);

    /* --- Navigation Columns --- */
    const navCol = buildLinkList('Navigasi', NAV_LINKS, base);
    const resCol = buildLinkList('Sumber Daya', RESOURCE_LINKS, base);

    /* --- Community Column --- */
    const communityCol = document.createElement('div');

    const communityTitle = document.createElement('h3');
    communityTitle.className = 'dynasty-footer__title';
    communityTitle.textContent = 'Komunitas';
    communityCol.appendChild(communityTitle);

    const socialWrap = document.createElement('div');
    socialWrap.className = 'dynasty-footer__social';

    socialWrap.appendChild(
      buildSocialLink(
        DISCORD_URL,
        base + 'assets/icons/discord.png',
        'Discord',
        'Discord The Dynasty',
        true
      )
    );

    socialWrap.appendChild(
      buildSocialLink(
        GAME_URL,
        base + 'assets/icons/narco-empire.png',
        'Narco Empire',
        'Narco Empire di Play Store',
        true
      )
    );

    const emailLink = document.createElement('a');
    emailLink.className = 'dynasty-footer__social-link';
    emailLink.href = 'mailto:' + EMAIL;
    const emailSpan = document.createElement('span');
    emailSpan.textContent = EMAIL;
    emailLink.appendChild(emailSpan);
    socialWrap.appendChild(emailLink);

    communityCol.appendChild(socialWrap);

    inner.appendChild(brandCol);
    inner.appendChild(navCol);
    inner.appendChild(resCol);
    inner.appendChild(communityCol);

    /* --- Bottom Bar --- */
    const bottom = document.createElement('div');
    bottom.className = 'dynasty-footer__bottom container';

    const copyright = document.createElement('span');
    copyright.textContent = '© ' + new Date().getFullYear() + ' The Dynasty. All rights reserved.';

    const feedback = document.createElement('a');
    feedback.href = base + 'pages/contact.html';
    feedback.textContent = 'Kirim Feedback';

    bottom.appendChild(copyright);
    bottom.appendChild(feedback);

    footer.appendChild(inner);
    footer.appendChild(bottom);

    root.appendChild(footer);
  }

  window.DynastyFooter = { render: render };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();