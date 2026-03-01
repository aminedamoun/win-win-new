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
        'index-sl': resolve(__dirname, 'index-sl.html'),
        about: resolve(__dirname, 'about.html'),
        'about-sl': resolve(__dirname, 'about-sl.html'),
        jobs: resolve(__dirname, 'jobs.html'),
        'jobs-sl': resolve(__dirname, 'jobs-sl.html'),
        job: resolve(__dirname, 'job.html'),
        'job-sl': resolve(__dirname, 'job-sl.html'),
        apply: resolve(__dirname, 'apply.html'),
        'apply-sl': resolve(__dirname, 'apply-sl.html'),
        insights: resolve(__dirname, 'insights.html'),
        'insights-sl': resolve(__dirname, 'insights-sl.html'),
        article: resolve(__dirname, 'article.html'),
        'article-sl': resolve(__dirname, 'article-sl.html'),
        privacy: resolve(__dirname, 'privacy.html'),
        'privacy-sl': resolve(__dirname, 'privacy-sl.html'),
        terms: resolve(__dirname, 'terms.html'),
        'terms-sl': resolve(__dirname, 'terms-sl.html'),
        cookies: resolve(__dirname, 'cookies.html'),
        'cookies-sl': resolve(__dirname, 'cookies-sl.html'),
        'admin-applications': resolve(__dirname, 'admin/applications.html'),
      },
    },
  },
  server: {
    port: 3000,
  },
});
