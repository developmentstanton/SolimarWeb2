/**
 * responsive.js — Hamburger menu + filter sidebar toggle for mobile.
 * Loaded on ALL pages. Only affects mobile via CSS media queries.
 */
(function () {
  // === HAMBURGER MENU ===
  var header = document.querySelector('.site-header');
  if (header) {
    var btn = document.createElement('button');
    btn.className = 'hamburger-btn';
    btn.setAttribute('aria-label', 'Menú');
    btn.innerHTML = '<span></span><span></span><span></span>';

    var nav = header.querySelector('.header-nav');
    if (nav) header.insertBefore(btn, nav);

    btn.addEventListener('click', function () {
      header.classList.toggle('nav-open');
    });

    // Close menu on link click
    header.querySelectorAll('.header-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('nav-open');
      });
    });
  }

  // === FILTER SIDEBAR TOGGLE (collection pages only) ===
  var layout = document.querySelector('.cat-layout');
  if (layout) {
    var aside = layout.querySelector('aside');
    if (aside) {
      var filterBtn = document.createElement('button');
      filterBtn.className = 'filter-toggle-btn';
      filterBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/></svg> Filtros';

      layout.insertBefore(filterBtn, layout.firstChild);

      filterBtn.addEventListener('click', function () {
        var open = aside.classList.toggle('filters-open');
        filterBtn.innerHTML = open
          ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg> Ocultar Filtros'
          : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/></svg> Filtros';
      });
    }
  }
})();
