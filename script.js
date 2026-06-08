// ===== THÈME LIGHT / DARK =====
const html        = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);

themeToggle?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ===== LANGUE FR / EN =====
const langToggle = document.getElementById('langToggle');

const savedLang = localStorage.getItem('lang') || 'fr';
html.setAttribute('data-lang', savedLang);
if (langToggle) langToggle.textContent = savedLang === 'fr' ? 'EN' : 'FR';

langToggle?.addEventListener('click', () => {
  const next = html.getAttribute('data-lang') === 'fr' ? 'en' : 'fr';
  html.setAttribute('data-lang', next);
  localStorage.setItem('lang', next);
  langToggle.textContent = next === 'fr' ? 'EN' : 'FR';
});

// ===== CANVAS DE FOND GLOBAL =====
(function () {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  let accentRgb = '124,58,237';

  function updateColor() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    accentRgb = dark ? '167,139,250' : '124,58,237';
  }

  new MutationObserver(updateColor).observe(
    document.documentElement,
    { attributes: true, attributeFilter: ['data-theme'] }
  );
  updateColor();

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x       = Math.random() * W;
      this.y       = init ? Math.random() * H : H + 10;
      this.r       = Math.random() * 1.6 + 0.4;
      this.speed   = Math.random() * 0.28 + 0.06;
      this.opacity = Math.random() * 0.32 + 0.06;
      this.drift   = (Math.random() - 0.5) * 0.18;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentRgb},${this.opacity})`;
      ctx.fill();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  resize();
  particles = Array.from({ length: 100 }, () => new Particle());
  animate();
  window.addEventListener('resize', resize);
})();

// ===== SCROLL HORIZONTAL PILOTÉ PAR LA SOURIS =====
(function () {
  const wrap  = document.getElementById('hscrollWrap');
  const track = document.getElementById('hscrollTrack');
  if (!wrap || !track) return;

  let target = 0;
  let current = 0;
  let raf = null;

  function lerp(a, b, t) { return a + (b - a) * t; }

  wrap.addEventListener('mousemove', (e) => {
    const rect     = wrap.getBoundingClientRect();
    const ratio    = (e.clientX - rect.left) / rect.width;          // 0 → 1
    const maxShift = track.scrollWidth - wrap.clientWidth;
    target = ratio * maxShift;
  });

  wrap.addEventListener('mouseleave', () => {
    // Garder la position actuelle à la sortie
    target = current;
  });

  function animate() {
    current = lerp(current, target, 0.07);
    track.style.transform = `translateX(-${current}px)`;
    raf = requestAnimationFrame(animate);
  }
  animate();
})();

// ===== PARTICULES — SECTION ABOUT =====
(function () {
  const canvas = document.getElementById('aboutCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x       = Math.random() * W;
      this.y       = init ? Math.random() * H : H + 6;
      this.r       = Math.random() * 1.4 + 0.3;
      this.speed   = Math.random() * 0.28 + 0.06;
      this.opacity = Math.random() * 0.22 + 0.04;
      this.drift   = (Math.random() - 0.5) * 0.18;
    }
    update() {
      this.y -= this.speed;
      this.x += this.drift;
      if (this.y < -6) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,58,237,${this.opacity})`;
      ctx.fill();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  resize();
  particles = Array.from({ length: 55 }, () => new Particle());
  animate();
  window.addEventListener('resize', resize);
})();

// ===== BARRES SKILLS — SECTION ABOUT =====
(function () {
  const fills = document.querySelectorAll('.skill-viz-fill');
  if (!fills.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => { el.style.width = el.dataset.width + '%'; }, 150);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => obs.observe(f));
})();

// ===== SCROLL-DRIVEN — WEBBUILDER STUDIO =====
(function () {
  const section = document.getElementById('wbsSection');
  const visual  = document.getElementById('wbsVisual');
  const img     = document.getElementById('wbsImg');
  const text    = document.getElementById('wbsText');
  if (!section || !visual || !img || !text) return;

  function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }

  function update() {
    if (window.innerWidth <= 768) {
      visual.style.width        = '';
      visual.style.marginLeft   = '';
      visual.style.height       = '';
      visual.style.borderRadius = '';
      img.style.transform       = '';
      text.style.transform      = '';
      return;
    }

    const scrolled  = Math.max(0, -section.getBoundingClientRect().top);
    const maxScroll = section.offsetHeight - window.innerHeight;
    const progress  = Math.min(1, scrolled / maxScroll);
    const vw = document.documentElement.clientWidth;
    const vh = window.innerHeight;

    // Phase 1 (0 → 0.40) : image rétrécit de 90 % à 50 %, centrée
    const p1 = ease(Math.max(0, Math.min(1, progress / 0.40)));
    const w  = vw * (0.9 - 0.4 * p1);
    visual.style.width        = w + 'px';
    visual.style.marginLeft   = ((vw - w) / 2) + 'px';
    visual.style.height       = (vh * (0.9 - 0.4 * p1)) + 'px';
    visual.style.borderRadius = (p1 * 18) + 'px';
    img.style.transform       = '';

    // Phase 2 (0.50 → 0.88) : texte monte sur l'image
    const p2    = ease(Math.max(0, Math.min(1, (progress - 0.50) / 0.38)));
    const textY = 120 - p2 * 230;
    text.style.transform = `translateY(${Math.max(-110, textY)}px)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ===== JOURNAL — EXPAND / COLLAPSE =====
document.querySelectorAll('.article-toggle, .article-title').forEach(el => {
  el.addEventListener('click', () => {
    const card = el.closest('.article-card');
    const body = card.querySelector('.article-body');
    const isExpanded = card.classList.toggle('expanded');
    body.style.maxHeight = isExpanded ? body.scrollHeight + 'px' : '';
  });
});

// ===== LIEN ACTIF DANS LA NAV =====
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  const isActive = href === page || (page === '' && href === 'index.html');
  link.classList.toggle('active', isActive);
});
