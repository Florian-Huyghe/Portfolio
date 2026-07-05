(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------------
     i18n
     --------------------------------------------------------------------- */
  function getPath(obj, path) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
  }

  const langSwitch = document.querySelector('.lang-switch');
  let currentLang = localStorage.getItem('fh-lang') || (navigator.language || 'fr').slice(0, 2);
  if (currentLang !== 'fr' && currentLang !== 'en') currentLang = 'fr';

  function applyLang(lang) {
    const dict = TRANSLATIONS[lang];
    if (!dict) return;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const value = getPath(dict, el.getAttribute('data-i18n'));
      if (value !== null) el.innerHTML = value;
    });

    document.documentElement.lang = lang;

    if (langSwitch) {
      langSwitch.querySelectorAll('button').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
      });
    }

    currentLang = lang;
    localStorage.setItem('fh-lang', lang);
    restartTypewriter();
    document.dispatchEvent(new CustomEvent('fh:langchange', { detail: { lang } }));
  }

  if (langSwitch) {
    langSwitch.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-lang]');
      if (!btn) return;
      applyLang(btn.getAttribute('data-lang'));
    });
  }

  /* ---------------------------------------------------------------------
     Typewriter (hero role)
     --------------------------------------------------------------------- */
  const typewriterEl = document.getElementById('typewriter');
  const roleWrap = typewriterEl ? typewriterEl.closest('.hero-role') : null;
  let twTimer = null;

  function restartTypewriter() {
    if (twTimer) { clearTimeout(twTimer); twTimer = null; }
    if (!typewriterEl) return;

    const roles = getPath(TRANSLATIONS[currentLang], 'hero.roles') || [];
    if (!roles.length) return;

    typewriterEl.textContent = roles[0];
    if (prefersReducedMotion || roles.length < 2) return;

    let roleIndex = 0;

    function swap() {
      roleIndex = (roleIndex + 1) % roles.length;
      if (roleWrap) roleWrap.classList.add('is-swapping');
      twTimer = setTimeout(() => {
        typewriterEl.textContent = roles[roleIndex];
        if (roleWrap) roleWrap.classList.remove('is-swapping');
        twTimer = setTimeout(swap, 3200);
      }, 250);
    }

    twTimer = setTimeout(swap, 3200);
  }

  /* ---------------------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------------------------------------------------------------------
     Nav: active link on scroll + mobile burger
     --------------------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length) {
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => navIo.observe(s));
  }

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
    });
    nav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------------------
     Hero canvas — dots that drift and ease toward the cursor when near
     --------------------------------------------------------------------- */
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas && !prefersReducedMotion) {
    const ctx = heroCanvas.getContext('2d');
    const hero = heroCanvas.closest('.hero');
    const PROXIMITY = 130;
    const MAX_PULL = 30;

    let width, height, dots;
    let running = true;
    const mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      const rect = hero.getBoundingClientRect();
      width = heroCanvas.width = rect.width;
      height = heroCanvas.height = rect.height;
      const count = Math.min(44, Math.max(16, Math.floor((width * height) / 28000)));
      dots = Array.from({ length: count }, () => ({
        baseX: Math.random() * width,
        baseY: Math.random() * height,
        x: 0, y: 0,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: 1 + Math.random() * 1.1
      })).map((d) => ({ ...d, x: d.baseX, y: d.baseY }));
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      dots.forEach((d) => {
        d.baseX += d.vx; d.baseY += d.vy;
        if (d.baseX < 0 || d.baseX > width) d.vx *= -1;
        if (d.baseY < 0 || d.baseY > height) d.vy *= -1;

        let targetX = d.baseX, targetY = d.baseY;
        if (mouse.active) {
          const dx = mouse.x - d.baseX, dy = mouse.y - d.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < PROXIMITY) {
            const pull = (1 - dist / PROXIMITY) * MAX_PULL;
            const angle = Math.atan2(dy, dx);
            targetX = d.baseX + Math.cos(angle) * pull;
            targetY = d.baseY + Math.sin(angle) * pull;
          }
        }
        d.x += (targetX - d.x) * 0.12;
        d.y += (targetY - d.y) * 0.12;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(63, 163, 131, 0.45)';
        ctx.fill();
      });

      requestAnimationFrame(step);
    }

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    hero.addEventListener('mouseleave', () => { mouse.active = false; });

    if ('IntersectionObserver' in window) {
      const heroIo = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const wasRunning = running;
          running = entry.isIntersecting;
          if (running && !wasRunning) requestAnimationFrame(step);
        });
      }, { threshold: 0 });
      heroIo.observe(hero);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(step);
  }

  /* ---------------------------------------------------------------------
     Skill cards: collapsible "voir plus"
     --------------------------------------------------------------------- */
  const COLLAPSED_HEIGHT = 190;
  const collapsibleCards = document.querySelectorAll('.skill-card.collapsible');

  function syncCollapsedState(card) {
    if (card.classList.contains('expanded')) return;
    const body = card.querySelector('.skill-card-body');
    if (!body) return;
    card.classList.toggle('no-toggle', body.scrollHeight <= COLLAPSED_HEIGHT + 20);
  }

  collapsibleCards.forEach((card) => {
    const body = card.querySelector('.skill-card-body');
    const toggle = card.querySelector('.skill-card-toggle');
    if (!body || !toggle) return;

    syncCollapsedState(card);

    toggle.addEventListener('click', () => {
      const expanded = card.classList.toggle('expanded');
      toggle.setAttribute('aria-expanded', String(expanded));
      body.style.maxHeight = expanded ? body.scrollHeight + 'px' : '';
    });
  });

  // Card titles wrap to a different number of lines depending on their length,
  // so the head (icon + title) can end up taller on one card than its row-mates.
  // Measure the tallest head per row and align the rest to it.
  const skillRows = document.querySelectorAll('.skills-row');

  function syncHeadHeights() {
    skillRows.forEach((row) => {
      const heads = Array.from(row.querySelectorAll('.skill-card-head'));
      if (!heads.length) return;
      heads.forEach((h) => { h.style.minHeight = ''; });
      const max = Math.max(...heads.map((h) => h.getBoundingClientRect().height));
      heads.forEach((h) => { h.style.minHeight = max + 'px'; });
    });
  }

  syncHeadHeights();
  document.addEventListener('fh:langchange', () => setTimeout(syncHeadHeights, 0));
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncHeadHeights);
  }

  if (collapsibleCards.length || skillRows.length) {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        collapsibleCards.forEach((card) => {
          const body = card.querySelector('.skill-card-body');
          if (!body) return;
          if (card.classList.contains('expanded')) {
            body.style.maxHeight = body.scrollHeight + 'px';
          } else {
            syncCollapsedState(card);
          }
        });
        syncHeadHeights();
      }, 200);
    });
  }

  /* ---------------------------------------------------------------------
     Footer year + init
     --------------------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  applyLang(currentLang);
})();
