import { renderHomeBlog } from './insights.js';
import { initPage } from './page-utils.js';

document.addEventListener("DOMContentLoaded", async () => {
  initPage();
  try {
    await renderHomeBlog();
  } catch { }
});
