// NEUROGLOVE - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initSmoothScrolling();
    initAnimations();
    
    // Prevent form submission (for demo purposes)
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('This form submission is disabled in the demo. In a real implementation, this would send your message to the NEUROGLOVE team.');
            form.reset();
        });
    });
    
    // Initialize tooltips
    if (typeof bootstrap !== 'undefined') {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});

/**
 * Initializes navbar behavior
 */
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    // Add scrolled class to navbar when scrolling
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close mobile menu when link is clicked
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    });
}

/**
 * Initializes smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate header height for offset
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initializes animation elements when they enter the viewport
 */
function initAnimations() {
    // Add IntersectionObserver to trigger animations when elements enter viewport
    const animatedElements = document.querySelectorAll('.feature-card, .user-card, .demo-card');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        animatedElements.forEach(element => {
            element.classList.add('animate__animated', 'animate__fadeInUp');
        });
    }
}

/**
 * Utility function to generate random number within a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random number between min and max
 */
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Simulates an API call with a delay
 * @param {Function} callback - Function to execute after delay
 * @param {number} delay - Delay in milliseconds
 */
function simulateApiCall(callback, delay = 1000) {
    setTimeout(() => {
        callback();
    }, delay);
}
