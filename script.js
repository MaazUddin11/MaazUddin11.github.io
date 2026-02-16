document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    const fixedHeader = document.querySelector('.fixed-header');
    const sectionTitle = document.querySelector('.fixed-header .section-title');
    const heroSection = document.querySelector('#hero');

    let introComplete = false;

    // Determine which section is at the center of the viewport
    function updateActiveSection() {
        const viewportCenter = window.innerHeight * 0.35;
        let currentSection = null;

        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
                currentSection = section;
            }
        });

        if (!currentSection) return;

        // Update nav highlighting
        navItems.forEach(item => item.classList.remove('active'));
        const activeNav = document.querySelector(`.nav-item[href="#${currentSection.id}"]`);
        if (activeNav) {
            activeNav.classList.add('active');
        }

        // Update section title in fixed header
        if (currentSection.id !== 'hero') {
            const h2 = currentSection.querySelector('h2');
            sectionTitle.textContent = h2 ? h2.textContent : '';
        } else {
            sectionTitle.textContent = '';
        }

        // Show/hide fixed header when scrolled past hero (or after intro)
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        if (heroBottom <= 0 || introComplete) {
            fixedHeader.classList.add('visible');
        } else {
            fixedHeader.classList.remove('visible');
        }
    }

    // Hero intro animation
    function runIntro() {
        // Phase 1: Fade out hero content
        heroSection.classList.add('collapsing');

        // Phase 2: After content fades, collapse the hero height + show header
        setTimeout(() => {
            heroSection.classList.add('collapsed');
            fixedHeader.classList.add('visible');
            introComplete = true;

            // Update nav after the 1s height transition finishes
            setTimeout(() => updateActiveSection(), 1050);
        }, 500);
    }

    // If user scrolls before intro fires, cancel the intro and use normal behavior
    let userScrolled = false;
    function onUserScroll() {
        if (!introComplete) {
            userScrolled = true;
        }
        updateActiveSection();
    }

    window.addEventListener('scroll', onUserScroll);
    updateActiveSection();

    // Start intro after a brief pause (only if user hasn't scrolled)
    setTimeout(() => {
        if (!userScrolled) {
            runIntro();
        }
    }, 1500);
});
