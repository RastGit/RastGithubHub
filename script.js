document.addEventListener('DOMContentLoaded', () => {
  // ───────────────────────────────────────────────
  //          Nawigacja + animacje sekcji
  // ───────────────────────────────────────────────

  const sections = document.querySelectorAll('.section');
  const links = document.querySelectorAll('.navbar a');
  const indicator = document.querySelector('.nav-indicator');

  function moveIndicator(target) {
    if (!target || !indicator) return;
    const rect = target.getBoundingClientRect();
    const navRect = target.closest('.navbar').getBoundingClientRect();
    indicator.style.width = `${rect.width + 16}px`;
    indicator.style.left  = `${rect.left - navRect.left - 8}px`;
  }

  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      moveIndicator(link);
    });
  });

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop - 180) {
        current = section.getAttribute('id');
      }
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
        moveIndicator(link);
      }
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.18 });

  sections.forEach(sec => observer.observe(sec));

  const initialActive = document.querySelector('.navbar a.active') || links[0];
  if (initialActive) {
    initialActive.classList.add('active');
    moveIndicator(initialActive);
  }

  window.addEventListener('resize', () => {
    moveIndicator(document.querySelector('.navbar a.active'));
  });

  // ───────────────────────────────────────────────
  //          TEXTBYPASS – logika (wywołuje AI bypass)
  // ───────────────────────────────────────────────

  const input = document.getElementById('inputText');
  const output = document.getElementById('outputText');
  const bypassBtn = document.getElementById('bypassBtn');
  const copyBtn = document.getElementById('copyBtn');

  bypassBtn.addEventListener('click', async () => {
    const options = {
      numbers: document.getElementById('useNumbers').checked,
      font: document.getElementById('useFont').checked,
      similar: document.getElementById('useSimilar').checked,
      advanced: document.getElementById('useAdvanced').checked
    };
    output.value = await advancedBypass(input.value, options);  // Wywołuje funkcję z ai_bypass.js
  });

  copyBtn.addEventListener('click', () => {
    if (!output.value.trim()) return alert("Nic do skopiowania!");
    navigator.clipboard.writeText(output.value)
      .then(() => alert("Skopiowano!"))
      .catch(() => {
        output.select();
        alert("Nie udało się – zaznacz i Ctrl+C ręcznie.");
      });
  });
});
// ───────────────────────────────────────────────
//          DISCORD CHAT – symulacja
// ───────────────────────────────────────────────

const avatarPreview = document.getElementById('avatarPreview');
const avatarInput = document.getElementById('avatarInput');
const usernameInput = document.getElementById('usernameInput');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendMessageBtn');
const chatMessages = document.getElementById('chatMessages');
const copyInviteBtn = document.querySelector('.copy-invite-btn');

// Domyślny awatar
const defaultAvatar = "https://cdn.discordapp.com/attachments/1475479234519760927/1475846320597106739/lv_0_20260224142607.jpg?ex=699ef87e&is=699da6fe&hm=fcd8285a1b8ee154a63334579d360fc6e4d655746bb12f436b67d414ca63e6dd&";

// Zmiana awatara
document.getElementById('avatarUpload').addEventListener('click', () => {
  avatarInput.click();
});

avatarInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      avatarPreview.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Kopiuj invite
copyInviteBtn.addEventListener('click', () => {
  navigator.clipboard.writeText("https://discord.gg/YgRqZWt6eu")
    .then(() => alert("Link skopiowany!"))
    .catch(() => alert("Nie udało się skopiować – zaznacz ręcznie"));
});

// Wysyłanie wiadomości
let hereCooldown = false;

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  // Blokada @everyone
  if (text.toLowerCase().includes('@everyone')) {
    alert("Użycie @everyone jest zabronione!");
    return;
  }

  // Cooldown na @here – 2 minuty
  if (text.toLowerCase().includes('@here')) {
    if (hereCooldown) {
      alert("Możesz użyć @here raz na 2 minuty!");
      return;
    }
    hereCooldown = true;
    setTimeout(() => { hereCooldown = false; }, 120000);
  }

  const username = usernameInput.value.trim() || "Anonim";
  const avatarSrc = avatarPreview.src || defaultAvatar;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'message';

  msgDiv.innerHTML = `
    <img class="message-avatar" src="${avatarSrc}" alt="Awatar">
    <div class="message-content">
      <div class="message-header">
        <span class="message-nick">${username}</span>
        <span class="message-tag">(Project-Hacker)</span>
      </div>
      <div class="message-text">${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
    </div>
  `;

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  messageInput.value = '';
}

// Symulacja kilku przykładowych wiadomości przy starcie (opcjonalne)
function addFakeMessage(nick, text, avatar = defaultAvatar) {
  const msg = document.createElement('div');
  msg.className = 'message';
  msg.innerHTML = `
    <img class="message-avatar" src="${avatar}" alt="Awatar">
    <div class="message-content">
      <div class="message-header">
        <span class="message-nick">${nick}</span>
        <span class="message-tag">(Project-Hacker)</span>
      </div>
      <div class="message-text">${text}</div>
    </div>
  `;
  chatMessages.appendChild(msg);
}

addFakeMessage("Diddy", "Witajcie w czacie Project-Hacker! 🚀");
addFakeMessage("Sigma", "Ktoś ma świeże exploity na discord?");
