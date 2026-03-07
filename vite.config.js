import { defineConfig } from 'vite';
import { resolve } from 'path';
import { cpSync, existsSync } from 'fs';

function copyContentPlugin() {
  return {
    name: 'copy-content',
    closeBundle() {
      const src = resolve(__dirname, 'content');
      const dest = resolve(__dirname, 'dist/content');
      if (existsSync(src)) {
        cpSync(src, dest, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  root: '.',
  plugins: [copyContentPlugin()],
  build: {
    outDir: 'dist',
    target: 'es2022',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        zaposlitve: resolve(__dirname, 'zaposlitve/index.html'),
        'o-nas': resolve(__dirname, 'o-nas/index.html'),
        vpogledi: resolve(__dirname, 'vpogledi/index.html'),
        clanek: resolve(__dirname, 'clanek/index.html'),
        prijava: resolve(__dirname, 'prijava/index.html'),
        pozicija: resolve(__dirname, 'pozicija/index.html'),
        zasebnost: resolve(__dirname, 'zasebnost/index.html'),
        pogoji: resolve(__dirname, 'pogoji/index.html'),
        piskotki: resolve(__dirname, 'piskotki/index.html'),
        'admin-applications': resolve(__dirname, 'admin/applications.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
});
