/* ==========================================
   NATIONAL FILINGS — script.js
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ---- HAMBURGER MENU ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.cssText = 'transform: rotate(45deg) translate(5px, 5px)';
      spans[1].style.cssText = 'opacity: 0';
      spans[2].style.cssText = 'transform: rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => s.style.cssText = '');
    }
  });

  // Close nav on link click
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => s.style.cssText = '');
    });
  });

  /* ---- SCROLL ANIMATIONS ---- */
  const animEls = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || '0');
        setTimeout(() => el.classList.add('is-visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  animEls.forEach(el => observer.observe(el));

  /* ---- HERO STATS — trigger immediately ---- */
  document.querySelectorAll('.stat-item').forEach((el, i) => {
    setTimeout(() => el.classList.add('is-visible'), 800 + i * 120);
  });

  /* ---- TESTIMONIAL SLIDER ---- */
  const track = document.getElementById('tTrack');
  const cards = track ? track.querySelectorAll('.testimonial-card') : [];
  const tWrap = track?.parentElement;
  let tIndex = 0;

  function getCardsVisible() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function tMaxIndex() {
    const n = Math.min(cards.length, getCardsVisible());
    return Math.max(0, cards.length - n);
  }

  function updateSlider() {
    if (!track || !tWrap || !cards.length) return;
    const wrapW = tWrap.offsetWidth;
    const gap = 20;
    const visible = getCardsVisible();
    const n = Math.min(cards.length, visible);
    const singleCard = n > 0 ? (wrapW - gap * (n - 1)) / n : wrapW;

    cards.forEach((card) => {
      card.style.flex = `0 0 ${singleCard}px`;
      card.style.minWidth = `${singleCard}px`;
      card.style.width = `${singleCard}px`;
      card.style.maxWidth = `${singleCard}px`;
    });

    tIndex = Math.min(tIndex, tMaxIndex());
    const offset = tIndex * (singleCard + gap);
    track.style.transform = `translateX(-${offset}px)`;
  }

  document.getElementById('tNext')?.addEventListener('click', () => {
    const max = tMaxIndex();
    tIndex = tIndex >= max ? 0 : tIndex + 1;
    updateSlider();
  });
  document.getElementById('tPrev')?.addEventListener('click', () => {
    const max = tMaxIndex();
    tIndex = tIndex <= 0 ? max : tIndex - 1;
    updateSlider();
  });

  window.addEventListener('resize', updateSlider);
  window.addEventListener('orientationchange', () => {
    requestAnimationFrame(() => updateSlider());
  });

  /* Swipe on mobile */
  let tTouchStartX = 0;
  tWrap?.addEventListener(
    'touchstart',
    (e) => {
      tTouchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );
  tWrap?.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].screenX - tTouchStartX;
      if (Math.abs(dx) < 48) return;
      const max = tMaxIndex();
      if (dx < 0) {
        tIndex = tIndex >= max ? 0 : tIndex + 1;
      } else {
        tIndex = tIndex <= 0 ? max : tIndex - 1;
      }
      updateSlider();
    },
    { passive: true }
  );

  updateSlider();

  // Auto-advance disabled — manual navigation only

  /* ---- FAQ ACCORDION ---- */
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isOpen = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      // Toggle clicked
      if (!isOpen) item.classList.add('active');
    });
  });

  /* ---- FORM SUBMIT ---- */
  document.querySelectorAll('.form-submit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const form = btn.closest('.hero-form-card, .contact-form-card');
      if (!form) return;
      const name = form.querySelector('input[type="text"]')?.value?.trim();
      const phone = form.querySelector('input[type="tel"]')?.value?.trim();
      if (!name || !phone) {
        btn.textContent = '⚠ Fill required fields';
        btn.style.background = '#ff6b6b';
        btn.style.color = '#fff';
        setTimeout(() => {
          btn.textContent = 'Submit Your Details →';
          btn.style.background = '';
          btn.style.color = '';
        }, 2200);
        return;
      }
      // Clear form fields
      form.querySelectorAll('input').forEach(i => i.value = '');
      form.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
      // Show thank you screen
      showThankYou();
    });
  });

  /* ---- SMOOTH ANCHOR SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- COUNTER ANIMATION for stats ---- */
  // Simple number count-up effect on scroll
  function animateValue(el, start, end, duration) {
    let startTime = null;
    const isFloat = String(end).includes('.');
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const value = start + (end - start) * easeOut(progress);
      el.textContent = isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  /* ---- CARD HOVER RIPPLE ---- */
  document.querySelectorAll('.service-card, .why-card, .process-step').forEach(card => {
    card.addEventListener('mouseenter', function(e) {
      this.style.willChange = 'transform';
    });
    card.addEventListener('mouseleave', function() {
      this.style.willChange = 'auto';
    });
  });

  /* ---- THANK YOU VIEW TOGGLE ---- */
  function showThankYou() {
    const thank = document.getElementById('thankyou');
    if (!thank) return;
    document.querySelectorAll('section').forEach(sec => {
      if (sec.id === 'thankyou') {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.getElementById('backToHome')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('section').forEach(sec => {
      sec.style.display = '';
    });
    const hero = document.getElementById('hero');
    if (hero) {
      const top = hero.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });

});
