import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname || '.', 'index.html'),
        login: resolve(import.meta.dirname || '.', 'login.html'),
        artisan: resolve(import.meta.dirname || '.', 'artisan.html'),
      },
    },
  },
});
