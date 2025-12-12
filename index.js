/**
 * Shabad Vignesh Portfolio - Interactive Features
 * Theme management, mobile navigation, smooth scrolling, form handling
 */

// ============================================
// 1. THEME MANAGEMENT (Dark/Light Mode)
// ============================================
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;
  
  // Check for saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Apply initial theme
  root.setAttribute('data-theme', initialTheme);
  updateThemeButton(initialTheme);
  
  // Listen for theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      root.setAttribute('data-theme', newTheme);
      updateThemeButton(newTheme);
    }
  });
}

function toggleTheme() {
  const root = document.documentElement;
  const current = root.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeButton(next);
  
  // Add subtle transition effect
  document.body.style.transition = 'background-color 0.3s ease';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 300);
}

function updateThemeButton(theme) {
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) {
    themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }
}

// ============================================
// 2. MOBILE NAVIGATION
// ============================================
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  
  if (!menuToggle || !nav) return;
  
  // Toggle menu open/close
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
  
  // Close menu when clicking a link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
  
  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ============================================
// 3. SMOOTH SCROLL & ACTIVE LINK DETECTION
// ============================================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
  
  // Detect active section and update nav
  const navLinks = document.querySelectorAll('.nav a');
  const sections = document.querySelectorAll('section[id]');
  
  function updateActiveLink() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Run on load
}

// ============================================
// 4. CONTACT FORM HANDLING
// ============================================
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name') || 'Visitor';
    const email = formData.get('email') || 'no-email-provided';
    const message = formData.get('message') || '';
    
    // Validate inputs
    if (!name.trim() || !email.trim() || !message.trim()) {
      showNotification('Please fill in all fields', 'error');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showNotification('Please enter a valid email', 'error');
      return;
    }
    
    // Create mailto link with encoded data
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    
    try {
      // Show feedback before redirecting
      showNotification('Opening your email client...', 'success');
      
      // Redirect to mailto after a short delay
      setTimeout(() => {
        window.location.href = `mailto:shabadvignesh2004@gmail.com?subject=${subject}&body=${body}`;
      }, 500);
      
      // Reset form
      setTimeout(() => {
        contactForm.reset();
      }, 1000);
    } catch (error) {
      console.error('Form submission error:', error);
      showNotification('Something went wrong. Please try again.', 'error');
    }
  });
}

// ============================================
// 5. NOTIFICATION SYSTEM
// ============================================
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
      <button class="notification-close" aria-label="Close notification">✕</button>
    </div>
  `;
  
  // Add styles if not already present
  if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.innerHTML = `
      .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 300px;
        padding: 1rem;
        border-radius: var(--radius-lg, 12px);
        background: var(--panel, #0b111c);
        border: 1px solid var(--stroke, #1a2235);
        box-shadow: 0 12px 40px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        backdrop-filter: blur(10px);
      }
      
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
      
      .notification.removing {
        animation: slideOut 0.3s ease forwards;
      }
      
      .notification-success {
        background: linear-gradient(135deg, rgba(61,212,184,0.1), rgba(61,212,184,0.05));
        border-color: rgba(61,212,184,0.3);
        color: #3dd4b8;
      }
      
      .notification-error {
        background: linear-gradient(135deg, rgba(255,107,107,0.1), rgba(255,107,107,0.05));
        border-color: rgba(255,107,107,0.3);
        color: #ff6b6b;
      }
      
      .notification-info {
        background: linear-gradient(135deg, rgba(201,157,211,0.1), rgba(201,157,211,0.05));
        border-color: rgba(201,157,211,0.3);
        color: #c99dd3;
      }
      
      .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
      }
      
      .notification-message {
        font-size: 0.95rem;
        line-height: 1.5;
      }
      
      .notification-close {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 1.2rem;
        padding: 0;
        opacity: 0.7;
        transition: opacity 0.2s;
        flex-shrink: 0;
      }
      
      .notification-close:hover {
        opacity: 1;
      }
      
      @media (max-width: 640px) {
        .notification {
          top: 10px;
          right: 10px;
          left: 10px;
          max-width: none;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Add to page
  document.body.appendChild(notification);
  
  // Close button handler
  notification.querySelector('.notification-close').addEventListener('click', () => {
    removeNotification(notification);
  });
  
  // Auto-remove after 4 seconds
  const autoRemoveTimer = setTimeout(() => {
    removeNotification(notification);
  }, 4000);
  
  // Store timer for manual close
  notification.dataset.timer = autoRemoveTimer;
  
  return notification;
}

function removeNotification(notification) {
  clearTimeout(notification.dataset.timer);
  notification.classList.add('removing');
  
  setTimeout(() => {
    notification.remove();
  }, 300);
}

// ============================================
// 6. LAZY LOAD IMAGES
// ============================================
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// ============================================
// 7. KEYBOARD SHORTCUTS
// ============================================
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Cmd/Ctrl + K: Focus search/nav
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      document.querySelector('.nav a')?.focus();
    }
    
    // Cmd/Ctrl + /: Toggle theme
    if ((e.metaKey || e.ctrlKey) && e.key === '/') {
      e.preventDefault();
      toggleTheme();
    }
  });
}

