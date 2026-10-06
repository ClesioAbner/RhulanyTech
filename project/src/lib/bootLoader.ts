/*
 * The full-screen loader in index.html covers the first visit until the app has a page to show.
 * It leaves once nothing on the page is still loading (no PageLoader in the DOM), so opening a
 * lazily loaded page directly goes from that loader to the page, without a second loader in between.
 */
const PAGE_LOADER = '[data-page-loader]';
// About two seconds of frames: if the app has still drawn nothing, stop covering it.
const MAX_WAIT_FRAMES = 120;

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
    boot.dataset.done = 'true';
    boot.classList.add('rt-boot--done');
    window.setTimeout(() => boot.remove(), 600);
  });
};
