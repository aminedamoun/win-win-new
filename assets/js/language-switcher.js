// Language switcher - maintains current page when switching languages
const pageMap = {
  'index.html': 'index-sl.html',
  'index-sl.html': 'index.html',
  'about.html': 'about-sl.html',
  'about-sl.html': 'about.html',
  'jobs.html': 'jobs-sl.html',
  'jobs-sl.html': 'jobs.html',
  'job.html': 'job-sl.html',
  'job-sl.html': 'job.html',
  'apply.html': 'apply-sl.html',
  'apply-sl.html': 'apply.html',
  'insights.html': 'insights-sl.html',
  'insights-sl.html': 'insights.html',
  'article.html': 'article-sl.html',
  'article-sl.html': 'article.html',
  'cookies.html': 'cookies-sl.html',
  'cookies-sl.html': 'cookies.html',
  'privacy.html': 'privacy-sl.html',
  'privacy-sl.html': 'privacy.html',
  'terms.html': 'terms-sl.html',
  'terms-sl.html': 'terms.html'
};

export function initLanguageSwitcher() {
  const langSwitch = document.querySelector('.lang-switch');
  if (!langSwitch) return;

  // Get current page filename
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';

  // Find corresponding page in other language
  const targetPage = pageMap[currentPage];

  if (targetPage) {
    // Preserve query parameters (for job details, etc.)
    const searchParams = window.location.search;
    langSwitch.href = targetPage + searchParams;
  }
}
