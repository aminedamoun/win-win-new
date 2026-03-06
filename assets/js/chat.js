export function initChat() {
  const chatFab = document.getElementById('chatFab');
  const chatWidget = document.getElementById('chatWidget');
  const chatClose = document.getElementById('chatClose');
  const chatExpand = document.getElementById('chatExpand');
  const chatSend = document.getElementById('chatSend');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.querySelector('.chat-body');

  if (!chatFab || !chatWidget || !chatClose) return;

  let welcomeShown = false;

  chatFab.addEventListener('click', () => {
    chatWidget.classList.add('active');
    if (!welcomeShown) {
      welcomeShown = true;
      const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const welcomeHtml = `
        <div class="chat-message">
          <div class="chat-bubble">Pozdravljeni! Tu sem, da vam pomagam z informacijami o Win Win kariernih priložnostih in razporejanju sestankov. Kako vam lahko pomagam?</div>
          <div class="chat-message-time">${time}</div>
        </div>
      `;
      chatBody.insertAdjacentHTML('beforeend', welcomeHtml);
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  });

  chatClose.addEventListener('click', () => {
    chatWidget.classList.remove('active');
  });

  if (chatExpand) {
    chatExpand.addEventListener('click', () => {
      if (chatWidget.style.height === '90vh') {
        chatWidget.style.height = '600px';
        chatWidget.style.maxHeight = 'calc(100vh - 200px)';
      } else {
        chatWidget.style.height = '90vh';
        chatWidget.style.maxHeight = '90vh';
      }
    });
  }

  if (chatSend && chatInput) {
    const sendMessage = () => {
      const message = chatInput.value.trim();
      if (!message) return;

      const time = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });

      const messageHtml = `
        <div class="chat-message">
          <div class="chat-bubble user">${message}</div>
          <div class="chat-message-time" style="text-align: right;">${time}</div>
        </div>
      `;

      chatBody.insertAdjacentHTML('beforeend', messageHtml);
      chatInput.value = '';
      chatBody.scrollTop = chatBody.scrollHeight;

      setTimeout(() => {
        const responseHtml = `
          <div class="chat-message">
            <div class="chat-bubble">Thank you for your message! Our team will get back to you shortly. You can also reach us at office@win-win.si or call +386 31 678 732.</div>
            <div class="chat-message-time">${time}</div>
          </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', responseHtml);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, 1000);
    };

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (!chatWidget.contains(e.target) && !chatFab.contains(e.target)) {
      chatWidget.classList.remove('active');
    }
  });
}
