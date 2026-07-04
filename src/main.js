// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Initialize Lenis Smooth Scroll
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: true,
    touchMultiplier: 1.5,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Synchronize Lenis with GSAP ScrollTrigger & Scroll Progress Bar
  const progressBar = document.getElementById('scroll-progress');
  lenis.on('scroll', (e) => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    
    // Scroll progress calculation
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal > 0 && progressBar) {
      const progress = (e.scroll / scrollTotal) * 100;
      progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  });

  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // 2. Custom Magnetic Cursor
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
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;
    if (cursorOutline) {
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const hoverTargets = document.querySelectorAll('a, button, .project-card, .currently-card, .log-item');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Magnetic Buttons
  const magneticElements = document.querySelectorAll('[data-magnetic]');
  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  // 3. Command Palette (Ctrl+K / Cmd+K)
  const cmdOverlay = document.getElementById('cmd-overlay');
  const cmdInput = document.getElementById('cmd-input');
  const cmdTriggerBtn = document.getElementById('cmd-trigger-btn');
  const cmdLinks = document.querySelectorAll('[data-cmd-link]');

  function openCommandPalette() {
    if (cmdOverlay) {
      cmdOverlay.classList.add('active');
      setTimeout(() => cmdInput && cmdInput.focus(), 100);
    }
  }

  function closeCommandPalette() {
    if (cmdOverlay) cmdOverlay.classList.remove('active');
  }

  if (cmdTriggerBtn) cmdTriggerBtn.addEventListener('click', openCommandPalette);

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdOverlay && cmdOverlay.classList.contains('active')) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    }
    if (e.key === 'Escape') {
      closeCommandPalette();
      closeModal();
    }
  });

  if (cmdOverlay) {
    cmdOverlay.addEventListener('click', (e) => {
      if (e.target === cmdOverlay) closeCommandPalette();
    });
  }

  cmdLinks.forEach(link => {
    link.addEventListener('click', () => closeCommandPalette());
  });

  // Search filter inside command palette
  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      const items = document.querySelectorAll('.cmd-item');
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(term)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 4. Case Study Modals Data & Logic
  const caseStudyModal = document.getElementById('case-study-modal');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  const caseStudiesData = {
    'netflix-clone': {
      category: 'FRONTEND ENGINEERING CASE STUDY',
      title: 'Netflix Landing Page Clone',
      summary: 'A pixel-perfect, highly performant web recreation of Netflix\'s high-traffic streaming landing interface, engineered to master complex CSS layouts, responsive breakpoints, and interactive state management.',
      architecture: 'Built using HTML5 semantic elements and vanilla CSS3 architecture (Grid & Flexbox). Features custom media queries tuned for mobile, tablet, and 4K viewports without relying on bulky CSS frameworks.',
      features: [
        'Interactive FAQ Accordion with smooth height animation transitions',
        'Email validation input fields mimicking real signup user onboarding',
        'Zero external CSS dependencies for lightning-fast page load'
      ],
      lessons: 'Mastered fluid typography scaling, avoided layout jumps during accordion expansions, and perfected flexbox distribution across irregular mobile device aspect ratios.',
      tech: ['HTML5', 'CSS3 Grid', 'Flexbox', 'Vanilla JS']
    },
    'downloads-organizer': {
      category: 'SYSTEM AUTOMATION CASE STUDY',
      title: 'Python Downloads Folder Organizer',
      summary: 'An intelligent desktop automation utility that monitors unorganized download directories, categorizes files by extension types, and automatically structures them into system subfolders.',
      architecture: 'Engineered with Python standard libraries (`pathlib`, `shutil`, `os`). Employs pattern-matching dictionaries to map file extensions (.pdf, .png, .zip, .mp4) to destination directory trees automatically.',
      features: [
        'Dynamic directory creation if target categories do not exist',
        'Automated file collision handling for duplicate file names',
        'Sub-second batch execution handling hundreds of files concurrently'
      ],
      lessons: 'Deepened knowledge of operating system file handles, permission handling across OS environments, and writing clean maintainable automation algorithms.',
      tech: ['Python 3', 'pathlib', 'shutil', 'OS API']
    },
    'password-manager': {
      category: 'SECURITY & CRYPTOGRAPHY CASE STUDY',
      title: 'Python Password Manager Vault',
      summary: 'A secure command-line authentication vault designed to store, encrypt, and retrieve sensitive personal credentials locally using industrial-grade cryptography.',
      architecture: 'Utilizes Python\'s `cryptography.fernet` module for symmetric key encryption. Raw passwords are encrypted before writing to persistent local storage, ensuring zero plain-text leaks.',
      features: [
        'Symmetric key generation and secure key storage protocols',
        'Master password decryption verification on authentication requests',
        'Clean CLI interaction loop for key-value credential access'
      ],
      lessons: 'Learned core security fundamentals, symmetric encryption vs hashing, and principles of local secret management in software architecture.',
      tech: ['Python 3', 'Fernet Encryption', 'cryptography', 'CLI']
    }
  };

  function openModal(projectId) {
    const data = caseStudiesData[projectId];
    if (!data || !modalBody || !caseStudyModal) return;

    modalBody.innerHTML = `
      <span class="modal-header-cat">${data.category}</span>
      <h3 class="modal-title">${data.title}</h3>
      <p style="font-size:1.05rem; color:#444; line-height:1.6; margin-bottom:1.5rem;">${data.summary}</p>
      
      <div class="modal-section">
        <h4>System Architecture & Design</h4>
        <p>${data.architecture}</p>
      </div>

      <div class="modal-section">
        <h4>Key Features</h4>
        <ul style="padding-left:1.2rem; margin-top:0.5rem; color:#555; font-size:0.95rem;">
          ${data.features.map(f => `<li style="margin-bottom:0.4rem;">${f}</li>`).join('')}
        </ul>
      </div>

      <div class="modal-section">
        <h4>Key Lessons Learned</h4>
        <p>${data.lessons}</p>
      </div>

      <div class="modal-section">
        <h4>Technologies Used</h4>
        <div class="modal-tech-flex">
          ${data.tech.map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>

      <div class="modal-actions">
        <a href="https://github.com" target="_blank" class="btn-primary">View GitHub Repository ↗</a>
      </div>
    `;

    caseStudyModal.classList.add('active');
  }

  function closeModal() {
    if (caseStudyModal) caseStudyModal.classList.remove('active');
  }

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-open-modal');
      openModal(id);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (caseStudyModal) {
    caseStudyModal.addEventListener('click', (e) => {
      if (e.target === caseStudyModal) closeModal();
    });
  }

  // 5. Mobile Menu & Header Scroll
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNavOverlay) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileNavOverlay.classList.toggle('active');
    });
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNavOverlay.classList.remove('active');
      });
    });
  }

  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 6. Animated Stats Counter
  const statNumbers = document.querySelectorAll('.stat-number');
  let animatedStats = false;

  function animateCounters() {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1500; // ms
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.ceil(current);
        }
      }, stepTime);
    });
  }

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: '.section-stats',
      start: 'top 85%',
      onEnter: () => {
        if (!animatedStats) {
          animateCounters();
          animatedStats = true;
        }
      }
    });
  }

  // 7. Email One-Click Copy & Toast
  const copyBtn = document.getElementById('copy-btn');
  const emailBox = document.getElementById('email-box');
  const toast = document.getElementById('toast');

  if (copyBtn && emailBox) {
    const emailToCopy = "bhavyakothari.dev@gmail.com";
    const performCopy = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(emailToCopy).then(() => {
        if (toast) {
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2500);
        }
      }).catch(err => console.error(err));
    };
    copyBtn.addEventListener('click', performCopy);
    emailBox.addEventListener('click', performCopy);
  }

  // 8. Back to Top
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      lenis.scrollTo('#hero', { duration: 1.2 });
    });
  }
});
