// script.js
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.section');
    const links = document.querySelectorAll('.navbar a');
    const indicator = document.querySelector('.nav-indicator');

    // Intersection Observer – pokazywanie sekcji
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(sec => observer.observe(sec));

    // Płynne przewijanie + aktualizacja active i wskaźnika
    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });

            // usuń stare active
            links.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            moveIndicator(link);
        });
    });

    // Ruch wskaźnika przy scrollu
    const moveIndicator = (targetLink) => {
        const rect = targetLink.getBoundingClientRect();
        const navRect = targetLink.closest('.navbar').getBoundingClientRect();

        indicator.style.width = `${rect.width + 12}px`;
        indicator.style.left = `${rect.left - navRect.left - 6}px`;
    };

    // Inicjalne ustawienie wskaźnika
    const activeLink = document.querySelector('.navbar a.active') || links[0];
    activeLink.classList.add('active');
    moveIndicator(activeLink);

    // Aktualizacja przy scrollu (scrollspy)
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 150) {
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

    // Na resize też aktualizujemy wskaźnik
    window.addEventListener('resize', () => {
        moveIndicator(document.querySelector('.navbar a.active'));
    });
});
