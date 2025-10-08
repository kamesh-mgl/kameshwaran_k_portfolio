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

    // --- Form Submission Handler (with Debugging) ---

    // Find the form and status elements in the HTML
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    // This is a check to see if the script found your form on the page
    if (contactForm) {
        console.log("Form found successfully."); // You should see this in the console

        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();
            console.log("Form submission intercepted."); // You should see this when you click 'Send'

            const data = new FormData(event.target);

            fetch("https://formsubmit.co/ajax/kameshmgl@gmail.com", {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                // Check if the server responded successfully (status code 200-299)
                if (response.ok) {
                    console.log("Server responded OK.");
                    return response.json(); // Continue to the next .then()
                } else {
                    // If the server responded with an error (like 400, 404, 500)
                    console.error("Server responded with an error:", response.status);
                    // Try to get more details from the response body
                    return response.json().then(errorData => {
                        // We throw an error to jump to the .catch() block
                        throw new Error(errorData.message || "Something went wrong on the server.");
                    });
                }
            }).then(data => {
                // This block runs only if the submission was successful
                console.log("Submission successful! Data:", data);
                contactForm.reset();
                formStatus.innerHTML = "Thanks! Your message has been sent.";
                formStatus.style.color = "green";
            }).catch(error => {
                // This block runs if ANYTHING went wrong in the fetch chain
                console.error("An error occurred:", error);
                formStatus.innerHTML = `Oops! There was a problem: ${error.message}`;
                formStatus.style.color = "red";
            });
        });
    } else {
        // If the script can't find your form at all
        console.error("Error: Could not find element with id='contactForm'.");
    }


});
