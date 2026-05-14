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

// ===== LIEN ACTIF DANS LA NAV =====
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href');
  const isActive = href === page || (page === '' && href === 'index.html');
  link.classList.toggle('active', isActive);
});
