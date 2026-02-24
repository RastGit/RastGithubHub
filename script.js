document.addEventListener('DOMContentLoaded', () => {
  // Nawigacja + animacje
  const sections = document.querySelectorAll('.section');
  const links = document.querySelectorAll('.navbar a');
  const indicator = document.querySelector('.nav-indicator');

  function moveIndicator(target) {
    if (!target || !indicator) return;
    const rect = target.getBoundingClientRect();
    const navRect = target.closest('.navbar').getBoundingClientRect();
    indicator.style.width = `${rect.width + 20}px`;
    indicator.style.left  = `${rect.left - navRect.left - 10}px`;
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
      if (scrollY >= section.offsetTop - 200) current = section.getAttribute('id');
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
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.2 });

  sections.forEach(sec => observer.observe(sec));

  const initial = document.querySelector('.navbar a.active') || links[0];
  if (initial) {
    initial.classList.add('active');
    moveIndicator(initial);
  }

  window.addEventListener('resize', () => moveIndicator(document.querySelector('.navbar a.active')));

  // TextBypass (prosty)
  const tbInput = document.getElementById('inputText');
  const tbOutput = document.getElementById('outputText');
  const tbBtn = document.getElementById('bypassBtn');
  const tbCopy = document.getElementById('copyBtn');

  if (tbBtn) {
    tbBtn.addEventListener('click', () => {
      let text = tbInput.value.trim();
      if (!text) {
        tbOutput.value = "Wpisz tekst...";
        return;
      }
      text = text.replace(/a/gi, '4').replace(/e/gi, '3').replace(/i/gi, '1').replace(/o/gi, '0').replace(/s/gi, '5');
      tbOutput.value = text;
    });
  }

  if (tbCopy) {
    tbCopy.addEventListener('click', () => {
      if (!tbOutput.value.trim()) return;
      navigator.clipboard.writeText(tbOutput.value).then(() => alert("Skopiowano"));
    });
  }

  // Discord – wysyłanie przez webhook
  const WEBHOOK = "https://discord.com/api/webhooks/1475841712600649801/0_cGBvytVMLDouODG1JysXFtNNF8zEyrsGPFaxujB5hY2xX9LgVUeiFAASfVI7Lr-4ls";

  const avatarPrev = document.getElementById('avatarPreview');
  const avatarIn = document.getElementById('avatarInput');
  const nickIn = document.getElementById('usernameInput');
  const msgIn = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendMessageBtn');
  const chat = document.getElementById('chatMessages');
  const copyInvite = document.querySelector('.copy-invite-btn');

  const DEFAULT_AVATAR = "https://cdn.discordapp.com/attachments/1475479234519760927/1475846320597106739/lv_0_20260224142607.jpg?ex=699ef87e&is=699da6fe&hm=fcd8285a1b8ee154a63334579d360fc6e4d655746bb12f436b67d414ca63e6dd&";

  // Zmiana awatara
  document.getElementById('avatarUpload').onclick = () => avatarIn.click();

  avatarIn.onchange = e => {
    const f = e.target.files[0];
    if (f) {
      const r = new FileReader();
      r.onload = ev => avatarPrev.src = ev.target.result;
      r.readAsDataURL(f);
    }
  };

  // Kopiuj invite
  copyInvite.onclick = () => {
    navigator.clipboard.writeText("https://discord.gg/YgRqZWt6eu")
      .then(() => alert("Link skopiowany!"))
      .catch(() => alert("Błąd – zaznacz ręcznie"));
  };

  let hereCooldown = 0;

  async function sendDiscordMessage() {
    let msg = msgIn.value.trim();
    if (!msg) return;

    if (msg.toLowerCase().includes('@everyone')) {
      alert("@everyone jest zablokowane!");
      return;
    }

    if (msg.toLowerCase().includes('@here')) {
      if (Date.now() < hereCooldown) {
        const left = Math.ceil((hereCooldown - Date.now()) / 60000);
        alert(`@here możesz użyć za ${left} min`);
        return;
      }
      hereCooldown = Date.now() + 120000;
    }

    const nick = (nickIn.value.trim() || "Anonim") + " (Project-Hacker)";
    const ava = avatarPrev.src || DEFAULT_AVATAR;

    try {
      const res = await fetch(WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: msg,
          username: nick,
          avatar_url: ava
        })
      });

      if (res.ok) {
        msgIn.value = "";
        addLocalMessage(nick, msg, ava);
      } else {
        alert("Błąd wysyłania (sprawdź konsolę)");
        console.log(await res.text());
      }
    } catch (err) {
      alert("Brak połączenia");
      console.error(err);
    }
  }

  function addLocalMessage(nick, text, ava) {
    const m = document.createElement("div");
    m.className = "message";
    m.innerHTML = `
      <img class="message-avatar" src="${ava}" alt="">
      <div class="message-content">
        <div class="message-header">
          <span class="message-nick">${nick}</span>
        </div>
        <div class="message-text">${text.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>
      </div>
    `;
    chat.appendChild(m);
    chat.scrollTop = chat.scrollHeight;
  }

  sendBtn.onclick = sendDiscordMessage;
  msgIn.onkeypress = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendDiscordMessage();
    }
  };
});
