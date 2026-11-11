/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { assistantMock } from './dev/assistantMock';

// https://vitejs.dev/config/
export default defineConfig({
  // assistantMock answers the chat with demo replies during `npm run dev` only.
  plugins: [react(), assistantMock()],
  // Unit and component tests (npm test). Browser tests live in e2e/ and run with Playwright.
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    restoreMocks: true,
  },
});
