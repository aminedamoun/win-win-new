export function initChat() {
  const chatFab = document.getElementById('chatFab');
  const chatWidget = document.getElementById('chatWidget');
  const chatClose = document.getElementById('chatClose');

  if (chatFab && chatWidget && chatClose) {
    chatFab.addEventListener('click', () => {
      chatWidget.classList.add('active');
    });

    chatClose.addEventListener('click', () => {
      chatWidget.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
      if (!chatWidget.contains(e.target) && !chatFab.contains(e.target)) {
        chatWidget.classList.remove('active');
      }
    });
  }
}

export function createChatWidget(lang = 'en') {
  const translations = {
    en: {
      title: 'Contact Us',
      message: 'Hello! How can we help you today? Feel free to reach out to us through any of the following channels:',
      location: 'Trzin, Kranj, Slovenia',
      sendEmail: 'Send Email',
      ariaLabel: 'Chat with us',
      ariaClose: 'Close chat'
    },
    sl: {
      title: 'Stopite v stik',
      message: 'Pozdravljeni! Kako vam lahko pomagamo? Obrnite se na nas prek katerega koli od naslednjih kanalov:',
      location: 'Trzin, Kranj, Slovenija',
      sendEmail: 'Pošlji e-pošto',
      ariaLabel: 'Klepetajte z nami',
      ariaClose: 'Zapri klepet'
    }
  };

  const t = translations[lang] || translations.en;

  return `
    <div class="chat-widget" id="chatWidget">
      <div class="chat-header">
        <div class="chat-header-title">${t.title}</div>
        <button class="chat-close" type="button" aria-label="${t.ariaClose}" id="chatClose">×</button>
      </div>
      <div class="chat-body">
        <div class="chat-message">
          <div class="chat-bubble">
            ${t.message}
          </div>
        </div>
      </div>
      <div class="chat-footer">
        <div class="chat-info">
          <div class="chat-info-item">
            <span class="chat-info-icon">📍</span>
            <span>${t.location}</span>
          </div>
          <div class="chat-info-item">
            <span class="chat-info-icon">📞</span>
            <a href="tel:+38631678732" style="color: inherit; text-decoration: none;">+386 31 678 732</a>
          </div>
          <div class="chat-info-item">
            <span class="chat-info-icon">✉️</span>
            <a href="mailto:office@win-win.si" style="color: inherit; text-decoration: none;">office@win-win.si</a>
          </div>
        </div>
        <button class="chat-contact-btn" type="button" onclick="window.location.href='mailto:office@win-win.si'">
          ${t.sendEmail}
        </button>
      </div>
    </div>
  `;
}
