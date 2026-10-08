import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { assistantMock } from './dev/assistantMock';

// https://vitejs.dev/config/
export default defineConfig({
  // assistantMock answers the chat with demo replies during `npm run dev` only.
  plugins: [react(), assistantMock()],
});
