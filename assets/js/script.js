// ===== GLOBAL VARIABLES =====
let currentTheme = localStorage.getItem("theme") || "light";

// ===== DOM ELEMENTS =====
const loadingScreen = document.getElementById("loading-screen");
const themeToggle = document.getElementById("theme-toggle");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const contactForm = document.getElementById("contact-form");
const header = document.getElementById("header");

// ===== LOADING SCREEN =====
window.addEventListener("load", () => {
    setTimeout(() => {
        loadingScreen.classList.add("hidden");
        // Initialize AOS after loading
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100,
            easing: "ease-out-cubic"
        });
    }, 1500);
});

// ===== THEME TOGGLE =====
function initTheme() {
    document.documentElement.setAttribute("data-theme", currentTheme);
    updateThemeIcon();
}

function toggleTheme() {
    currentTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    localStorage.setItem("theme", currentTheme);
    updateThemeIcon();
    
    // Add smooth transition effect
    document.body.style.transition = "all 0.3s ease";
    setTimeout(() => {
        document.body.style.transition = "";
    }, 300);
}

function updateThemeIcon() {
    const icon = themeToggle.querySelector("i");
    if (currentTheme === "dark") {
        icon.className = "fas fa-sun";
    } else {
        icon.className = "fas fa-moon";
    }
}

// ===== MOBILE NAVIGATION =====
function toggleMobileNav() {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
    
    // Prevent body scroll when menu is open
    if (navMenu.classList.contains("active")) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
}

function closeMobileNav() {
    navMenu.classList.remove("active");
    navToggle.classList.remove("active");
    document.body.style.overflow = "";
}

// ===== SMOOTH SCROLLING =====
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        const headerHeight = header.offsetHeight;
        const elementPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: "smooth"
        });
    }
}

// ===== ACTIVE NAVIGATION LINK =====
function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPosition = window.scrollY + header.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove("active"));
            if (navLink) {
                navLink.classList.add("active");
            }
        }
    });
}

// ===== HEADER SCROLL EFFECT =====
function handleHeaderScroll() {
    if (window.scrollY > 100) {
        header.style.background = currentTheme === "dark" 
            ? "rgba(26, 32, 44, 0.98)" 
            : "rgba(255, 255, 255, 0.98)";
        header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)";
    } else {
        header.style.background = currentTheme === "dark" 
            ? "rgba(26, 32, 44, 0.95)" 
            : "rgba(255, 255, 255, 0.95)";
        header.style.boxShadow = "none";
    }
}

// ===== FORM VALIDATION AND WHATSAPP SUBMISSION =====
function validateForm(formData) {
    const errors = [];
    
    // Name validation
    if (!formData.get("name") || formData.get("name").trim().length < 2) {
        errors.push("Nome deve ter pelo menos 2 caracteres");
    }
    
    // Email validation
    const email = formData.get("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push("E-mail inválido");
    }
    
    // Phone validation
    const phone = formData.get("phone");
    const phoneRegex = /^[\(\)\s\-\+\d]{10,}$/;
    if (!phone || !phoneRegex.test(phone.replace(/\s/g, ""))) {
        errors.push("Telefone inválido");
    }
    
    // Subject validation
    if (!formData.get("subject")) {
        errors.push("Selecione um assunto");
    }
    
    // Message validation
    if (!formData.get("message") || formData.get("message").trim().length < 10) {
        errors.push("Mensagem deve ter pelo menos 10 caracteres");
    }
    
    return errors;
}

