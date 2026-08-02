/* ============================================================
   PARTICLES.JS — lightweight DOM-based ambient particles
   Reads data attributes on any element with [data-particles] :
     data-particles="petals,hearts,stars"
     data-count="18"
   Uses requestAnimationFrame only for spawning throttling —
   the actual motion is handled by cheap CSS animations so the
   main thread stays free.
   ============================================================ */

(function () {
  'use strict';

  const EMOJI = {
    petals: ['🌸', '🌸', '🌸'],
    hearts: ['❤️', '💗', '💕'],
    butterflies: ['🦋'],
    sparkles: ['✨', '⭐'],
  };

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function spawnStar(layer) {
    const star = document.createElement('div');
    star.className = 'p-star anim-twinkle';
    star.style.cssText = `
      position:absolute;
      left:${rand(0, 100)}%;
      top:${rand(0, 60)}%;
      width:${rand(2, 4)}px;
      height:${rand(2, 4)}px;
      border-radius:50%;
      background:#fff;
      box-shadow:0 0 6px 1px rgba(255,255,255,0.9);
      animation-delay:${rand(0, 3)}s;
    `;
    layer.appendChild(star);
  }

  function spawnFalling(layer, kind) {
    const span = document.createElement('span');
    const pool = EMOJI[kind] || EMOJI.petals;
    span.textContent = pool[Math.floor(rand(0, pool.length))];
    const duration = rand(9, 16);
    const size = rand(0.9, 1.6);
    const drift = rand(-8, 8);
    span.style.cssText = `
      position:absolute;
      left:${rand(0, 100)}%;
      top:-5%;
      font-size:${size}rem;
      opacity:0.9;
      will-change:transform;
      animation:fallPetal ${duration}s linear infinite;
      animation-delay:${rand(0, duration)}s;
      --drift:${drift}vw;
    `;
    layer.appendChild(span);
  }

  function spawnRising(layer, kind) {
    const span = document.createElement('span');
    const pool = EMOJI[kind] || EMOJI.hearts;
    span.textContent = pool[Math.floor(rand(0, pool.length))];
    const duration = rand(7, 13);
    const size = rand(0.8, 1.5);
    span.style.cssText = `
      position:absolute;
      left:${rand(4, 96)}%;
      bottom:-5%;
      font-size:${size}rem;
      opacity:0.85;
      will-change:transform;
      animation:heartRise ${duration}s ease-in infinite;
      animation-delay:${rand(0, duration)}s;
    `;
    layer.appendChild(span);
  }

  function spawnCloud(layer) {
    const cloud = document.createElement('div');
    const w = rand(6, 14);
    const dur = rand(40, 80);
    cloud.style.cssText = `
      position:absolute;
      top:${rand(2, 35)}%;
      left:-15%;
      width:${w}rem;
      height:${w * 0.4}rem;
      background:rgba(255,255,255,0.75);
      border-radius:50%;
      filter:blur(2px);
      box-shadow:${w * 0.6}px ${w * 0.1}px 0 -${w * 0.08}px rgba(255,255,255,0.75),
                 -${w * 0.5}px ${w * 0.15}px 0 -${w * 0.1}px rgba(255,255,255,0.65);
      animation:driftAcross ${dur}s linear infinite;
      animation-delay:-${rand(0, dur)}s;
    `;
    layer.appendChild(cloud);
  }

  function spawnButterfly(layer) {
    const b = document.createElement('span');
    b.textContent = '🦋';
    const dur = rand(14, 22);
    b.style.cssText = `
      position:absolute;
      left:-5%;
      top:${rand(15, 75)}%;
      font-size:${rand(1, 1.6)}rem;
      animation:driftAcross ${dur}s ease-in-out infinite, floatY 2.4s ease-in-out infinite;
      animation-delay:-${rand(0, dur)}s, ${rand(0, 2)}s;
    `;
    layer.appendChild(b);
  }

  function init() {
    document.querySelectorAll('[data-particles]').forEach((layer) => {
      const kinds = layer.dataset.particles.split(',').map((s) => s.trim());
      const count = parseInt(layer.dataset.count || '14', 10);

      kinds.forEach((kind) => {
        if (kind === 'stars') {
          for (let i = 0; i < count; i++) spawnStar(layer);
        } else if (kind === 'clouds') {
          for (let i = 0; i < Math.max(3, Math.round(count / 4)); i++) spawnCloud(layer);
        } else if (kind === 'butterflies') {
          for (let i = 0; i < Math.max(2, Math.round(count / 5)); i++) spawnButterfly(layer);
        } else if (kind === 'hearts') {
          for (let i = 0; i < count; i++) spawnRising(layer, 'hearts');
        } else {
          for (let i = 0; i < count; i++) spawnFalling(layer, kind);
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
