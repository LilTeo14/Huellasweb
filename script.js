document.addEventListener('DOMContentLoaded', () => {
    // 0. Servicios: expandir/colapsar detalle "Leer más"
    document.querySelectorAll('.sn-more').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.sn-item');
            const isOpen = item.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', isOpen);
            btn.innerHTML = isOpen
                ? 'Ver menos <i class="ph ph-caret-right"></i>'
                : 'Leer más <i class="ph ph-caret-right"></i>';
        });
    });

    // 0.5 Formulario de contacto -> abre el cliente de correo con los datos
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('cf-name').value.trim();
            const email = document.getElementById('cf-email').value.trim();
            const message = document.getElementById('cf-message').value.trim();
            const note = document.getElementById('cf-note');

            if (!name || !email) {
                note.textContent = 'Por favor completa tu nombre y correo antes de enviar.';
                note.classList.add('is-error');
                return;
            }

            const subject = encodeURIComponent(`Contacto web de ${name}`);
            const body = encodeURIComponent(`Nombre: ${name}\nCorreo: ${email}\n\nMensaje:\n${message}`);
            window.location.href = `mailto:contacto@huellas-sostenibles.cl?subject=${subject}&body=${body}`;

            note.classList.remove('is-error');
            note.textContent = 'Se abrió tu cliente de correo con el mensaje listo para enviar.';
        });
    }

    // 1. Sticky Navbar Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const icon = mobileBtn.querySelector('i');

    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('ph-list');
            icon.classList.add('ph-x');
        } else {
            icon.classList.add('ph-list');
            icon.classList.remove('ph-x');
        }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            icon.classList.add('ph-list');
            icon.classList.remove('ph-x');
        });
    });

    // 3. Scroll Reveal Animation using Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    // Config for Intersection Observer
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // 4. Smooth scrolling for anchor links is handled by CSS (scroll-behavior: smooth),
    // but we can add an offset for the fixed header
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            if (!targetId) return;

            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    // 5. Stat Counter Animation
    const statsSection = document.querySelector('.stats');
    const counters = document.querySelectorAll('.stat-number');
    const counterSpeed = 200;

    const statsObserver = new IntersectionObserver((entries, observer) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText.replace('+', '').replace('%', '');
                    const inc = target / counterSpeed;

                    if (count < target) {
                        const nextValue = Math.ceil(count + inc);
                        counter.innerText = (nextValue > target ? target : nextValue) + (counter.innerText.includes('%') ? '%' : '+');
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target + (counter.innerText.includes('%') ? '%' : '+');
                    }
                };
                updateCount();
            });
            observer.unobserve(statsSection);
        }
    }, { threshold: 0.5 });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }
});
