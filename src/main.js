// ==========================================================================
// [EDIT HERE]: SYSTEM STATS COMMAND CENTER CONFIGURATION
// Customize your active quest text, streaks, status log pill, and learning progress bars!
// ==========================================================================

const consoleConfig = {
  status: "Building 🟢",                                         // Current status pill text
  currentQuest: "Mastering Fundamentals & Building Tools",     // Active learning quest description
  
  // Bullets showing up inside "Now Learning" terminal card
  nowLearning: [
    "Python Programming",
    "Object-Oriented Programming",
    "Web Development (HTML/CSS/JS)",
    "Computer Science Fundamentals",
    "Math foundations for AI/ML",
    "Java"
  ],
  


  
  // Progress bars rendering inside "skill_levels.sys" card
  // Customize skill name, percent, block bar representation, and description
  skillsProgress: [
    { 
      name: "Python Programming", 
      percent: 45, 
      blockBar: "████░░░░░░ 45%", 
      desc: "Completed basics, learning deeper concepts and building projects." 
    },
    { 
      name: "Web Development", 
      percent: 60, 
      blockBar: "██████░░░░ 60%", 
      desc: "HTML/CSS done, improving JavaScript and building better websites." 
    },
    { 
      name: "AI/ML Foundations", 
      percent: 10, 
      blockBar: "█░░░░░░░░░ 10%", 
      desc: "Building math and programming foundations before advanced ML." 
    },
    { 
      name: "DSA with Java", 
      percent: 5, 
      blockBar: "░░░░░░░░░░ 5%", 
      desc: "Starting phase of algorithms and core Java." 
    }
  ]
};

