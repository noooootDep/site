/**
 * ПрофБезопасность — Учебный центр охраны труда
 * Main JavaScript - Navigation, Tabs, Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initScrollToTop();
  initCounters();
  initFadeInObserver();
  initSvedeniyaTabs();
  initSmoothScroll();
  initScrollSpy();
});

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const overlay = document.getElementById('overlay');

  if (!toggle || !nav) return;

  function closeMenu() {
    toggle.classList.remove('active');
    nav.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openMenu() {
    toggle.classList.add('active');
    nav.classList.add('open');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  toggle.addEventListener('click', () => {
    if (nav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (overlay) {
    overlay.addEventListener('click', closeMenu);
  }

  // Close on nav link click (mobile)
  nav.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ===== SCROLL TO TOP ===== */
function initScrollToTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== ANIMATED COUNTERS ===== */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'), 10);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
  const duration = 1500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing: ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(ease * target);

    el.textContent = current.toLocaleString('ru-RU');

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Add + or % suffix if needed
      const label = el.parentElement.querySelector('.stat-item__label');
      if (label) {
        const text = label.textContent.toLowerCase();
        if (text.includes('%')) {
          el.textContent = target.toLocaleString('ru-RU') + '%';
        } else if (target > 100) {
          el.textContent = target.toLocaleString('ru-RU') + '+';
        }
      }
    }
  }

  requestAnimationFrame(update);
}

/* ===== FADE-IN ON SCROLL ===== */
function initFadeInObserver() {
  const elements = document.querySelectorAll('.fade-in-element');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Stagger the animations slightly
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 80);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ===== SVEDENIYA TABS ===== */
function initSvedeniyaTabs() {
  const navContainer = document.getElementById('svedeniya-nav');
  if (!navContainer) return;

  const tabLinks = navContainer.querySelectorAll('.svedeniya-nav__link');
  const subsections = document.querySelectorAll('.subsection');

  // Handle tab clicks
  tabLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = link.getAttribute('data-tab');
      activateTab(tabId, tabLinks, subsections);

      // Scroll to the nav (if needed)
      const navRect = navContainer.getBoundingClientRect();
      if (navRect.top < 0 || navRect.top > window.innerHeight) {
        navContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // Update URL hash
      history.replaceState(null, '', '#' + tabId);
    });
  });

  // Handle header nav links that point to svedeniya tabs
  document.querySelectorAll('.svedeniya-tab-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href').replace('#', '');
      const tabLink = navContainer.querySelector(`[data-tab="${hash}"]`);
      if (tabLink) {
        e.preventDefault();
        activateTab(hash, tabLinks, subsections);
        navContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + hash);
      }
    });
  });

  // Check URL hash on load
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    const validTab = navContainer.querySelector(`[data-tab="${hash}"]`);
    if (validTab) {
      // Small delay to ensure layout is ready
      setTimeout(() => {
        activateTab(hash, tabLinks, subsections);
        navContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  // Scroll active tab into view in navigation
  const activeTabLink = navContainer.querySelector('.svedeniya-nav__link--active');
  if (activeTabLink) {
    scrollTabIntoView(activeTabLink, navContainer);
  }
}

function activateTab(tabId, tabLinks, subsections) {
  // Update nav links
  tabLinks.forEach(link => {
    link.classList.toggle('svedeniya-nav__link--active', link.getAttribute('data-tab') === tabId);
  });

  // Update subsections
  subsections.forEach(section => {
    section.classList.toggle('subsection--active', section.getAttribute('data-section') === tabId);
  });

  // Update main header nav links
  const mainNavLinks = document.querySelectorAll('#main-nav .nav__link');
  if (mainNavLinks.length) {
    mainNavLinks.forEach(link => link.classList.remove('nav__link--active'));
    
    if (tabId === 'education') {
      const navProg = document.getElementById('nav-programs');
      if (navProg) navProg.classList.add('nav__link--active');
    } else if (tabId === 'documents') {
      const navDocs = document.getElementById('nav-docs');
      if (navDocs) navDocs.classList.add('nav__link--active');
    } else {
      const navSved = document.getElementById('nav-svedeniya');
      if (navSved) navSved.classList.add('nav__link--active');
    }
  }

  // Scroll the active tab link into view horizontally
  const activeLink = document.querySelector(`.svedeniya-nav__link[data-tab="${tabId}"]`);
  const navContainer = document.getElementById('svedeniya-nav');
  if (activeLink && navContainer) {
    scrollTabIntoView(activeLink, navContainer);
  }
}

function scrollTabIntoView(tabLink, navContainer) {
  const container = navContainer.querySelector('.container');
  if (!container) return;

  const linkRect = tabLink.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  // Check if tab is out of view
  if (linkRect.left < containerRect.left || linkRect.right > containerRect.right) {
    const scrollLeft = tabLink.offsetLeft - container.offsetWidth / 2 + tabLink.offsetWidth / 2;
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }
}

/* ===== SMOOTH SCROLL FOR ANCHORS ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Skip tab links (handled separately)
    if (anchor.classList.contains('svedeniya-nav__link') || anchor.classList.contains('svedeniya-tab-link')) return;

    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '#callback') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });
}

/* ===== SCROLLSPY FOR INDEX.HTML ===== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#main-nav .nav__link');

  // Only run on main page where sections exist
  if (!sections.length || !navLinks.length || document.getElementById('svedeniya-nav')) return;

  window.addEventListener('scroll', () => {
    let current = '';
    
    // Check if we are near the bottom of the page (for contacts)
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
      current = 'contacts';
    } else {
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= (sectionTop - 150)) {
          current = section.getAttribute('id');
        }
      });
    }

    if (current) {
      navLinks.forEach(link => {
        link.classList.remove('nav__link--active');
        
        if (current === 'contacts' && link.id === 'nav-contacts') {
          link.classList.add('nav__link--active');
        } else if (current === 'programs' && link.id === 'nav-programs') {
          link.classList.add('nav__link--active');
        } else if (current === 'main-content' && link.id === 'nav-home') {
          link.classList.add('nav__link--active');
        }
      });
      
      // Fallback: if no specific section matches our nav, highlight Home
      if (current !== 'contacts' && current !== 'programs') {
         const homeLink = document.getElementById('nav-home');
         if (homeLink && !document.querySelector('#main-nav .nav__link--active')) {
             homeLink.classList.add('nav__link--active');
         }
      }
    }
  }, { passive: true });
}
