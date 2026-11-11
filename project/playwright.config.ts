import { defineConfig, devices } from '@playwright/test';

// Not Vite's usual 4173, which other projects on the same machine tend to have open.
const PORT = 4317;
const CI = Boolean(process.env.CI);

/*
 * Browser tests on the production build (built with --mode e2e so the chat is switched on).
 * Desktop runs every spec; the phone project runs the *.mobile.spec.ts files.
 */
export default defineConfig({
  testDir: 'e2e',
  // A purchase waits for the simulated payment and the delivery van, so tests get room on a busy machine.
  timeout: 60_000,
  fullyParallel: true,
  // Two browsers at a time: the 3D pages are heavy, and more would starve each other.
  workers: 2,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  reporter: CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    locale: 'pt-PT',
    trace: 'retain-on-failure',
    // On a developer's machine, the Chrome already installed; CI installs Playwright's own Chromium.
    ...(CI ? {} : { channel: 'chrome' }),
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /\.mobile\.spec\.ts$/ },
    { name: 'phone', use: { ...devices['Pixel 7'] }, testMatch: /\.mobile\.spec\.ts$/ },
  ],
  webServer: {
    command: `npm run build:e2e && npx vite preview --outDir dist-e2e --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !CI,
    timeout: 180_000,
  },
});