// Wait for DOM content to finish loading
document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================================================
  // [EDIT HERE]: CODING JOURNEY START DATE
  // Change '2026-03-01' to your personal start date to calculate your coding streak automatically!
  // ==========================================================================
  const calculateDaysCoding = () => {
    const startDate = new Date('2026-03-01');
    const today = new Date();
    const timeDiff = today - startDate;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    
    // Automatically write calculated values to index.html elements
    const daysCounter = document.getElementById('dynamic-days-counter');
    const consoleDaysCounter = document.getElementById('streak-counter-console');
    
    if (daysCounter) daysCounter.textContent = `${days} Days`;
    if (consoleDaysCounter) consoleDaysCounter.textContent = `Day ${days}`;
  };

  // Bind values from consoleConfig to their respective containers in index.html
  const updateDashboard = () => {
    const statusPill = document.querySelector('.status-pill-glow');
    const questText = document.querySelector('.quest-text');
    
    if (statusPill) statusPill.textContent = consoleConfig.status;
    if (questText) questText.textContent = `"${consoleConfig.currentQuest}"`;

    const nowLearningList = document.querySelector('.now-learning-list');
    if (nowLearningList) {
      nowLearningList.innerHTML = consoleConfig.nowLearning
        .map(item => `<li><span class="prompt-arrow">➜</span> ${item}</li>`)
        .join('');
    }

    const progressContainer = document.querySelector('.progress-bars-container');
    if (progressContainer) {
      progressContainer.innerHTML = consoleConfig.skillsProgress
        .map(skill => `
          <div class="skill-progress-item" data-skill="${skill.name}">
            <div class="skill-progress-meta">
              <span class="sp-name">${skill.name}</span>
              <span class="sp-val">${skill.percent}%</span>
            </div>
            <div class="skill-block-bar font-mono">${skill.blockBar}</div>
            <span class="sp-desc" style="font-size:0.75rem; color:var(--text-muted);">${skill.desc}</span>
          </div>
        `).join('');
    }
  };

  // Run dynamic updates
  calculateDaysCoding();
  updateDashboard();

  // Initialize Lenis Smooth Scroll controller
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

  // Synchronize Scroll progress bar at top of layout
  const progressBar = document.getElementById('scroll-progress');
  lenis.on('scroll', (e) => {
    if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
    
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

  // Custom Adaptive Cursor outline details & tracking loops
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');
  const cursorLabel = document.getElementById('cursor-label');

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

  // Adaptive label overrides when mouse floats inside specific sections
  const cursorSections = document.querySelectorAll('section[data-cursor-text]');
  cursorSections.forEach(section => {
    section.addEventListener('mouseenter', () => {
      const text = section.getAttribute('data-cursor-text');
      if (cursorLabel && cursorOutline) {
        cursorLabel.textContent = text;
        cursorLabel.style.opacity = "1";
        gsap.to(cursorOutline, { width: 55, height: 55, backgroundColor: 'rgba(245, 178, 26, 0.05)', borderColor: 'var(--accent-yellow)', duration: 0.3 });
      }
    });
    section.addEventListener('mouseleave', () => {
      if (cursorLabel && cursorOutline) {
        cursorLabel.textContent = "";
        cursorLabel.style.opacity = "0";
        gsap.to(cursorOutline, { width: 32, height: 32, backgroundColor: 'transparent', borderColor: 'var(--text-primary)', duration: 0.3 });
      }
    });
  });

  // Scale cursor outline when hovering clickable elements
  const hoverTargets = document.querySelectorAll('a, button, .project-card, .currently-card, .log-item, .vault-card, .quote-card-ref, .comment-input-box');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('cursor-hover');
      if (cursorLabel && cursorOutline) {
        cursorLabel.textContent = "VIEW";
        cursorLabel.style.opacity = "1";
        gsap.to(cursorOutline, { width: 60, height: 60, backgroundColor: 'rgba(255, 59, 48, 0.04)', borderColor: 'var(--accent-red)', duration: 0.2 });
      }
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-hover');
      if (cursorLabel && cursorOutline) {
        cursorLabel.textContent = "";
        cursorLabel.style.opacity = "0";
        gsap.to(cursorOutline, { width: 32, height: 32, backgroundColor: 'transparent', borderColor: 'var(--text-primary)', duration: 0.2 });
      }
    });
  });

  // Magnetic buttons effect matching layout hover actions
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

  // Command Palette Overlay Controls
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

  // ==========================================================================
  // [EDIT HERE]: PROJECT CASE STUDY DETAIL SPECIFICATIONS
  // Customize popup details rendering inside case study modal popup
  // Match index.html project's `data-project-id` to key value below
  // ==========================================================================
  const caseStudiesData = {
    'file-organizer': {
      category: 'PYTHON AUTOMATION SYSTEM',
      title: 'Smart File Organizer (Python)',
      summary: 'A Python automation tool that organizes files into categorized folders based on their file extensions. The application automatically creates folders, moves files, handles duplicate filenames intelligently, and provides a detailed execution summary.',
      architecture: 'Written in clean modular Python, utilizing native pathlib and shutil libraries for low-level filesystem observer and write bindings.',
      features: [
        'Automatically creates destination directories (Images, PDFs, Videos, Music, Text, etc.)',
        'Intelligent duplicate handling strategies: Skip, Rename, Overwrite',
        'Detailed execution log statistics showing elapsed timing performance'
      ],
      lessons: 'Understood Python standard modules, error handling techniques, and algorithm design for filesystem conflict resolution.',
      tech: ['Python 3', 'pathlib', 'shutil', 'time']
    },
    'project-generator': {
      category: 'PYTHON AUTOMATION SCRIPT',
      title: 'Auto Project Scaffolder',
      summary: 'An event-driven Python automation tool that automatically creates project structures, initializes Git repositories, and launches VS Code based on folder naming conventions.',
      architecture: 'Continuously monitors system workspaces using the Watchdog observer framework and triggers subprocess threads for Git and editor instantiation.',
      features: [
        'Real-time folder rename event listeners',
        'Scaffolding templates for PY_ (Python), HTML_ (Web), and JS_ (JavaScript) directories',
        'Integrated Git init sequence and automatic VS Code load launch'
      ],
      lessons: 'Applied asynchronous observers, process creation thread pipelines, and scripting design rules to speed up the developer workspace startup loop.',
      tech: ['Python', 'Watchdog observer', 'OS module', 'Subprocess']
    },
    'netflix-clone': {
      category: 'FRONTEND DESIGN CLONE',
      title: 'Netflix Clone 🎬',
      summary: 'A responsive Netflix landing page clone built using standard layout elements and styling properties.',
      architecture: 'Structured in clean HTML5 elements with customized layout parameters styled using CSS3 Grid, Flexbox, and media queries.',
      features: [
        'Clean Netflix-inspired visual landing page structure',
        'Complete SignIn page replica with interactive details',
        'Responsive layout scaling down cleanly to mobile and tablet displays'
      ],
      lessons: 'Gained advanced fluency in CSS flex distribution, layout spacing rules, media query breakpoints, and manual static build deployments.',
      tech: ['HTML5', 'CSS3', 'CSS Grid', 'Flexbox', 'Media Queries']
    },
    'personal-website': {
      category: 'PERSONAL DEVELOPER WEBSITE CASE STUDY',
      title: 'Personal Developer Website',
      summary: 'Building my online presence and documenting my computer science journey in a clean, minimal portfolio using vanilla languages.',
      architecture: 'Written in clean HTML5, structured using custom CSS variables (Grid/Flexbox) and enhanced with dynamic JavaScript animations.',
      features: [
        'Responsive layout scaling down cleanly to mobile devices',
        'Dynamic days counter tracking my coding journey from 1 March 2026',
        'Interactive resource index with instant client-side searching and filtering'
      ],
      lessons: 'Mastered fluid layout grids, responsive typography scales, custom cursor events, and deployment practices.',
      tech: ['HTML5', 'CSS3', 'JavaScript', 'GSAP']
    },
    'password-manager': {
      category: 'PYTHON SECURITY CASE STUDY',
      title: 'Python Password Manager Vault',
      summary: 'A secure command-line password storage tool protecting local authentication credentials using JSON files and encryption keys.',
      architecture: 'Built using Python\'s file handling features, local JSON data structures, and symmetric key vault encryption models.',
      features: [
        'Secure symmetric encryption and decryption algorithms',
        'Persistent file-based JSON storage representation for login vault',
        'Minimal, fast command line interaction loop'
      ],
      lessons: 'Learned basic cryptography logic, local secret management, data serialization structures, and safe input parameters.',
      tech: ['Python 3', 'File Handling', 'JSON', 'Cryptography']
    }
  };

  const caseStudyModal = document.getElementById('case-study-modal');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modal-close-btn');

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

  // Award-Winning GSAP Hero Entrance Sequence Trigger
  if (typeof gsap !== 'undefined') {
    const heroTl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.2 } });

    heroTl.from('.hero-badge-row', { y: 20, opacity: 0, delay: 0.15 })
          .to('.hero-title-word', { y: '0%', opacity: 1, stagger: 0.12 }, '-=0.8')
          .to('.hero-subtitle', { y: 0, opacity: 1, duration: 0.95 }, '-=0.7')
          .to('.hero-cta-group', { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
          .to('.hero-browser-showcase', { scale: 1, opacity: 1, duration: 1.1 }, '-=0.7');
  }

  // Scroll Observer triggering element visual reveals
  const textElements = document.querySelectorAll('.animate-text');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });
  textElements.forEach(el => observer.observe(el));

  // Mobile navigation button handler
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

  // Add scroll boundary classes to site navbar
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Animated counting stats triggers
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

  // Copy email clip board handles
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

  // Back to Top trigger
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      lenis.scrollTo('#hero', { duration: 1.2 });
    });
  }

  // Dynamic comments feed loader (LocalStorage persistent engine)
  const commentForm = document.getElementById('comment-form');
  const commentsList = document.getElementById('comments-list');

  function renderComments() {
    const rawComments = localStorage.getItem('bhavya_comments') || '[]';
    const comments = JSON.parse(rawComments);
    if (commentsList) {
      commentsList.innerHTML = comments.map(c => `
        <div class="comment-item-card border-glow-yellow" style="background:#FFF; border:1px solid rgba(17,17,17,0.06); padding:1rem; border-radius:10px; margin-bottom:0.75rem;">
          <span style="font-weight:700; font-size:0.85rem; display:block;">${c.name}</span>
          <p style="font-size:0.85rem; color:#555; margin-top:0.25rem;">${c.message}</p>
        </div>
      `).reverse().join('');
    }
  }

  if (commentForm) {
    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('comment-name');
      const messageInput = document.getElementById('comment-message');
      const name = nameInput.value.trim();
      const message = messageInput.value.trim();

      if (name && message) {
        const rawComments = localStorage.getItem('bhavya_comments') || '[]';
        const comments = JSON.parse(rawComments);
        comments.push({ name, message, timestamp: new Date().getTime() });
        localStorage.setItem('bhavya_comments', JSON.stringify(comments));

        nameInput.value = '';
        messageInput.value = '';
        renderComments();
      }
    });
  }

  // Render comments automatically on load
  renderComments();

  // ==========================================================================
  // [KNOWLEDGE VAULT BOOKMARK SYSTEM LOGIC]
  // ==========================================================================
  
  // 1. Seed initial data if localStorage database has no saved links yet
  const defaultResources = [
    {
      name: "Python 3 Official Documentation",
      url: "https://docs.python.org/3/",
      category: "Python",
      type: "Documentation"
    },
    {
      name: "Smart File Organizer Repository",
      url: "https://github.com/BhavyaPro-7/Python_File_organiser",
      category: "Tools",
      type: "GitHub"
    },
    {
      name: "Sigma Web Development Course",
      url: "https://youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0IaF2dB6",
      category: "Web Development",
      type: "YouTube Course"
    }
  ];

  // Load from localStorage database
  function getVaultResources() {
    const data = localStorage.getItem('bhavya_vault_resources');
    if (!data) {
      localStorage.setItem('bhavya_vault_resources', JSON.stringify(defaultResources));
      return defaultResources;
    }
    return JSON.parse(data);
  }

  // Save the array back into the local storage database
  function saveVaultResources(resources) {
    localStorage.setItem('bhavya_vault_resources', JSON.stringify(resources));
  }

  // Check if current browser session has authenticated admin rights
  function isUserAdmin() {
    return localStorage.getItem('bhavya_is_admin') === 'true';
  }

  // Dynamically update UI buttons based on admin session status
  const adminLoginBtn = document.getElementById('admin-login-btn');
  const vaultAddBtn = document.getElementById('vault-add-btn');

  function checkAdminStatus() {
    const admin = isUserAdmin();
    if (admin) {
      if (adminLoginBtn) adminLoginBtn.innerHTML = 'Logout 🔓';
      if (vaultAddBtn) vaultAddBtn.style.display = 'block';
    } else {
      if (adminLoginBtn) adminLoginBtn.innerHTML = 'Admin Login 🔒';
      if (vaultAddBtn) vaultAddBtn.style.display = 'none';
    }
  }

  // Generate SVG icons based on resource properties
  function getResourceIcon(url, type) {
    const normalizedUrl = url.toLowerCase();
    const normalizedType = type.toLowerCase();
    
    if (normalizedType.includes('youtube') || normalizedUrl.includes('youtube.com') || normalizedUrl.includes('youtu.be')) {
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2" style="background: rgba(255, 59, 48, 0.08); padding: 5px; border-radius: 8px;"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>`;
    }
    
    if (normalizedType.includes('github') || normalizedUrl.includes('github.com')) {
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="2" style="background: rgba(17, 17, 17, 0.06); padding: 5px; border-radius: 8px;"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`;
    }
    
    if (normalizedType.includes('book')) {
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" stroke-width="2" style="background: rgba(255, 59, 48, 0.08); padding: 5px; border-radius: 8px;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20F4 19.5V3c0-1.1.9-2 2-2h12a2 2 0 0 1 2 2v14M6.5 17H20"/></svg>`;
    }
    
    if (normalizedType.includes('tool')) {
      return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" stroke-width="2" style="background: rgba(245, 178, 26, 0.08); padding: 5px; border-radius: 8px;"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
    }
    
    return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-yellow)" stroke-width="2" style="background: rgba(245, 178, 26, 0.08); padding: 5px; border-radius: 8px;"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;
  }

  let activeVaultFilter = "all";
  let activeVaultQuery = "";

  const vaultGrid = document.getElementById('vault-grid');
  const vaultSearchInput = document.getElementById('vault-search-input');
  
  // Render vault cards dynamically
  function renderVault() {
    const resources = getVaultResources();
    if (!vaultGrid) return;

    const filtered = resources.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(activeVaultQuery) || res.url.toLowerCase().includes(activeVaultQuery);
      const matchesCategory = activeVaultFilter === "all" || res.category === activeVaultFilter;
      return matchesSearch && matchesCategory;
    });

    const admin = isUserAdmin();

    vaultGrid.innerHTML = filtered.map((res, index) => {
      const originalIndex = resources.findIndex(r => r.url === res.url && r.name === res.name);
      
      // Conditionally render edit and delete action buttons ONLY if logged in as admin
      const adminActionsHtml = admin ? `
        <button class="vault-edit-btn btn-secondary" data-index="${originalIndex}" style="padding: 0.4rem 0.85rem; font-size: 0.75rem; border-radius: 6px; cursor: pointer; border: 1px solid var(--border-subtle);">Edit</button>
        <button class="vault-delete-btn btn-secondary text-red" data-index="${originalIndex}" style="padding: 0.4rem 0.85rem; font-size: 0.75rem; border-radius: 6px; cursor: pointer; border: 1px solid rgba(255, 59, 48, 0.2); background: rgba(255, 59, 48, 0.03);">Delete</button>
      ` : '';

      return `
        <div class="vault-card border-glow-yellow" data-vault-cat="${res.category.toLowerCase()}" style="min-height: 200px; display: flex; flex-direction: column; justify-content: space-between; padding: 1.5rem; background: var(--card-bg); border-radius: var(--card-radius); transition: transform 0.25s ease;">
          <div>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem; width: 80%;">
                ${getResourceIcon(res.url, res.type)}
                <h4 style="font-size: 1.05rem; font-weight: 700; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${res.name}">${res.name}</h4>
              </div>
              <span style="font-size: 0.7rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">${res.type}</span>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.4; margin-bottom: 1rem; font-family: var(--font-mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${res.url}
            </p>
            <div style="font-size: 0.75rem; font-weight: 600;">
              Category: <span class="text-red">${res.category}</span>
            </div>
          </div>
          
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem; border-top: 1px dashed var(--border-subtle); padding-top: 0.75rem;">
            <a href="${res.url}" target="_blank" class="btn-primary" style="padding: 0.4rem 0.85rem; font-size: 0.75rem; border-radius: 6px; text-decoration: none; display: inline-flex; align-items: center;">Open</a>
            ${adminActionsHtml}
          </div>
        </div>
      `;
    }).join('');

    // Attach click events to dynamic elements if admin actions exist
    if (admin) {
      document.querySelectorAll('.vault-edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = btn.getAttribute('data-index');
          openResourceModal(parseInt(index));
        });
      });

      document.querySelectorAll('.vault-delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const index = btn.getAttribute('data-index');
          deleteResource(parseInt(index));
        });
      });
    }
  }

  // Modal UI Controls
  const resourceModal = document.getElementById('resource-modal');
  const resourceForm = document.getElementById('resource-form');
  const resourceModalClose = document.getElementById('resource-modal-close');
  
  function openResourceModal(index = null) {
    if (!resourceModal) return;
    
    const titleEl = document.getElementById('resource-modal-title');
    const nameInput = document.getElementById('resource-name');
    const urlInput = document.getElementById('resource-url');
    const catSelect = document.getElementById('resource-category');
    const typeSelect = document.getElementById('resource-type');
    const idInput = document.getElementById('resource-id');

    if (index !== null) {
      const resources = getVaultResources();
      const res = resources[index];
      
      titleEl.textContent = "Edit Resource";
      nameInput.value = res.name;
      urlInput.value = res.url;
      catSelect.value = res.category;
      typeSelect.value = res.type;
      idInput.value = index;
    } else {
      titleEl.textContent = "Add New Resource";
      resourceForm.reset();
      idInput.value = "";
    }
    
    resourceModal.classList.add('active');
  }

  function closeResourceModal() {
    if (resourceModal) resourceModal.classList.remove('active');
  }

  if (vaultAddBtn) vaultAddBtn.addEventListener('click', () => openResourceModal());
  if (resourceModalClose) resourceModalClose.addEventListener('click', closeResourceModal);

  // Form submit handles (creates / edits entry in LocalStorage)
  if (resourceForm) {
    resourceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('resource-name').value.trim();
      const url = document.getElementById('resource-url').value.trim();
      const category = document.getElementById('resource-category').value;
      const type = document.getElementById('resource-type').value;
      const indexVal = document.getElementById('resource-id').value;

      const resources = getVaultResources();
      const newRes = { name, url, category, type };

      if (indexVal !== "") {
        resources[parseInt(indexVal)] = newRes;
      } else {
        resources.push(newRes);
      }

      saveVaultResources(resources);
      closeResourceModal();
      renderVault();
    });
  }

  // Delete Resource from Database
  function deleteResource(index) {
    if (confirm("Are you sure you want to delete this resource?")) {
      const resources = getVaultResources();
      resources.splice(index, 1);
      saveVaultResources(resources);
      renderVault();
    }
  }

  // Filter Pills triggers
  const vaultFilterBtns = document.querySelectorAll('[data-vault-filter]');
  vaultFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vaultFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeVaultFilter = btn.getAttribute('data-vault-filter');
      renderVault();
    });
  });

  if (vaultSearchInput) {
    vaultSearchInput.addEventListener('input', (e) => {
      activeVaultQuery = e.target.value.toLowerCase();
      renderVault();
    });
  }

  // Admin Login Modal Controls
  const adminLoginModal = document.getElementById('admin-login-modal');
  const adminLoginForm = document.getElementById('admin-login-form');
  const adminLoginModalClose = document.getElementById('admin-login-modal-close');

  function openAdminModal() {
    if (adminLoginModal) adminLoginModal.classList.add('active');
  }

  function closeAdminModal() {
    if (adminLoginModal) adminLoginModal.classList.remove('active');
  }

  if (adminLoginModalClose) adminLoginModalClose.addEventListener('click', closeAdminModal);

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener('click', () => {
      if (isUserAdmin()) {
        // Log out immediately
        localStorage.removeItem('bhavya_is_admin');
        checkAdminStatus();
        renderVault();
        const toast = document.getElementById('toast');
        if (toast) {
          toast.textContent = "Logged out of Admin Session 🔒";
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2500);
        }
      } else {
        // Open login popup modal
        openAdminModal();
      }
    });
  }

  // Submit handler for Admin authentication check
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailVal = document.getElementById('admin-email').value.trim();
      const passwordVal = document.getElementById('admin-password').value.trim();

      // ==========================================
      // [EDIT HERE]: ADMIN CREDENTIALS CONFIGURATION
      // Change email check or PIN string to customize admin logins
      // ==========================================
      if (emailVal === 'bhavyakothari.dev@gmail.com' && passwordVal === '4148') {
        localStorage.setItem('bhavya_is_admin', 'true');
        closeAdminModal();
        checkAdminStatus();
        renderVault();
        
        const toast = document.getElementById('toast');
        if (toast) {
          toast.textContent = "Admin Session Authenticated! 🔓";
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 2500);
        }
      } else {
        alert("Invalid admin email or PIN. Authorization denied.");
      }
    });
  }

  // Render initial vault list & check session admin flags
  checkAdminStatus();
  renderVault();
});
// ==========================================================================
// END OF MAIN.JS
// ==========================================================================
