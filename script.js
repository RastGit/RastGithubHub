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
