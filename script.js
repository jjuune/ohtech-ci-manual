/* ══════════════════════════════════════════════════
   OH Technology CI Manual — Interactivity
   ══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── THEME TOGGLE ──────────────────────────────────
  const html = document.documentElement;
  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const toggleIcon = document.getElementById('toggleIcon');
  const toggleLabel = document.getElementById('toggleLabel');

  const STORAGE_KEY = 'oh-ci-theme';

  function applyTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    if (theme === 'dark') {
      toggleIcon.textContent = '☀';
      toggleLabel.textContent = 'Light Mode';
    } else {
      toggleIcon.textContent = '☾';
      toggleLabel.textContent = 'Dark Mode';
    }
  }

  // Load saved preference
  // Clear old preference to force white tone (temporary)
  // localStorage.removeItem(STORAGE_KEY);
  const saved = localStorage.getItem(STORAGE_KEY);
  applyTheme(saved || 'light');

  themeToggle.addEventListener('click', () => {
    const current = body.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ── SIDEBAR ACTIVE STATE ──────────────────────────
  const navItems = document.querySelectorAll('.nav-item[data-section]');
  const sections = document.querySelectorAll('.content-section');

  function setActive(id) {
    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-section') === id);
    });
  }

  // IntersectionObserver for active section highlight
  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Smooth scroll with offset
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const sectionId = item.getAttribute('data-section');
      const target = document.getElementById(sectionId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile sidebar
        sidebar.classList.remove('open');
        overlay.classList.remove('active');
      }
    });
  });

  // ── MOBILE SIDEBAR ────────────────────────────────
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const overlay = document.getElementById('sidebarOverlay');

  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  // ── SECTION ENTRY ANIMATION ───────────────────────
  const animObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  // Add animation targets
  const animTargets = document.querySelectorAll(
    '.content-card, .principle-card, .app-card, .incorrect-card, .logo-preview-card, .photo-guide-col, .fm-card'
  );

  animTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = `opacity 0.4s ease ${i % 6 * 0.06}s, transform 0.4s ease ${i % 6 * 0.06}s`;
    animObserver.observe(el);
  });

  // Add visible class handling via CSS (inject once)
  const style = document.createElement('style');
  style.textContent = `
    .content-card.visible,
    .principle-card.visible,
    .app-card.visible,
    .incorrect-card.visible,
    .logo-preview-card.visible,
    .photo-guide-col.visible,
    .fm-card.visible {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
  `;
  document.head.appendChild(style);

  // ── COVER GRID PARALLAX (SUBTLE) ─────────────────
  const coverGrid = document.querySelector('.cover-bg-grid');
  if (coverGrid) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      coverGrid.style.transform = `translate(${x}px, ${y}px)`;
    });
  }

  // ── SIDEBAR SCROLL INDICATOR ──────────────────────
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: linear-gradient(90deg, #2563EB, #3B82F6);
    z-index: 999;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight * 100) : 0;
    progressBar.style.width = pct + '%';
  });

})();
