/* ═══════════════════════════════════════════════════════════════════
   MedVista Clinic — app.js
   Glassmorphism UI — Interactive Logic
═══════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── DOM REFS ───────────────────────────────────────────────────── */
  const overlay      = document.getElementById('modalOverlay');
  const closeBtn     = document.getElementById('modalClose');
  const submitBtn    = document.getElementById('submitBtn');
  const formEl       = document.getElementById('modalForm');
  const successEl    = document.getElementById('modalSuccess');
  const successClose = document.getElementById('successClose');
  const heroCards    = document.getElementById('heroCards');
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobileMenu');
  const navbar       = document.getElementById('navbar');

  // All triggers that open the booking modal
  const bookTriggers = document.querySelectorAll(
    '.book-trigger, #navBookBtn, #heroBookBtn, #hCardBookBtn, #mobileBookBtn'
  );

  /* ─── MODAL — open / close ───────────────────────────────────────── */
  function openModal() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Set min date to today
    const dateInput = document.getElementById('fDate');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Reset form visibility after close animation completes
    setTimeout(() => {
      if (formEl)   formEl.style.display = '';
      if (successEl) successEl.classList.remove('visible');
    }, 380);
  }

  bookTriggers.forEach(btn => btn && btn.addEventListener('click', openModal));
  closeBtn     && closeBtn.addEventListener('click', closeModal);
  successClose && successClose.addEventListener('click', closeModal);

  // Close on overlay backdrop click
  overlay && overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
      closeModal();
    }
  });

  /* ─── FORM SUBMISSION ────────────────────────────────────────────── */
  submitBtn && submitBtn.addEventListener('click', function () {
    const fields = [
      { id: 'fName',  label: 'First Name' },
      { id: 'lName',  label: 'Last Name'  },
      { id: 'fEmail', label: 'Email'      },
      { id: 'fDept',  label: 'Department' },
      { id: 'fDate',  label: 'Date'       },
      { id: 'fTime',  label: 'Time'       },
    ];

    let valid = true;

    fields.forEach(({ id }) => {
      const el  = document.getElementById(id);
      if (!el) return;
      const val = el.value.trim();
      if (!val) {
        valid = false;
        setFieldError(el);
      }
    });

    if (!valid) {
      submitBtn.classList.add('shake');
      setTimeout(() => submitBtn.classList.remove('shake'), 500);
      showToast('⚠️ Please fill in all required fields.', 'error');
      return;
    }

    // Email format validation
    const emailEl = document.getElementById('fEmail');
    if (emailEl && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      setFieldError(emailEl);
      showToast('⚠️ Please enter a valid email address.', 'error');
      return;
    }

    // All good → show success
    const fName = document.getElementById('fName').value.trim();
    const lName = document.getElementById('lName').value.trim();
    formEl.style.display = 'none';
    successEl.classList.add('visible');
    showToast(`✅ Booking confirmed for ${fName} ${lName}!`, 'success');
  });

  function setFieldError(el) {
    el.style.borderColor = 'rgba(251,113,133,0.8)';
    el.style.boxShadow   = '0 0 0 3.5px rgba(251,113,133,0.22)';
    el.addEventListener('input', function resetError() {
      el.style.borderColor = '';
      el.style.boxShadow   = '';
      el.removeEventListener('input', resetError);
    });
  }

  /* ─── TOAST NOTIFICATION ─────────────────────────────────────────── */
  function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.mv-toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = 'mv-toast';
    toast.textContent = message;

    const isError = type === 'error';

    Object.assign(toast.style, {
      position:       'fixed',
      bottom:         '2.2rem',
      left:           '50%',
      transform:      'translateX(-50%) translateY(24px)',
      background:     isError
                        ? 'rgba(30,10,14,0.85)'
                        : 'rgba(8,30,42,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      padding:        '1rem 2.4rem',
      borderRadius:   '60px',
      fontWeight:     '600',
      color:          isError ? '#fca5a5' : '#b8f0f7',
      boxShadow:      isError
                        ? '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(251,113,133,0.35)'
                        : '0 16px 48px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(15,163,192,0.35)',
      zIndex:         '9999',
      transition:     'opacity 0.4s ease, transform 0.4s ease',
      opacity:        '0',
      fontFamily:     "'Plus Jakarta Sans', sans-serif",
      fontSize:       '0.93rem',
      whiteSpace:     'nowrap',
      border:         isError
                        ? '1px solid rgba(251,113,133,0.2)'
                        : '1px solid rgba(15,163,192,0.2)',
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity   = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity   = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 450);
    }, 3200);
  }

  /* ─── 3D TILT (hero cards) ───────────────────────────────────────── */
  let tiltEnabled = window.innerWidth >= 900;

  window.addEventListener('resize', () => {
    tiltEnabled = window.innerWidth >= 900;
    if (!tiltEnabled && heroCards) {
      heroCards.style.transform = '';
    }
  });

  document.addEventListener('mousemove', function (e) {
    if (!tiltEnabled || !heroCards) return;
    const rx = (e.clientX / window.innerWidth  - 0.5) * 8;
    const ry = (e.clientY / window.innerHeight - 0.5) * -6;
    heroCards.style.transform = `perspective(1200px) rotateY(${rx}deg) rotateX(${ry}deg)`;
  });

  // Reset tilt when mouse leaves window
  document.addEventListener('mouseleave', () => {
    if (heroCards) heroCards.style.transform = '';
  });

  /* ─── NAVBAR — scroll behaviour ──────────────────────────────────── */
  if (navbar) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY > 60;
      navbar.style.background = scrolled
        ? 'rgba(3,17,26,0.85)'
        : 'rgba(3,17,26,0.55)';
      navbar.style.boxShadow = scrolled
        ? '0 8px 32px rgba(0,0,0,0.4)'
        : 'none';
    }, { passive: true });
  }

  /* ─── HAMBURGER / MOBILE MENU ────────────────────────────────────── */
  hamburger && hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ─── SCROLL REVEAL ──────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll(
    '.service-card, .doc-card, .wv-card, .section-h2, .section-tag, ' +
    '.why-desc, .why-list, .cs-item, .trust-strip, .section-label'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 5) * 80}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        revealObserver.unobserve(e.target);
      }
    }),
    { threshold: 0.1 }
  );

  revealEls.forEach(el => revealObserver.observe(el));

  /* ─── DOCTOR CARDS — pre-fill doctor select ──────────────────────── */
  document.querySelectorAll('.doc-card').forEach(card => {
    const bookBtn = card.querySelector('.doc-book-btn');
    const docName = card.querySelector('h4')?.textContent.trim();
    const spec    = card.dataset.specialty;

    bookBtn && bookBtn.addEventListener('click', function () {
      openModal();

      setTimeout(() => {
        // Pre-fill the doctor select
        if (docName) {
          const docSelect = document.getElementById('fDoc');
          if (docSelect) {
            [...docSelect.options].forEach(opt => {
              if (opt.text === docName) docSelect.value = opt.value;
            });
          }
        }
        // Pre-fill the department if we know the specialty
        if (spec) {
          const deptSelect = document.getElementById('fDept');
          if (deptSelect) {
            const specMap = {
              'General Practitioner': 'General Medicine',
              'Cardiologist':         'Cardiology',
              'Neurologist':          'Mental Health',
              'Pulmonologist':        'Respiratory Care',
            };
            const dept = specMap[spec];
            if (dept) {
              [...deptSelect.options].forEach(opt => {
                if (opt.text === dept) deptSelect.value = opt.value;
              });
            }
          }
        }
      }, 60);
    });
  });

  /* ─── SMOOTH ANCHOR LINKS ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const selector = this.getAttribute('href');
      if (!selector || selector === '#') return;
      const target = document.querySelector(selector);
      if (target) {
        e.preventDefault();
        const navH = navbar ? navbar.offsetHeight : 0;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─── GLASS CARD CURSOR GLOW (subtle shimmer effect) ─────────────── */
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', function (e) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });

})();