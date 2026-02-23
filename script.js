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
  //          TEXTBYPASS – działająca logika
  // ───────────────────────────────────────────────

  const input = document.getElementById('inputText');
  const output = document.getElementById('outputText');
  const bypassBtn = document.getElementById('bypassBtn');
  const copyBtn = document.getElementById('copyBtn');

  const leetMap = {
    'a': '4', 'A': '4',
    'e': '3', 'E': '3',
    'i': '1', 'I': '1',
    'o': '0', 'O': '0',
    's': '5', 'S': '5',
    't': '7', 'T': '7',
    'b': '8', 'B': '8',
    'g': '9', 'G': '9'
  };

  const fontMap = {
    'a': '𝕒', 'b': '𝕓', 'c': '𝕔', 'd': '𝕕', 'e': '𝕖',
    'f': '𝕗', 'g': '𝕘', 'h': '𝕙', 'i': '𝕚', 'j': '𝕛',
    'k': '𝕜', 'l': '𝕝', 'm': '𝕞', 'n': '𝕟', 'o': '𝕠',
    'p': '𝕡', 'q': '𝕢', 'r': '𝕣', 's': '𝕤', 't': '𝕥',
    'u': '𝕦', 'v': '𝕧', 'w': '𝕨', 'x': '𝕩', 'y': '𝕪', 'z': '𝕫'
  };

  function bypassText(text, options) {
    if (!text.trim()) return "Wpisz jakiś tekst najpierw...";

    let result = text;

    // Leet (numbers)
    if (options.numbers) {
      result = result.split('').map(c => leetMap[c] || c).join('');
    }

    // Font (matematyczne czcionki)
    if (options.font) {
      result = result.split('').map(c => {
        const lower = c.toLowerCase();
        if (fontMap[lower]) {
          return c === c.toUpperCase() ? fontMap[lower].toUpperCase() : fontMap[lower];
        }
        return c;
      }).join('');
    }

    // Similar (podstawowe homoglyphy)
    if (options.similar) {
      result = result
        .replace(/[aA]/g, 'ɑ')
        .replace(/[eE]/g, 'е')
        .replace(/[iI]/g, 'і')
        .replace(/[oO]/g, 'ο')
        .replace(/[sS]/g, 'ѕ');
    }

    return result.trim() || "[nic nie wyszło – zaznacz przynajmniej jedną opcję]";
  }

  if (bypassBtn) {
    bypassBtn.addEventListener('click', () => {
      const options = {
        numbers: document.getElementById('useNumbers')?.checked || false,
        font: document.getElementById('useFont')?.checked || false,
        similar: document.getElementById('useSimilar')?.checked || false
      };
      output.value = bypassText(input.value, options);
    });
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!output.value.trim()) {
        alert("Nie ma nic do skopiowania!");
        return;
      }
      navigator.clipboard.writeText(output.value)
        .then(() => alert("Skopiowano!"))
        .catch(() => {
          output.select();
          alert("Nie udało się automatycznie – zaznacz i Ctrl+C");
        });
    });
  }
});
