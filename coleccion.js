/**
 * Coleccion.js — Filtering, sorting & rendering for collection pages.
 * Expects a global `PAGE_DATA` object set before this script loads:
 *   PAGE_DATA = { productos: [...], totalCount: N }
 */
(function () {
  var productos = PAGE_DATA.productos;
  var totalCount = productos.length;

  // State
  var categoriaFiltro = [];
  var colorFiltro = [];
  var tallaFiltro = [];
  var precioMax = 150000;
  var orden = 'destacados';

  // DOM refs
  var grid = document.getElementById('products-grid');
  var countEl = document.getElementById('product-count');
  var totalEl = document.getElementById('product-total');
  var sortEl = document.getElementById('sort-select');
  var priceEl = document.getElementById('price-range');
  var priceLabelEl = document.getElementById('price-label');
  var clearBtn = document.getElementById('clear-filters');
  var activeCountEl = document.getElementById('active-count');
  var catContainer = document.getElementById('filter-categoria');
  var colorContainer = document.getElementById('filter-color');
  var tallaContainer = document.getElementById('filter-talla');

  // Helpers
  function fmt(n) { return '$' + n.toLocaleString('es-CO'); }
  function unique(arr) {
    var seen = {};
    return arr.filter(function (v) { return seen[v] ? false : (seen[v] = true); });
  }

  // Build filter options from data
  var categorias = unique(productos.map(function (p) { return p.categoria; }));
  var colores = unique(productos.map(function (p) { return p.color; }));
  var TALLA_ORDER = ["XS","S","M","L","XL","XXL"];
  var tallas = unique(productos.reduce(function (acc, p) { return acc.concat(p.talla); }, [])).sort(function (a, b) {
    var ai = TALLA_ORDER.indexOf(a), bi = TALLA_ORDER.indexOf(b);
    if (ai !== -1 && bi !== -1) return ai - bi;
    return Number(a) - Number(b);
  });

  function buildCheckboxes(container, items, filtro, setFiltro) {
    container.innerHTML = '';
    items.forEach(function (item) {
      var label = document.createElement('label');
      label.className = 'filter-checkbox';
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = filtro.indexOf(item) !== -1;
      cb.addEventListener('change', function () { setFiltro(item); render(); });
      label.appendChild(cb);
      label.appendChild(document.createTextNode(item));
      container.appendChild(label);
    });
  }

  function buildTallas() {
    tallaContainer.innerHTML = '';
    tallas.forEach(function (t) {
      var span = document.createElement('span');
      span.className = 'talla-pill' + (tallaFiltro.indexOf(t) !== -1 ? ' active' : '');
      span.textContent = t;
      span.addEventListener('click', function () { toggleArr(tallaFiltro, t); render(); });
      tallaContainer.appendChild(span);
    });
  }

  function toggleArr(arr, val) {
    var idx = arr.indexOf(val);
    if (idx === -1) arr.push(val); else arr.splice(idx, 1);
  }

  function toggleCat(val) { toggleArr(categoriaFiltro, val); }
  function toggleColor(val) { toggleArr(colorFiltro, val); }

  // Filter + sort
  function getFiltered() {
    var result = productos.filter(function (p) {
      if (categoriaFiltro.length && categoriaFiltro.indexOf(p.categoria) === -1) return false;
      if (colorFiltro.length && colorFiltro.indexOf(p.color) === -1) return false;
      if (tallaFiltro.length && !p.talla.some(function (t) { return tallaFiltro.indexOf(t) !== -1; })) return false;
      if (p.price > precioMax) return false;
      return true;
    });
    if (orden === 'menor-precio') result.sort(function (a, b) { return a.price - b.price; });
    if (orden === 'mayor-precio') result.sort(function (a, b) { return b.price - a.price; });
    if (orden === 'nuevos') result.sort(function (a, b) { return (b.badge === 'NUEVO' ? 1 : 0) - (a.badge === 'NUEVO' ? 1 : 0); });
    return result;
  }

  function renderProducts(items) {
    if (items.length === 0) {
      grid.innerHTML = '<div class="empty-state"><p>No encontramos productos con esos filtros.</p><button class="btn-primary" id="empty-clear">Limpiar filtros</button></div>';
      document.getElementById('empty-clear').addEventListener('click', function () { clearAll(); });
      return;
    }
    var html = '';
    items.forEach(function (p) {
      var badgeHtml = p.badge ? '<span class="badge' + (p.badge === 'SALE' ? ' sale' : '') + '">' + p.badge + '</span>' : '';
      var swatches = p.colores.map(function (c) {
        return '<span class="color-thumb-sm"><img src="' + c.thumb + '" alt="' + c.nombre + '" /></span>';
      }).join('');
      html += '<a href="producto.html#' + p.id + '" class="product-card-col" style="text-decoration:none;color:inherit;">'
        + '<div class="product-img-wrap">' + badgeHtml
        + '<img src="' + p.img + '" alt="' + p.name + '" class="img-product" />'
        + '</div>'
        + '<h3 class="product-name-col">' + p.name + '</h3>'
        + '<div class="product-price-col">' + fmt(p.price) + '</div>'
        + '<div>' + swatches + '</div>'
        + '</a>';
    });
    grid.innerHTML = html;
  }

  function updateActiveCount() {
    var count = categoriaFiltro.length + colorFiltro.length + tallaFiltro.length + (precioMax < 150000 ? 1 : 0);
    activeCountEl.textContent = count > 0 ? '(' + count + ')' : '';
    clearBtn.style.display = count > 0 ? 'inline' : 'none';
  }

  function render() {
    buildCheckboxes(catContainer, categorias, categoriaFiltro, toggleCat);
    buildCheckboxes(colorContainer, colores, colorFiltro, toggleColor);
    buildTallas();
    var filtered = getFiltered();
    countEl.textContent = filtered.length;
    totalEl.textContent = totalCount;
    priceLabelEl.textContent = 'Hasta ' + fmt(precioMax);
    updateActiveCount();
    renderProducts(filtered);
  }

  function clearAll() {
    categoriaFiltro.length = 0;
    colorFiltro.length = 0;
    tallaFiltro.length = 0;
    precioMax = 150000;
    priceEl.value = 150000;
    sortEl.value = 'destacados';
    orden = 'destacados';
    render();
  }

  // Events
  sortEl.addEventListener('change', function () { orden = this.value; render(); });
  priceEl.addEventListener('input', function () { precioMax = Number(this.value); render(); });
  clearBtn.addEventListener('click', clearAll);

  // Initial render
  render();
})();
