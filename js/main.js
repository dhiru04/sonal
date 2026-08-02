/* ============================================================
   MAIN.JS — shared behaviour used on every page
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Reveal-on-scroll ---------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll('.fade-in');
    if (!targets.length) return;

    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ---------- Journey dots ---------- */
  function initJourneyDots() {
    const wrap = document.querySelector('[data-journey-dots]');
    if (!wrap) return;
    const total = parseInt(wrap.dataset.total || '10', 10);
    const current = parseInt(wrap.dataset.current || '1', 10);
    wrap.innerHTML = '';
    for (let i = 1; i <= total; i++) {
      const dot = document.createElement('span');
      if (i === current) dot.classList.add('is-active');
      wrap.appendChild(dot);
    }
  }

  /* ---------- Dreamy page transitions ---------- */
  function initPageTransitions() {
    const veil = document.querySelector('.page-transition-veil');
    const links = document.querySelectorAll('[data-transition]');
    if (!veil || !links.length) return;

    links.forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || link.target === '_blank') return;
        e.preventDefault();
        veil.classList.add('is-active');
        window.setTimeout(() => {
          window.location.href = href;
        }, 550);
      });
    });
  }

  /* ---------- Ripple-free tap feedback for buttons ---------- */
  function initButtonFeedback() {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('pointerdown', () => btn.classList.add('is-pressed'));
      btn.addEventListener('pointerup', () => btn.classList.remove('is-pressed'));
      btn.addEventListener('pointerleave', () => btn.classList.remove('is-pressed'));
    });
  }

  /* ---------- Typewriter helper (used by letter.html / forever.html) ---------- */
  window.BDAY = window.BDAY || {};
  window.BDAY.typewriter = function (el, text, speed, onDone) {
    if (!el) return;
    speed = speed || 28;
    let i = 0;
    el.textContent = '';
    const caret = document.createElement('span');
    caret.className = 'type-caret';
    caret.textContent = '|';
    caret.style.animation = 'typewriterCaret 0.8s steps(1) infinite';

    function step() {
      if (i < text.length) {
        el.textContent = text.slice(0, i + 1);
        el.appendChild(caret);
        i++;
        window.setTimeout(step, speed);
      } else if (typeof onDone === 'function') {
        onDone();
      }
    }
    step();
  };

  document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initJourneyDots();
    initPageTransitions();
    initButtonFeedback();
  });
})();
