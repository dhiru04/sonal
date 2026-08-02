/* ============================================================
   GALLERY.JS — lightweight lightbox for the memories strip
   ============================================================ */

(function () {
  'use strict';

  function init() {
    const strip = document.querySelector('[data-gallery]');
    if (!strip) return;

    const items = Array.from(strip.querySelectorAll('img'));
    if (!items.length) return;

    const overlay = document.createElement('div');
    overlay.className = 'gallery-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Memory viewer');
    overlay.innerHTML = `
      <button class="gallery-lightbox__close" aria-label="Close">✕</button>
      <button class="gallery-lightbox__nav gallery-lightbox__nav--prev" aria-label="Previous photo">‹</button>
      <img class="gallery-lightbox__img" alt="" loading="lazy" />
      <button class="gallery-lightbox__nav gallery-lightbox__nav--next" aria-label="Next photo">›</button>
    `;
    document.body.appendChild(overlay);

    const style = document.createElement('style');
    style.textContent = `
      .gallery-lightbox {
        position: fixed; inset: 0; z-index: 200;
        display: none; align-items: center; justify-content: center;
        background: rgba(90,74,82,0.55);
        backdrop-filter: blur(6px);
        padding: var(--space-md);
      }
      .gallery-lightbox.is-open { display: flex; }
      .gallery-lightbox__img {
        max-width: min(90vw, 40rem); max-height: 80svh;
        border-radius: var(--radius-soft);
        box-shadow: 0 1.5rem 4rem rgba(0,0,0,0.35);
      }
      .gallery-lightbox__close, .gallery-lightbox__nav {
        position: absolute; background: rgba(255,255,255,0.85);
        border: none; border-radius: 50%; width: 2.8rem; height: 2.8rem;
        font-size: 1.3rem; cursor: pointer; color: var(--text);
      }
      .gallery-lightbox__close { top: 1rem; right: 1rem; }
      .gallery-lightbox__nav--prev { left: 1rem; top: 50%; transform: translateY(-50%); }
      .gallery-lightbox__nav--next { right: 1rem; top: 50%; transform: translateY(-50%); }
    `;
    document.head.appendChild(style);

    const imgEl = overlay.querySelector('.gallery-lightbox__img');
    let currentIndex = 0;

    function open(index) {
      currentIndex = index;
      imgEl.src = items[currentIndex].src;
      imgEl.alt = items[currentIndex].alt || '';
      overlay.classList.add('is-open');
    }
    function close() { overlay.classList.remove('is-open'); }
    function step(dir) {
      currentIndex = (currentIndex + dir + items.length) % items.length;
      imgEl.src = items[currentIndex].src;
      imgEl.alt = items[currentIndex].alt || '';
    }

    items.forEach((img, i) => {
      img.style.cursor = 'pointer';
      img.tabIndex = 0;
      img.addEventListener('click', () => open(i));
      img.addEventListener('keypress', (e) => { if (e.key === 'Enter') open(i); });
    });

    overlay.querySelector('.gallery-lightbox__close').addEventListener('click', close);
    overlay.querySelector('.gallery-lightbox__nav--prev').addEventListener('click', () => step(-1));
    overlay.querySelector('.gallery-lightbox__nav--next').addEventListener('click', () => step(1));
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
