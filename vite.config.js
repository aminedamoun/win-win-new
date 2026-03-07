import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    target: 'es2022',
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        jobs: resolve(__dirname, 'jobs.html'),
        job: resolve(__dirname, 'job.html'),
        apply: resolve(__dirname, 'apply.html'),
        insights: resolve(__dirname, 'insights.html'),
        article: resolve(__dirname, 'article.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        terms: resolve(__dirname, 'terms.html'),
        cookies: resolve(__dirname, 'cookies.html'),
        'admin-applications': resolve(__dirname, 'admin/applications.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
});