function showFormMessage(message, type = "success") {
    // Remove existing messages
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        font-weight: 500;
        ${type === "success" 
            ? "background: #d4edda; color: #155724; border: 1px solid #c3e6cb;" 
            : "background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;"
        }
    `;
    messageDiv.textContent = message;
    
    // Insert message at the top of the form
    contactForm.insertBefore(messageDiv, contactForm.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const errors = validateForm(formData);
    
    if (errors.length > 0) {
        showFormMessage(errors.join(", "), "error");
        return;
    }
    
    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const subject = formData.get("subject");
    const message = formData.get("message");

    const whatsappNumber = "5511953000465"; // Número do WhatsApp do advogado
    const whatsappMessage = `Olá, Dr. Donizeti!%0A%0AGostaria de entrar em contato sobre o seguinte:%0A%0ANome: ${name}%0AEmail: ${email}%0ATelefone: ${phone}%0AAssunto: ${subject}%0AMensagem: ${message}%0A%0AAguardando seu retorno.`;

    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    window.open(whatsappLink, "_blank");

    showFormMessage("Sua mensagem foi enviada para o WhatsApp do advogado!", "success");
    contactForm.reset();
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, observerOptions);
    
    // Observe elements for fade-in animation
    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach(el => observer.observe(el));
}

// ===== TYPING ANIMATION =====
function initTypingAnimation() {
    const titleElement = document.querySelector(".hero-title .title-line.highlight");
    if (!titleElement) return;
    
    const text = titleElement.textContent;
    titleElement.textContent = "";
    titleElement.style.borderRight = "2px solid var(--accent-color)";
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            setTimeout(() => {
                titleElement.style.borderRight = "none";
            }, 1000);
        }
    };
    
    // Start typing animation after page load
    setTimeout(typeWriter, 2000);
}

// ===== PARALLAX EFFECT =====
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll(".hero::before");
    
    window.addEventListener("scroll", () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll(".badge-number");
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + "+";
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target + "+";
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// ===== PHONE NUMBER FORMATTING =====
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, "");
    
    if (value.length >= 11) {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length >= 7) {
        value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    }
    
    input.value = value;
}

// ===== SMOOTH REVEAL ANIMATIONS =====
function initRevealAnimations() {
    const revealElements = document.querySelectorAll(".service-card, .testimonial-card, .hero-card");
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "all 0.6s ease";
        revealObserver.observe(el);
    });
}

// ===== BACK TO TOP BUTTON =====
function initBackToTop() {
    const backToTopBtn = document.createElement("button");
    backToTopBtn.innerHTML = "<i class=\"fas fa-arrow-up\"></i>";
    backToTopBtn.className = "back-to-top";
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 120px;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: var(--shadow-medium);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            backToTopBtn.style.opacity = "1";
            backToTopBtn.style.visibility = "visible";
        } else {
            backToTopBtn.style.opacity = "0";
            backToTopBtn.style.visibility = "hidden";
        }
    });
    
    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

// ===== EVENT LISTENERS =====
document.addEventListener("DOMContentLoaded", () => {
    // Initialize theme
    initTheme();
    
    // Theme toggle
    themeToggle?.addEventListener("click", toggleTheme);
    
    // Mobile navigation
    navToggle?.addEventListener("click", toggleMobileNav);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = link.getAttribute("href");
            smoothScrollTo(target);
            closeMobileNav();
        });
    });
    
    // Form submission
    contactForm?.addEventListener("submit", handleFormSubmit);
    
    // Phone number formatting
    const phoneInput = document.getElementById("phone");
    phoneInput?.addEventListener("input", (e) => formatPhoneNumber(e.target));
    
    // Scroll events
    window.addEventListener("scroll", () => {
        updateActiveNavLink();
        handleHeaderScroll();
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            closeMobileNav();
        }
    });
    
    // Initialize animations
    initScrollAnimations();
    initTypingAnimation();
    initParallaxEffect();
    animateCounters();
    initRevealAnimations();
    initBackToTop();
    
    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeMobileNav();
        }
    });
});

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Apply throttling to scroll events
window.addEventListener("scroll", throttle(() => {
    updateActiveNavLink();
    handleHeaderScroll();
}, 16)); // ~60fps

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Focus management for mobile menu
navToggle?.addEventListener("click", () => {
    if (navMenu.classList.contains("active")) {
        navMenu.querySelector(".nav-link")?.focus();
    }
});

// Skip to main content
const skipLink = document.createElement("a");
skipLink.href = "#main";
skipLink.textContent = "Pular para o conteúdo principal";
skipLink.className = "skip-link";
skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 6px;
    background: var(--primary-color);
    color: white;
    padding: 8px;
    text-decoration: none;
    border-radius: 4px;
    z-index: 10001;
    transition: top 0.3s ease;
`;

skipLink.addEventListener("focus", () => {
    skipLink.style.top = "6px";
});

skipLink.addEventListener("blur", () => {
    skipLink.style.top = "-40px";
});

document.body.insertBefore(skipLink, document.body.firstChild);

// ===== ERROR HANDLING =====
window.addEventListener("error", (e) => {
    console.error("JavaScript Error:", e.error);
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
🏛️ Site do Advogado Donizeti Beserra Costa
📧 donizetibcosta@uol.com.br
📱 (11) 95300-0465
📞 (11) 2257-1616

Desenvolvido com ❤️ usando HTML5, CSS3 e JavaScript
`);

// ===== SERVICE WORKER REGISTRATION (Optional) =====
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register("/sw.js")
        //     .then(registration => console.log("SW registered"))
        //     .catch(error => console.log("SW registration failed"));
    });
}



