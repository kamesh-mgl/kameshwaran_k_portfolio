document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-link');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.querySelector('i').classList.toggle('bi-list');
        hamburger.querySelector('i').classList.toggle('bi-x-lg');
    });

    // Close mobile menu when a link is clicked
    navLinkItems.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                hamburger.querySelector('i').classList.remove('bi-x-lg');
                hamburger.querySelector('i').classList.add('bi-list');
            }
        });
    });

    // --- Dynamic Active Link on Scroll (New Functionality) ---
    const sections = document.querySelectorAll('section');
    const navLinkAnchors = document.querySelectorAll('.nav-link');
    const heroSection = document.getElementById('hero');
    const navbarHeight = 80; // This should match the padding-top of your hero section

    function setActiveLink(id) {
        navLinkAnchors.forEach(link => {
            link.classList.remove('active');
        });
        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    // Set initial active link on page load
    const initialHash = window.location.hash.substring(1);
    if (initialHash) {
        setActiveLink(initialHash);
    } else {
        setActiveLink('hero');
    }

    // Add scroll event listener to update the active link
    window.addEventListener('scroll', () => {
        let currentSectionId = '';

        // Handle the case when the user is at the very top of the page
        if (window.scrollY < heroSection.offsetHeight) {
            setActiveLink('hero');
            return;
        }

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Check if the current scroll position is within the section
            if (window.scrollY >= sectionTop - navbarHeight && window.scrollY < sectionTop + sectionHeight - navbarHeight) {
                currentSectionId = section.id;
            }
        });

        if (currentSectionId) {
            setActiveLink(currentSectionId);
        }
    });

    // --- Smooth Scrolling for Navigation Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            // Also update the active class on click for immediate feedback
            const targetId = this.getAttribute('href').substring(1);
            setActiveLink(targetId);
        });
    });

    // --- Section Reveal Animation on Scroll ---
    const sectionsToReveal = document.querySelectorAll('.reveal');

    // Force show the hero section immediately on page load to prevent a flicker.
    const hero = document.getElementById('hero');
    if (hero) {
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
        const heroElements = document.querySelectorAll('#hero .slide-in, #hero .fade-in');
        heroElements.forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
        });
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.2
    });

    sectionsToReveal.forEach(section => {
        if (section.id !== 'hero') {
            observer.observe(section);
        }
    });

    // --- Project Slider Functionality ---
    const projTrack = document.querySelector('.proj-track');
    const prevBtn = document.querySelector('.proj-btn.prev');
    const nextBtn = document.querySelector('.proj-btn.next');

    let currentSlide = 0;
    let projCards = document.querySelectorAll('.proj-card');

    const updateSliderPosition = () => {
        if (projCards.length > 0) {
            const cardWidth = projCards[0].offsetWidth;
            const gap = parseInt(window.getComputedStyle(projTrack).gap);
            const newPosition = -currentSlide * (cardWidth + gap);
            projTrack.style.transform = `translateX(${newPosition}px)`;
        }
    };

    nextBtn.addEventListener('click', () => {
        if (currentSlide < projCards.length - 1) {
            currentSlide++;
        } else {
            currentSlide = 0; // Loop back to the beginning
        }
        updateSliderPosition();
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = projCards.length - 1; // Loop to the end
        }
        updateSliderPosition();
    });

    window.addEventListener('resize', () => {
        projCards = document.querySelectorAll('.proj-card');
        updateSliderPosition();
    });
    
    window.addEventListener('load', updateSliderPosition);

    // --- Form Submission Handling ---
    // With FormSubmit, we no longer need the fetch block.
    // The form submission is handled by the browser directly.
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (event) => {
            // Prevent the default submission to show a status message first
            event.preventDefault();
            formStatus.textContent = 'Sending message...';
            formStatus.style.color = '#fff';

            // Wait a moment before submitting the form to allow the message to display
            setTimeout(() => {
                event.target.submit();
            }, 500);
        });
    }

});
