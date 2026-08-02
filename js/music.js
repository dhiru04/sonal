/* ============================================================
   MUSIC.JS — always-on background piano, no visible control
   Tries to autoplay the instant the page loads. Browsers block
   audio-with-sound autoplay until the visitor has interacted with
   the site at least once, so as a silent fallback this also starts
   the track on the very first tap/click anywhere on the page (e.g.
   the "Start Journey" button) if the initial attempt was blocked.
   ============================================================ */

(function () {
  'use strict';

  function init() {
    const audio = document.querySelector('[data-bg-music]');
    if (!audio) return;

    audio.volume = 0.55;

    function tryPlay() {
      const p = audio.play();
      if (p && typeof p.catch === 'function') {
        p.catch(() => {
          /* autoplay blocked — wait for the first tap/click anywhere */
          const unlock = () => {
            audio.play().catch(() => {});
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('keydown', unlock);
          };
          document.addEventListener('click', unlock, { once: true });
          document.addEventListener('touchstart', unlock, { once: true });
          document.addEventListener('keydown', unlock, { once: true });
        });
      }
    }

    tryPlay();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