// ============================================
// 8. SCROLL TO TOP BUTTON
// ============================================
function initScrollToTop() {
  // Create button
  const scrollBtn = document.createElement('button');
  scrollBtn.id = 'scroll-to-top';
  scrollBtn.setAttribute('aria-label', 'Scroll to top');
  scrollBtn.innerHTML = '↑';
  scrollBtn.className = 'scroll-to-top';
  
  // Add styles
  const style = document.createElement('style');
  style.innerHTML = `
    .scroll-to-top {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg, 12px);
      background: var(--accent, #3dd4b8);
      color: var(--bg, #06080f);
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      font-weight: 700;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.3s ease;
      box-shadow: 0 12px 40px rgba(61, 212, 184, 0.3);
      z-index: 999;
    }
    
    .scroll-to-top.visible {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    
    .scroll-to-top:hover {
      transform: translateY(-2px);
      box-shadow: 0 16px 60px rgba(61, 212, 184, 0.4);
    }
    
    .scroll-to-top:active {
      transform: translateY(0);
    }
    
    @media (max-width: 640px) {
      .scroll-to-top {
        bottom: 1rem;
        right: 1rem;
        width: 44px;
        height: 44px;
        font-size: 1rem;
      }
    }
  `;
  
  document.head.appendChild(style);
  document.body.appendChild(scrollBtn);
  
  // Show/hide on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top on click
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// 9. PERFORMANCE: REQUEST ANIMATION FRAME
// ============================================
function initPerformanceOptimization() {
  // Debounce scroll events
  let scrollTimeout;
  window.addEventListener('scroll', () => {
    if (scrollTimeout) {
      window.cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = window.requestAnimationFrame(() => {
      // Scroll-based logic here
    });
  });
  
  // Reduce repaints on resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Resize logic
    }, 250);
  });
}

// ============================================
// 10. ACCESSIBILITY: FOCUS MANAGEMENT
// ============================================
function initAccessibility() {
  // Show focus indicator on keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  // Hide focus indicator on mouse click
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
  });
  
  // Add focus styles
  const style = document.createElement('style');
  style.innerHTML = `
    body.keyboard-nav *:focus-visible {
      outline: 2px solid var(--accent, #3dd4b8);
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// INITIALIZE ALL FEATURES
// ============================================
function initPortfolio() {
  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
    });
  } else {
    init();
  }
  
  function init() {
    initTheme();
    initMobileMenu();
    initSmoothScroll();
    initContactForm();
    initLazyLoading();
    initKeyboardShortcuts();
    initScrollToTop();
    initPerformanceOptimization();
    initAccessibility();
  }
}

// Start initialization
initPortfolio();

// Log initialization complete
console.log('Portfolio initialized ✨');
