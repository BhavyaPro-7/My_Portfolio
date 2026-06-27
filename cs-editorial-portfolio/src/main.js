// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Synchronize Lenis with GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  // 2. Custom Magnetic Cursor & Hover States
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }
  });

  function animateCursor() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    if (cursorOutline) {
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add Hover class on interactive items
  const hoverTargets = document.querySelectorAll('a, button, .editorial-card, .bento-card, .project-card-editorial, .skill-cat-box');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Magnetic Button Effect
  const magneticElements = document.querySelectorAll('[data-magnetic]');
  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });

  // 3. Header Scroll Glassmorphism & Active State
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 4. GSAP Scroll Animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    
    // Hero Entrance Animation
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });
    
    heroTl.from('.hero-badge-row', { y: 30, opacity: 0, delay: 0.2 })
          .from('.title-line', { y: 80, opacity: 0, stagger: 0.15 }, '-=0.8')
          .from('.yellow-highlight-box', { scale: 0.8, rotate: 0, opacity: 0 }, '-=0.6')
          .from('.hero-subtitle', { y: 30, opacity: 0 }, '-=0.6')
          .from('.hero-cta-group', { y: 20, opacity: 0 }, '-=0.4')
          .from('.hero-graphic-box', { scale: 0.9, opacity: 0, duration: 1 }, '-=0.6');

    // Section 02: About Me Animations
    gsap.from('.lead-text', {
      scrollTrigger: {
        trigger: '.section-about',
        start: 'top 75%',
      },
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.about-cards-col .editorial-card', {
      scrollTrigger: {
        trigger: '.about-cards-col',
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out'
    });

    // Section 03: Journey Timeline Progress Line
    gsap.to('#timeline-progress', {
      scrollTrigger: {
        trigger: '.timeline-wrapper',
        start: 'top 70%',
        end: 'bottom 80%',
        scrub: true
      },
      height: '100%',
      ease: 'none'
    });

    // Timeline Items Entrance
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      });
    });

    // Section 04: Featured Projects Reveal
    const projectCards = document.querySelectorAll('.project-card-editorial');
    projectCards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    // Section 05: Skills Grid Stagger
    gsap.from('.skill-cat-box', {
      scrollTrigger: {
        trigger: '.skills-categorized-grid',
        start: 'top 80%',
      },
      y: 40,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.out'
    });

    // Section 06: Bento Grid Cards Reveal
    gsap.from('.bento-card', {
      scrollTrigger: {
        trigger: '.bento-focus-grid',
        start: 'top 80%',
      },
      scale: 0.95,
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.9,
      ease: 'power3.out'
    });
  }

  // 5. Email One-Click Copy & Toast
  const copyBtn = document.getElementById('copy-btn');
  const emailBox = document.getElementById('email-box');
  const toast = document.getElementById('toast');

  if (copyBtn && emailBox) {
    const emailToCopy = "bhavyakothari.dev@gmail.com";

    const performCopy = () => {
      navigator.clipboard.writeText(emailToCopy).then(() => {
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 3000);
        }
      }).catch(err => {
        console.error("Failed to copy email: ", err);
      });
    };

    copyBtn.addEventListener('click', performCopy);
    emailBox.addEventListener('click', performCopy);
  }

  // 6. Back to Top Smooth Scroll
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      lenis.scrollTo('#hero', { duration: 1.5 });
    });
  }
});
