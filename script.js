// Enhanced JavaScript for Bergenline Group website
(function() {
  'use strict';

  // DOM elements
  const navToggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const closeBtn = document.querySelector('[data-nav-close]');
  const announcement = document.getElementById('announcement');
  const yearEl = document.getElementById('year');
  const backToTopBtn = document.querySelector('.back-to-top');
  const contactForm = document.querySelector('.contact-form');
  const body = document.body;

  // State management
  let isNavOpen = false;
  let isScrolling = false;

  // Utility functions
  const announce = (message) => {
    if (announcement) {
      announcement.textContent = message;
      setTimeout(() => {
        announcement.textContent = '';
      }, 3000);
    }
  };

  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // Navigation management
  const setNavState = (isOpen) => {
    if (!nav) return;
    
    isNavOpen = isOpen;
    nav.setAttribute('aria-hidden', String(!isOpen));
    body.classList.toggle('nav-open', isOpen);
    
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }

    // Announce state change for screen readers
    announce(isOpen ? 'Navigation menu opened' : 'Navigation menu closed');

    // Prevent body scroll when menu is open
    if (isOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = '';
    }
  };

  const closeNav = () => setNavState(false);
  const openNav = () => setNavState(true);

  // Navigation event listeners
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      if (isNavOpen) {
        closeNav();
      } else {
        openNav();
      }
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeNav);
  }

  // Close nav when clicking on nav links
  if (nav) {
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeNav);
    });
  }

  // Close nav when clicking outside
  document.addEventListener('click', (e) => {
    if (isNavOpen && !nav.contains(e.target) && !navToggle.contains(e.target)) {
      closeNav();
    }
  });

  // Close nav on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isNavOpen) {
      closeNav();
      navToggle.focus();
    }
  });

  // Initialize hidden state for mobile nav
  if (nav && !nav.hasAttribute('aria-hidden')) {
    nav.setAttribute('aria-hidden', 'true');
  }

  // Back to top functionality
  const handleScroll = throttle(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (backToTopBtn) {
      if (scrollTop > 300) {
        backToTopBtn.style.display = 'flex';
        backToTopBtn.setAttribute('aria-hidden', 'false');
      } else {
        backToTopBtn.style.display = 'none';
        backToTopBtn.setAttribute('aria-hidden', 'true');
      }
    }

    // Add scroll class to header for styling
    const header = document.querySelector('.site-header');
    if (header) {
      header.classList.toggle('scrolled', scrollTop > 50);
    }
  }, 16);

  window.addEventListener('scroll', handleScroll, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      announce('Scrolled to top of page');
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus();
        target.addEventListener('blur', () => {
          target.removeAttribute('tabindex');
        }, { once: true });
      }
    });
  });

  // Form validation and submission
  if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn?.querySelector('.btn-text');
    const btnLoading = submitBtn?.querySelector('.btn-loading');

    // Real-time validation
    inputs.forEach(input => {
      const validateField = () => {
        const isValid = input.checkValidity();
        const errorId = input.getAttribute('aria-describedby');
        const errorEl = errorId ? document.getElementById(errorId) : null;
        
        if (errorEl) {
          if (!isValid && input.value.trim() !== '') {
            errorEl.textContent = input.validationMessage;
            input.setAttribute('aria-invalid', 'true');
          } else {
            errorEl.textContent = '';
            input.setAttribute('aria-invalid', 'false');
          }
        }
      };

      input.addEventListener('blur', validateField);
      input.addEventListener('input', debounce(validateField, 300));
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      // Show loading state
      if (submitBtn && btnText && btnLoading) {
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline';
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          contactForm.reset();
          announce('Message sent successfully! We\'ll be in touch soon.');
          
          // Clear any error messages
          contactForm.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
          });
          
          // Clear aria-invalid attributes
          inputs.forEach(input => {
            input.setAttribute('aria-invalid', 'false');
          });
        } else {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.error('Form submission error:', error);
        announce('Sorry, there was an error sending your message. Please try again or email us directly.');
      } finally {
        // Reset button state
        if (submitBtn && btnText && btnLoading) {
          submitBtn.disabled = false;
          btnText.style.display = 'inline';
          btnLoading.style.display = 'none';
        }
      }
    });
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document.querySelectorAll('.card, .project-card, .timeline li').forEach(el => {
    observer.observe(el);
  });

  // Set current year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }

  // Keyboard navigation improvements
  document.addEventListener('keydown', (e) => {
    // Skip to main content with Alt + M
    if (e.altKey && e.key === 'm') {
      e.preventDefault();
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData && perfData.loadEventEnd - perfData.loadEventStart > 3000) {
          console.warn('Page load time is slower than expected');
        }
      }, 0);
    });
  }

  // Error handling
  window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
  });

  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });

  // Initialize everything
  const init = () => {
    // Add loaded class to body for CSS animations
    body.classList.add('loaded');
    
    // Announce page load for screen readers
    announce('Page loaded successfully');
  };

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();