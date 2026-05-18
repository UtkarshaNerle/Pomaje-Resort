/* ===========================
   POMAJE RESORT – CHIKUCHI WADI
   Main JavaScript
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- LOADING SCREEN ---- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.getElementById('hero').classList.add('loaded');
    }, 1600);
  });

  /* ---- NAVBAR ---- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('back-top').classList.toggle('show', window.scrollY > 300);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- DARK / LIGHT MODE ---- */
  const themeToggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme') || 'light';
  if (stored === 'dark') {
    document.body.classList.add('dark');
    themeToggle.textContent = '☀️';
  }
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  /* ---- SCROLL REVEAL ---- */
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.delay || 0;
        setTimeout(() => e.target.classList.add('visible'), delay);
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => revealObs.observe(el));

  /* ---- ANIMATED COUNTERS ---- */
  const counters = document.querySelectorAll('.counter-num');
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { start = target; clearInterval(timer); }
          el.textContent = Math.floor(start) + suffix;
        }, 28);
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObs.observe(el));

  /* ---- LIGHTBOX ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');

  document.querySelectorAll('.gallery-item img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src.replace('w=400', 'w=1200');
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  [lightboxClose, lightbox].forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightboxClose) {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  /* ---- RAIN ANIMATION ---- */
  const canvas = document.getElementById('rain-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let drops = [];
    const RAIN_COUNT = 120;

    function resizeCanvas() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function createDrop() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * -1,
        len: Math.random() * 20 + 8,
        speed: Math.random() * 4 + 2,
        opacity: Math.random() * 0.5 + 0.2,
        width: Math.random() * 0.8 + 0.3
      };
    }
    for (let i = 0; i < RAIN_COUNT; i++) drops.push(createDrop());

    function animateRain() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drops.forEach(drop => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x - 1, drop.y + drop.len);
        ctx.strokeStyle = `rgba(180,230,200,${drop.opacity})`;
        ctx.lineWidth = drop.width;
        ctx.stroke();
        drop.y += drop.speed;
        drop.x -= 0.5;
        if (drop.y > canvas.height + drop.len) Object.assign(drop, createDrop(), { y: -drop.len });
      });
      requestAnimationFrame(animateRain);
    }
    animateRain();
  }

  /* ---- PARALLAX HERO ---- */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `scale(1) translateY(${scrolled * 0.3}px)`;
      }
    });
  }

  /* ---- SMOOTH ACTIVE NAV LINKS ---- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => activeObs.observe(s));

  /* ---- BACK TO TOP ---- */
  document.getElementById('back-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ================================================
     BOOKING FORM — Sends data via:
       1. WhatsApp message to resort phone
       2. Email via EmailJS (configure YOUR keys below)
     ================================================ */

  // ── CONFIG ── Fill these in ──────────────────────
  const RESORT_WHATSAPP = '919359118151';   // WhatsApp number (with country code, no +)
  const EMAILJS_SERVICE  = 'YOUR_SERVICE_ID';  // from emailjs.com dashboard
  const EMAILJS_TEMPLATE = 'YOUR_TEMPLATE_ID'; // from emailjs.com dashboard
  const EMAILJS_PUBLIC   = 'YOUR_PUBLIC_KEY';  // from emailjs.com dashboard
  // ────────────────────────────────────────────────

  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = bookingForm.querySelector('.form-submit');

      // Collect all field values
      const fields = bookingForm.querySelectorAll('input, select, textarea');
      const labels = bookingForm.querySelectorAll('label');
      const data   = {};
      fields.forEach((field, i) => {
        const label = labels[i] ? labels[i].textContent.replace('*','').trim() : `Field ${i+1}`;
        data[label] = field.value || '—';
      });

      // ── 1. WHATSAPP ──────────────────────────────
      const waLines = [
        '🌿 *New Booking Request — Pomaje Resort*',
        '━━━━━━━━━━━━━━━━━━━━',
        ...Object.entries(data).map(([k,v]) => `*${k}:* ${v}`),
        '━━━━━━━━━━━━━━━━━━━━',
        '📅 Received: ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      ];
      const waURL = `https://wa.me/${RESORT_WHATSAPP}?text=${encodeURIComponent(waLines.join('\n'))}`;

      // ── 2. EMAILJS (optional — only fires if keys are set) ───
      let emailSent = false;
      if (EMAILJS_SERVICE !== 'YOUR_SERVICE_ID' && typeof emailjs !== 'undefined') {
        try {
          btn.textContent = '⏳ Sending…';
          btn.disabled = true;
          await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
            from_name    : data['Full Name']    || data['Full Name *']    || 'Guest',
            phone        : data['Phone Number'] || data['Phone Number *'] || '—',
            visit_date   : data['Visit Date']   || data['Visit Date *']   || '—',
            guests       : data['Number of Guests'] || '—',
            package      : data['Package']      || '—',
            occasion     : data['Special Occasion'] || '—',
            message      : data['Special Requests / Message'] || '—',
            booking_time : new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
          }, EMAILJS_PUBLIC);
          emailSent = true;
        } catch(err) {
          console.warn('EmailJS error:', err);
        }
      }

      // ── Show success modal, then open WhatsApp ───
      btn.textContent    = '✅ Booking Sent!';
      btn.disabled       = true;
      btn.style.background = '#4a9a6a';
      showBookingConfirm(data, waURL, emailSent);

      setTimeout(() => {
        btn.textContent    = 'Confirm Booking';
        btn.disabled       = false;
        btn.style.background = '';
        bookingForm.reset();
      }, 5000);
    });
  }

  /* ---- CONTACT FORM — same WhatsApp + EmailJS ---- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn  = contactForm.querySelector('.contact-form-submit');
      const inputs = contactForm.querySelectorAll('input, textarea');
      const name  = inputs[0]?.value || 'Guest';
      const phone = inputs[1]?.value || '—';
      const msg   = inputs[2]?.value || '—';

      const waText = [
        '💬 *New Message — Pomaje Resort Website*',
        '━━━━━━━━━━━━━━━━━━━━',
        `*Name:* ${name}`,
        `*Phone:* ${phone}`,
        `*Message:* ${msg}`,
        '━━━━━━━━━━━━━━━━━━━━',
        '📅 ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      ].join('\n');

      window.open(`https://wa.me/${RESORT_WHATSAPP}?text=${encodeURIComponent(waText)}`, '_blank');

      btn.textContent = '✅ Message Sent!';
      btn.style.background = '#4a9a6a';
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        contactForm.reset();
      }, 3500);
    });
  }

  /* ---- BOOKING CONFIRMATION MODAL ---- */
  function showBookingConfirm(data, waURL, emailSent) {
    const overlay = document.createElement('div');
    overlay.id = 'booking-modal';
    overlay.style.cssText = `
      position:fixed;inset:0;z-index:9000;
      background:rgba(0,0,0,0.75);backdrop-filter:blur(6px);
      display:flex;align-items:center;justify-content:center;padding:20px;
      animation:fadeIn .3s ease;
    `;
    overlay.innerHTML = `
      <div style="
        background:#fff;border-radius:24px;padding:40px 36px;
        max-width:480px;width:100%;text-align:center;
        box-shadow:0 24px 80px rgba(0,0,0,0.4);
        animation:fadeInUp .4s ease;
      ">
        <div style="font-size:3rem;margin-bottom:12px;">🌿</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;
          color:#1e3d1e;margin-bottom:8px;">Booking Request Received!</h2>
        <p style="font-size:0.9rem;color:#666;line-height:1.6;margin-bottom:24px;">
          Thank you, <strong>${Object.values(data)[0]}</strong>!<br>
          We'll confirm your visit within <strong>24 hours</strong> on your WhatsApp/phone.
          ${emailSent ? '<br>✅ A confirmation email has also been sent.' : ''}
        </p>
        <a href="${waURL}" target="_blank" rel="noopener"
          style="display:inline-flex;align-items:center;gap:10px;
            background:#25D366;color:#fff;padding:13px 28px;
            border-radius:50px;font-weight:700;font-size:0.95rem;
            text-decoration:none;box-shadow:0 6px 20px rgba(37,211,102,.4);
            margin-bottom:14px;width:100%;justify-content:center;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Send via WhatsApp to Resort
        </a>
        <p style="font-size:0.75rem;color:#999;">
          Tapping the button above sends your booking details directly to our WhatsApp.
        </p>
        <button onclick="document.getElementById('booking-modal').remove()"
          style="margin-top:12px;padding:8px 24px;border-radius:50px;
            border:1.5px solid #ccc;background:none;cursor:pointer;
            font-size:0.85rem;color:#666;">
          Close
        </button>
      </div>
    `;
    document.body.appendChild(overlay);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.remove();
    });
  }

  /* ---- GALLERY FILTER (if needed in future) ---- */

  /* ---- STAGGER CHILDREN ---- */
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const children = parent.children;
    Array.from(children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`;
    });
  });

});
