/*
 * The full-screen loader in index.html covers the first visit until the app has a page to show.
 * It leaves once nothing on the page is still loading (no PageLoader in the DOM), so opening a
 * lazily loaded page directly goes from that loader to the page, without a second loader in between.
 *
 * On the first visit of a session it plays as an intro (.rt-intro on <html>, set in index.html):
 * it then stays at least INTRO_MS, even on a fast connection, and leaves as a curtain rising.
 */
const PAGE_LOADER = '[data-page-loader]';
// About two seconds of frames: if the app has still drawn nothing, stop covering it.
const MAX_WAIT_FRAMES = 120;
// Counted from the start of navigation, like performance.now().
const INTRO_MS = 1700;

const isIntro = () => document.documentElement.classList.contains('rt-intro');

/** Seconds until the intro starts to lift, so a page can hold its entrance for that moment. */
export const introRemaining = () => {
  const boot = document.getElementById('boot');
  if (!isIntro() || !boot || boot.dataset.done) return 0;
  return Math.max(0, INTRO_MS - performance.now()) / 1000;
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
    if (intro && performance.now() < INTRO_MS) {
      window.setTimeout(() => settleBootLoader(), INTRO_MS - performance.now());
      return;
    }
    boot.dataset.done = 'true';
    boot.classList.add('rt-boot--done');
    window.setTimeout(
      () => {
        boot.remove();
        document.documentElement.classList.remove('rt-intro');
      },
      intro ? 950 : 600,
    );
  });
};
