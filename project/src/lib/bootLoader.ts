/*
 * The full-screen loader in index.html covers the first visit until the app has a page to show.
 * It leaves once nothing on the page is still loading (no PageLoader in the DOM), so opening a
 * lazily loaded page directly goes from that loader to the page, without a second loader in between.
 *
 * On the first visit of a session it plays as an intro (.rt-intro on <html>, set in index.html):
 * its letters start once the logo's typeface is in (window.rtIntroStart), it stays INTRO_MS from
 * then, even on a fast connection, and leaves as a curtain rising, announcing INTRO_LIFT.
 */
const PAGE_LOADER = '[data-page-loader]';
// About two seconds of frames: if the app has still drawn nothing, stop covering it.
const MAX_WAIT_FRAMES = 120;
// From the first letter rising to the curtain lifting.
const INTRO_MS = 1700;

/** Fired when the intro's curtain starts to lift; the page can begin its own entrance then. */
export const INTRO_LIFT = 'rt:intro-lift';

const isIntro = () => document.documentElement.classList.contains('rt-intro');
const introStart = () => (window as Window & { rtIntroStart?: number }).rtIntroStart;

/** True while the intro still covers the page; wait for INTRO_LIFT before playing an entrance. */
export const introPending = () => {
  const boot = document.getElementById('boot');
  return isIntro() && Boolean(boot) && !boot?.dataset.done;
};

export const settleBootLoader = (frame = 0) => {
  requestAnimationFrame(() => {
    const boot = document.getElementById('boot');
    if (!boot || boot.dataset.done) return;
    const rendered = document.getElementById('root')?.hasChildNodes();
    if (!rendered && frame < MAX_WAIT_FRAMES) {
      settleBootLoader(frame + 1);
      return;
    }
    if (rendered && document.querySelector(PAGE_LOADER)) return;
    const intro = isIntro();
    if (intro) {
      // The letters may still be waiting for the typeface: look again shortly.
      const start = introStart();
      const left = start === undefined ? 100 : start + INTRO_MS - performance.now();
      if (left > 0) {
        window.setTimeout(() => settleBootLoader(), left);
        return;
      }
    }
    boot.dataset.done = 'true';
    boot.classList.add('rt-boot--done');
    if (intro) window.dispatchEvent(new Event(INTRO_LIFT));
    window.setTimeout(
      () => {
        boot.remove();
        document.documentElement.classList.remove('rt-intro', 'rt-ready');
      },
      intro ? 950 : 600,
    );
  });
};
