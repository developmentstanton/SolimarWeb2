// Hero Carousel
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  let current  = 0;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  // Auto-advance every 5 s
  setInterval(function () {
    goTo((current + 1) % slides.length);
  }, 5000);

  // Dot click
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); });
  });

  // Touch swipe support
  var gallery = document.querySelector('.hero-gallery');
  if (gallery) {
    var startX = 0;
    gallery.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
    }, { passive: true });
    gallery.addEventListener('touchend', function (e) {
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) goTo((current + 1) % slides.length);
        else goTo((current - 1 + slides.length) % slides.length);
      }
    });
  }
})();

// Product card color swatch switcher
(function () {
  document.querySelectorAll('.product-card-switch .color-thumb-sm').forEach(function (swatch) {
    swatch.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var card = this.closest('.product-card-switch');
      var color = this.getAttribute('data-color');
      var main = card.getAttribute('data-' + color + '-main');
      var life = card.getAttribute('data-' + color + '-life');
      var href = card.getAttribute('data-' + color + '-href');
      if (main) card.querySelector('.img-base').src = main;
      if (life) card.querySelector('.img-hover').src = life;
      if (href) card.setAttribute('href', href);
      var lifePos = card.getAttribute('data-' + color + '-life-pos');
      card.querySelector('.img-hover').style.objectPosition = lifePos || '';
      card.querySelectorAll('.color-thumb-sm').forEach(function (s) { s.classList.remove('active'); });
      this.classList.add('active');
    });
  });
})();
