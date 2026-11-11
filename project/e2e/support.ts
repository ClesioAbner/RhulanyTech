import type { Page } from '@playwright/test';

/** Marks the intro as already seen, so a test starts on the page itself (the intro has its own test). */
export const skipIntro = (page: Page) =>
  page.addInitScript(() => {
    try {
      sessionStorage.setItem('rt-intro', '1');
    } catch {
      // Storage blocked: the intro plays and the test simply waits for it.
    }
  });

/**
 * Collects errors from the page's own code. Third-party resources (stock photos, map, fonts) can be
 * unreachable from a test machine, so failed downloads are not counted.
 */
export const watchErrors = (page: Page) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !/Failed to load resource|net::ERR_/.test(message.text())) errors.push(message.text());
  });
  return errors;
};
