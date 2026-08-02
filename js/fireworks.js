/* ============================================================
   FIREWORKS.JS — canvas fireworks + confetti bursts
   Exposes window.BDAY.fireworks(canvas) and window.BDAY.confetti(canvas)
   Pastel palette only, requestAnimationFrame driven, auto-pauses
   when tab is hidden to save battery.
   ============================================================ */

(function () {
  'use strict';
  window.BDAY = window.BDAY || {};

  const PASTELS = ['#F8C8DC', '#FFD8BE', '#DCCEF9', '#CFE8FF', '#D7F5E9', '#F7D774'];

  function rand(min, max) { return Math.random() * (max - min) + min; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function setupCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    function resize() {
      canvas.width = canvas.clientWidth * devicePixelRatio;
      canvas.height = canvas.clientHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    return ctx;
  }

  /* ---------------- Fireworks ---------------- */
  function Particle(x, y, color) {
    this.x = x; this.y = y;
    const angle = rand(0, Math.PI * 2);
    const speed = rand(1.5, 5.5);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.color = color;
    this.alpha = 1;
    this.life = rand(50, 90);
    this.age = 0;
    this.size = rand(1.5, 3);
  }
  Particle.prototype.update = function () {
    this.vy += 0.035; /* gravity */
    this.vx *= 0.985;
    this.vy *= 0.985;
    this.x += this.vx;
    this.y += this.vy;
    this.age++;
    this.alpha = Math.max(0, 1 - this.age / this.life);
  };
  Particle.prototype.draw = function (ctx) {
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  };

  window.BDAY.fireworks = function (canvas, opts) {
    opts = opts || {};
    const ctx = setupCanvas(canvas);
    let particles = [];
    let running = true;
    let lastLaunch = 0;
    const maxDuration = opts.duration || 6000;
    const start = performance.now();

    function launch() {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const x = rand(w * 0.15, w * 0.85);
      const y = rand(h * 0.15, h * 0.55);
      const color = pick(PASTELS);
      const count = 46;
      for (let i = 0; i < count; i++) particles.push(new Particle(x, y, color));
    }

    function frame(t) {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      if (t - lastLaunch > rand(500, 950) && t - start < maxDuration) {
        launch();
        lastLaunch = t;
      }

      particles.forEach((p) => { p.update(); p.draw(ctx); });
      particles = particles.filter((p) => p.alpha > 0.02);
      ctx.globalAlpha = 1;

      if (t - start < maxDuration + 2000) {
        requestAnimationFrame(frame);
      } else {
        running = false;
      }
    }

    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(frame);
    });

    requestAnimationFrame(frame);
    return { stop: () => { running = false; } };
  };

  /* ---------------- Confetti ---------------- */
  function ConfettiPiece(w) {
    this.x = rand(0, w);
    this.y = rand(-40, -10);
    this.size = rand(6, 11);
    this.color = pick(PASTELS);
    this.speedY = rand(1.5, 3.4);
    this.speedX = rand(-1.2, 1.2);
    this.rotation = rand(0, 360);
    this.spin = rand(-6, 6);
    this.shape = Math.random() > 0.5 ? 'circle' : 'rect';
  }
  ConfettiPiece.prototype.update = function () {
    this.y += this.speedY;
    this.x += this.speedX + Math.sin(this.y / 30);
    this.rotation += this.spin;
  };
  ConfettiPiece.prototype.draw = function (ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    if (this.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    }
    ctx.restore();
  };

  window.BDAY.confetti = function (canvas, opts) {
    opts = opts || {};
    const ctx = setupCanvas(canvas);
    const count = opts.count || 140;
    const duration = opts.duration || 4200;
    let pieces = [];
    const w = canvas.clientWidth;
    for (let i = 0; i < count; i++) pieces.push(new ConfettiPiece(w));
    const start = performance.now();

    function frame(t) {
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, canvas.clientWidth, h);
      pieces.forEach((p) => { p.update(); p.draw(ctx); });
      pieces = pieces.filter((p) => p.y < h + 20);
      if (t - start < duration && pieces.length) {
        requestAnimationFrame(frame);
      } else {
        ctx.clearRect(0, 0, canvas.clientWidth, h);
      }
    }
    requestAnimationFrame(frame);
  };

  /* ---------------- Rising smoke (for blown-out candles) ---------------- */
  window.BDAY.smoke = function (canvas, x, y) {
    const ctx = setupCanvas(canvas);
    let puffs = [];
    for (let i = 0; i < 10; i++) {
      puffs.push({
        x: x + rand(-4, 4),
        y: y,
        r: rand(2, 5),
        vy: rand(0.4, 0.9),
        alpha: rand(0.4, 0.7),
        drift: rand(-0.3, 0.3),
      });
    }
    const start = performance.now();
    function frame(t) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      puffs.forEach((p) => {
        p.y -= p.vy;
        p.x += p.drift;
        p.r += 0.06;
        p.alpha *= 0.985;
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#cfc3c9';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      if (t - start < 2600) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };
})();
