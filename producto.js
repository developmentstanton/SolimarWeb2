/**
 * producto.js — Reads ?id= from URL, renders full product page.
 * Depends on productos-data.js (PRODUCTOS_DB, STORES).
 */
(function () {
  // Support both ?id=X and #X (hash fallback for static servers)
  var params = new URLSearchParams(window.location.search);
  var id = params.get('id') || window.location.hash.replace('#', '');
  var p = PRODUCTOS_DB[id];

  if (!p || p.oculto) {
    document.getElementById('info-panel').innerHTML = '<h2>Producto no encontrado</h2><p><a href="index.html">Volver al inicio</a></p>';
    return;
  }

  // State
  var colorIdx = 0;
  var tallaSel = null;

  function fmt(n) { return '$' + n.toLocaleString('es-CO'); }

  // Page title
  document.title = p.nombre + ' — Solimar';

  // Highlight active nav
  var navLinks = document.querySelectorAll('.header-nav a');
  navLinks.forEach(function (a) {
    if (p.genero === 'mujer' && a.href.indexOf('mujer') !== -1) a.style.color = '#C8102E';
    if (p.genero === 'hombre' && a.href.indexOf('hombre') !== -1) a.style.color = '#C8102E';
  });

  // Breadcrumb
  var generoLabel = p.genero === 'mujer' ? 'Mujer' : 'Hombre';
  var generoHref = p.genero === 'mujer' ? 'mujer.html' : 'hombre.html';
  var catParts = p.categoria.split(' / ');
  document.getElementById('breadcrumb').innerHTML =
    '<a href="index.html">Inicio</a> / <a href="' + generoHref + '">' + generoLabel + '</a> / <span style="color:var(--dark);">' + p.nombre + '</span>';

  // Gallery — pattern: 1 full + 2 pair + 1 full + 2 pair + 2 pair = 8 images
  // "full" positions: index 0 and 3.
  var galeriaHtml = '';
  p.galeria.forEach(function (item, i) {
    var cls = (i === 0 || i === 3) ? 'galeria-img full' : 'galeria-img';
    var src = typeof item === 'string' ? item : item.src;
    var pos = (typeof item === 'object' && item.position) ? item.position : '';
    var zoom = (typeof item === 'object' && item.zoom) ? item.zoom : null;
    if (zoom) {
      var imgStyle = 'transform:scale(' + zoom + ');transform-origin:center bottom;';
      if (pos) imgStyle += 'object-position:' + pos + ';';
      galeriaHtml += '<div class="' + cls + ' galeria-zoom"><img src="' + src + '" alt="' + p.nombre + '" style="' + imgStyle + '" /></div>';
    } else {
      var style = pos ? ' style="object-position:' + pos + ';"' : '';
      galeriaHtml += '<img src="' + src + '" alt="' + p.nombre + '" class="' + cls + '"' + style + ' />';
    }
  });
  document.getElementById('galeria').innerHTML = galeriaHtml;

  // Mobile carousel nav (swipe-hint arrows)
  var galEl = document.getElementById('galeria');
  var prevBtn = document.getElementById('gal-prev');
  var nextBtn = document.getElementById('gal-next');
  function updateNavState() {
    var max = galEl.scrollWidth - galEl.clientWidth - 2;
    prevBtn.hidden = galEl.scrollLeft <= 2;
    nextBtn.hidden = galEl.scrollLeft >= max;
  }
  function scrollBySlide(dir) {
    galEl.scrollBy({ left: dir * galEl.clientWidth, behavior: 'smooth' });
  }
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', function () { scrollBySlide(-1); });
    nextBtn.addEventListener('click', function () { scrollBySlide(1); });
    galEl.addEventListener('scroll', updateNavState, { passive: true });
    // Initial state after layout
    setTimeout(updateNavState, 50);
  }

  // Info panel
  function renderInfo() {
    var badgeHtml = p.badge ? '<span class="product-badge' + (p.badge === 'SALE' ? ' sale' : '') + '">' + p.badge + '</span>' : '';

    var colorsHtml = p.colores.map(function (c, i) {
      return '<span class="color-thumb' + (i === colorIdx ? ' active' : '') + '" data-ci="' + i + '" title="' + c.nombre + '"><img src="' + c.thumb + '" alt="' + c.nombre + '" /></span>';
    }).join('');

    var tallasTexto = p.genero === 'hombre'
      ? 'Disponibles desde la talla S a XXL'
      : 'Disponibles desde la talla XS a XL';

    // Use product-specific tiendas if defined, else fall back to global STORES
    // Hide marketplaces marked as agotado entirely instead of showing disabled buttons
    var tiendas = (p.tiendas || STORES).filter(function (s) { return !s.agotado; });
    var storesHtml = tiendas.map(function (s) {
      var descuentoBadge = s.descuento ? '<span class="stock-badge" style="background:#C8102E;color:#fff;">OFERTA</span>' : '';
      return '<a href="' + s.link + '" target="_blank" rel="noopener noreferrer" class="store-btn' + (s.featured ? ' featured' : '') + '">'
        + '<img src="' + s.logo + '" alt="' + s.name + '" onerror="this.style.display=\'none\'" />'
        + '<span>' + s.name + '</span>'
        + descuentoBadge
        + '<span class="arrow">&rarr;</span>'
        + '</a>';
    }).join('');

    document.getElementById('info-panel').innerHTML =
      '<div class="info-block info-block--head">'
      +   badgeHtml
      +   '<div class="product-cat">' + p.categoria + '</div>'
      +   '<h1 class="product-title">' + p.nombre + '</h1>'
      +   '<div class="product-price">' + (p.precioOriginal ? '<span style="text-decoration:line-through;color:var(--text-muted);font-size:0.7em;margin-right:8px;font-weight:400;">' + fmt(p.precioOriginal) + '</span>' : '') + fmt(p.precio) + (p.precioOriginal ? ' <span style="background:#C8102E;color:#fff;padding:2px 8px;border-radius:4px;font-size:0.6em;margin-left:8px;vertical-align:middle;">-' + Math.round(100 - (p.precio / p.precioOriginal) * 100) + '%</span>' : '') + '</div>'
      + '</div>'
      + '<div class="info-block info-block--desc"><p class="product-desc">' + p.descripcion + '</p></div>'
      + '<div class="info-block info-block--color" style="margin-bottom:24px;">'
      +   '<div class="section-label">Color: <span>' + p.colores[colorIdx].nombre + '</span></div>'
      +   '<div>' + colorsHtml + '</div>'
      + '</div>'
      + '<div class="info-block info-block--talla producto-tallas" style="margin-bottom:32px;">'
      +   '<div class="section-label">Tallas</div>'
      +   '<div class="tallas-disponibles">' + tallasTexto + '</div>'
      +   '<a href="#" class="size-guide-link" id="size-guide-link">Guía de tallas</a>'
      + '</div>'
      + '<div class="info-block info-block--stores stores-section">'
      +   '<div class="section-label" style="margin-bottom:14px;">Comprar en</div>'
      +   storesHtml
      +   '<div class="stores-note">Solimar está disponible en estos retailers autorizados. Selecciona tu canal favorito para completar tu compra.</div>'
      + '</div>';

    // Bind events
    document.querySelectorAll('.color-thumb').forEach(function (el) {
      el.addEventListener('click', function () {
        var ci = parseInt(this.getAttribute('data-ci'));
        var color = p.colores[ci];
        // Derive the sister-product id from the color's thumb filename
        // e.g. "957P-NAV-swatch.jpg" → "957pnav"; honor explicit productoId if set.
        var targetId = color.productoId;
        if (!targetId && color.thumb) {
          targetId = color.thumb.replace(/[_-]?swatch\.(jpe?g|png)$/i, '').toLowerCase().replace(/[-_]/g, '');
        }
        if (targetId && targetId !== id && PRODUCTOS_DB[targetId]) {
          // Navigate to the sister product's page
          window.location.hash = targetId;
          return;
        }
        // Fallback: just update the visible selection on the current page
        colorIdx = ci;
        renderInfo();
      });
    });
    document.querySelectorAll('.talla-pill').forEach(function (el) {
      el.addEventListener('click', function () {
        tallaSel = this.getAttribute('data-t');
        renderInfo();
      });
    });
    var guideLink = document.getElementById('size-guide-link');
    if (guideLink) {
      guideLink.addEventListener('click', function (e) {
        e.preventDefault();
        var modal = document.getElementById('size-modal');
        if (modal) { modal.hidden = false; document.body.style.overflow = 'hidden'; }
      });
    }
  }

  // Close size-modal handlers (attached once)
  var sizeModal = document.getElementById('size-modal');
  if (sizeModal) {
    sizeModal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', function () {
        sizeModal.hidden = true;
        document.body.style.overflow = '';
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !sizeModal.hidden) {
        sizeModal.hidden = true;
        document.body.style.overflow = '';
      }
    });
  }

  renderInfo();

  // Detalles
  var detallesHtml = p.detalles.map(function (d) {
    return '<div class="detalle-row">' + d + '</div>';
  }).join('');
  document.getElementById('detalles-list').innerHTML = detallesHtml;

  // Relacionados
  var relHtml = p.relacionados.map(function (rid) {
    var r = PRODUCTOS_DB[rid];
    if (!r) return '';
    return '<a href="producto.html#' + rid + '" class="rel-card">'
      + '<img src="' + r.galeria[0] + '" alt="' + r.nombre + '" class="rel-img" />'
      + '<h3 class="rel-name">' + r.nombre + '</h3>'
      + '<div class="rel-price">' + fmt(r.precio) + '</div>'
      + '</a>';
  }).join('');
  document.getElementById('relacionados-grid').innerHTML = relHtml;

  // Reload on hash change (navigating between products)
  window.addEventListener('hashchange', function () { location.reload(); });
})();
