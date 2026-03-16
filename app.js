/* script.js — MedVista Clinic */
(function () {
  'use strict';

  // ─── ELEMENTS ────────────────────────────────────────────────────
  const overlay   = document.getElementById('modalOverlay');
  const modal     = document.getElementById('bookingModal');
  const closeBtn  = document.getElementById('modalClose');
  const submitBtn = document.getElementById('submitBtn');
  const formEl    = document.getElementById('modalForm');
  const successEl = document.getElementById('modalSuccess');
  const successClose = document.getElementById('successClose');
  const heroCards = document.getElementById('heroCards');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu= document.getElementById('mobileMenu');

  // All buttons that open the modal
  const bookTriggers = document.querySelectorAll(
    '.book-trigger, #navBookBtn, #heroBookBtn, #hCardBookBtn, #mobileBookBtn'
  );

  // ─── MODAL ───────────────────────────────────────────────────────
  function openModal () {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Set minimum date to today
    const dateInput = document.getElementById('fDate');
    if (dateInput) {
      const today = new Date().toISOString().split('T')[0];
      dateInput.min = today;
    }
  }

  function closeModal () {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    // Reset after animation
    setTimeout(() => {
      formEl.style.display = '';
      successEl.classList.remove('visible');
    }, 320);
  }

  bookTriggers.forEach(btn => btn && btn.addEventListener('click', openModal));
  closeBtn && closeBtn.addEventListener('click', closeModal);
  successClose && successClose.addEventListener('click', closeModal);

  overlay && overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  // ─── FORM SUBMISSION ─────────────────────────────────────────────
  submitBtn && submitBtn.addEventListener('click', function () {
    const fName  = document.getElementById('fName').value.trim();
    const lName  = document.getElementById('lName').value.trim();
    const fEmail = document.getElementById('fEmail').value.trim();
    const fDept  = document.getElementById('fDept').value;
    const fDate  = document.getElementById('fDate').value;
    const fTime  = document.getElementById('fTime').value;

    // Simple validation
    const required = [
      { el: document.getElementById('fName'),  val: fName  },
      { el: document.getElementById('lName'),  val: lName  },
      { el: document.getElementById('fEmail'), val: fEmail },
      { el: document.getElementById('fDept'),  val: fDept  },
      { el: document.getElementById('fDate'),  val: fDate  },
      { el: document.getElementById('fTime'),  val: fTime  },
    ];

    let valid = true;
    required.forEach(({ el, val }) => {
      if (!val) {
        valid = false;
        el.style.borderColor = '#f87171';
        el.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.2)';
        el.addEventListener('input', function () {
          el.style.borderColor = '';
          el.style.boxShadow = '';
        }, { once: true });
      }
    });

    if (!valid) {
      submitBtn.classList.add('shake');
      setTimeout(() => submitBtn.classList.remove('shake'), 500);
      return;
    }

    // Email format check
    if (!/\S+@\S+\.\S+/.test(fEmail)) {
      const emailEl = document.getElementById('fEmail');
      emailEl.style.borderColor = '#f87171';
      emailEl.style.boxShadow = '0 0 0 3px rgba(248,113,113,0.2)';
      return;
    }

    // Success
    formEl.style.display = 'none';
    successEl.classList.add('visible');
    showToast(`✅ Booking confirmed for ${fName} ${lName}!`);
  });

  // ─── TOAST NOTIFICATION ──────────────────────────────────────────
  function showToast (message) {
    const toast = document.createElement('div');
    toast.className = 'mv-toast';
    toast.textContent = message;
    Object.assign(toast.style, {
      position:   'fixed',
      bottom:     '2rem',
      left:       '50%',
      transform:  'translateX(-50%) translateY(20px)',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      padding:    '1rem 2.2rem',
      borderRadius: '60px',
      fontWeight: '600',
      color:      '#083344',
      boxShadow:  '0 16px 40px -8px rgba(8,51,68,0.3), 0 0 0 1.5px rgba(26,156,181,0.3)',
      zIndex:     '9999',
      transition: 'opacity 0.4s, transform 0.4s',
      opacity:    '0',
      fontFamily: "'DM Sans', sans-serif",
      fontSize:   '0.95rem',
      whiteSpace: 'nowrap',
    });
    document.body.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 450);
    }, 3000);
  }

  // ─── SHAKE ANIMATION ─────────────────────────────────────────────
  const shakeStyle = document.createElement('style');
  shakeStyle.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-8px)}
      40%{transform:translateX(8px)}
      60%{transform:translateX(-5px)}
      80%{transform:translateX(5px)}
    }
    .shake { animation: shake 0.45s ease; }
  `;
  document.head.appendChild(shakeStyle);

  // ─── 3D TILT (hero cards) ─────────────────────────────────────────
  let tiltEnabled = window.innerWidth >= 900;

  window.addEventListener('resize', () => {
    tiltEnabled = window.innerWidth >= 900;
    if (!tiltEnabled && heroCards) {
      heroCards.style.transform = 'none';
    }
  });

  document.addEventListener('mousemove', function (e) {
    if (!tiltEnabled || !heroCards) return;
    const rx = (e.clientX / window.innerWidth  - 0.5) * 6;
    const ry = (e.clientY / window.innerHeight - 0.5) * -5;
    heroCards.style.transform = `rotateY(${-4 + rx}deg) rotateX(${4 + ry}deg)`;
  });

  // ─── NAVBAR SCROLL ───────────────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 60) {
      navbar.style.background = 'rgba(255,255,255,0.95)';
      navbar.style.boxShadow  = '0 6px 24px rgba(8,51,68,0.12)';
    } else {
      navbar.style.background = 'rgba(255,255,255,0.75)';
      navbar.style.boxShadow  = '0 4px 20px rgba(8,51,68,0.08)';
    }
  }, { passive: true });

  // ─── HAMBURGER / MOBILE MENU ──────────────────────────────────────
  hamburger && hamburger.addEventListener('click', function () {
    mobileMenu.classList.toggle('open');
  });

  // Close mobile menu on link click
  mobileMenu && mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });

  // ─── SCROLL REVEAL ───────────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.service-card, .doc-card, .wv-card, .section-h2, .section-label, .why-desc, .why-list, .cs-item, .trust-strip'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 70}ms`;
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

  // ─── DOCTOR CARD — pre-fill specialty on book click ──────────────
  document.querySelectorAll('.doc-card').forEach(card => {
    const bookBtn = card.querySelector('.doc-book-btn');
    const docName = card.querySelector('h4')?.textContent.trim();
    bookBtn && bookBtn.addEventListener('click', function () {
      openModal();
      if (docName) {
        setTimeout(() => {
          const docSelect = document.getElementById('fDoc');
          if (docSelect) {
            [...docSelect.options].forEach(opt => {
              if (opt.text === docName) docSelect.value = opt.value;
            });
          }
        }, 50);
      }
    });
  });

  // ─── SMOOTH ANCHOR LINKS ─────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();
