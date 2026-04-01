/* ══════════════════════════════════════════════════
   JOBEY — Interactive Animations & UX Script
══════════════════════════════════════════════════ */

/* ── Custom Cursor ─────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Expand cursor on interactive elements
const hoverTargets = 'a, button, .svc-card, .step-card, .cc, .acc-btn, .dl-btn, .strip-btn';
document.querySelectorAll(hoverTargets).forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ── Hamburger Mobile Menu ─────────────────────────── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');
const menuOverlay = document.getElementById('menu-overlay');
const mobileClose = document.getElementById('mobile-close');
const mobLinks    = document.querySelectorAll('.mob-link, .mob-cta');

function openMenu() {
  mobileMenu .classList.add('open');
  menuOverlay.classList.add('visible');
  hamburger  .classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu .classList.remove('open');
  menuOverlay.classList.remove('visible');
  hamburger  .classList.remove('is-open');
  document.body.style.overflow = '';
}

hamburger  ?.addEventListener('click', openMenu);
mobileClose?.addEventListener('click', closeMenu);
menuOverlay?.addEventListener('click', closeMenu);

// Close menu when a link is clicked
mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    closeMenu();
  });
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ── Back to Top Button ────────────────────────────── */
const btt = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    btt.classList.add('show');
  } else {
    btt.classList.remove('show');
  }
});

btt?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Inject floating blobs & scroll-progress bar ── */
document.body.insertAdjacentHTML('afterbegin', `
  <div id="scroll-progress"></div>
  <div class="blob blob-1"></div>
  <div class="blob blob-2"></div>
  <div class="blob blob-3"></div>
`);

/* ── Scroll progress bar ───────────────────────── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  progressBar.style.width = `${(scrolled / maxScroll) * 100}%`;
});

/* ── Navbar scroll effect ──────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.style.background = 'rgba(255,255,255,0.94)';
    navbar.style.boxShadow = '0 4px 32px rgba(80,60,200,0.14)';
  } else {
    navbar.style.background = 'rgba(255,255,255,0.75)';
    navbar.style.boxShadow = '0 4px 28px rgba(80,60,200,0.08)';
  }
});

/* ── Active nav link on scroll ─────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.remove('active-link');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active-link');
  });
});

/* ── Fade-up on scroll ─────────────────────────── */
const fadeTargets = document.querySelectorAll(
  '.step-card, .svc-card, .cc, .stat-box, .logo-brand, .th, .dl-btn'
);
fadeTargets.forEach(el => el.classList.add('fade-up'));

const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeTargets.forEach(el => fadeObserver.observe(el));

/* ── Animated stat counters ────────────────────── */
function countUp(el, end, isK, duration = 1600) {
  const startTime = performance.now();
  const update = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * end);
    el.textContent = isK ? `+${current}K` : `+${current}`;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isK ? `+${end}K` : `+${end}`;
  };
  requestAnimationFrame(update);
}

const statBoxes = document.querySelectorAll('.stat-box');
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      el.classList.add('pop');
      const numEl = el.querySelector('.stat-num');
      const raw = numEl.textContent.trim();
      const isK = raw.includes('K');
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      setTimeout(() => countUp(numEl, num, isK), 100);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
statBoxes.forEach(b => statObserver.observe(b));

/* ── Ripple on button click ────────────────────── */
function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}
document.querySelectorAll('.btn-pill-dark, .nav-cta, .dl-btn, .strip-btn').forEach(btn => {
  btn.addEventListener('click', addRipple);
});

/* ── 3D tilt on service cards ──────────────────── */
document.querySelectorAll('.svc-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 22;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -22;
    card.style.transform = `perspective(500px) rotateX(${y}deg) rotateY(${x}deg) translateY(-6px) scale(1.04)`;
    card.style.transition = 'transform 0.1s';
    card.style.boxShadow = '0 20px 45px rgba(0,0,0,0.13)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
    card.style.boxShadow = '';
  });
});

/* ── Parallax blobs on mouse move ──────────────── */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;
  const b1 = document.querySelector('.blob-1');
  const b2 = document.querySelector('.blob-2');
  const b3 = document.querySelector('.blob-3');
  if (b1) b1.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
  if (b2) b2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
  if (b3) b3.style.transform = `translate(${x * 0.3}px, ${y * 0.6}px)`;
});

/* ── Smooth scroll for all anchor links ────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Logo click → scroll to top ─────────────────── */
const logoEl = document.getElementById('nav-logo');
if (logoEl) {
  logoEl.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Tooltip data-tip on service cards ─────────── */
const tips = [
  'Smart algorithm at work',
  'Aadhaar OTP verified users',
  'Find gigs near your location',
  'Track all your earnings',
  'Safe & transparent payments'
];
document.querySelectorAll('.svc-card').forEach((card, i) => {
  if (tips[i]) card.setAttribute('data-tip', tips[i]);
});

/* ── Step cards: number glow on hover ──────────── */
document.querySelectorAll('.step-card').forEach(card => {
  const num = card.querySelector('.step-num');
  card.addEventListener('mouseenter', () => {
    if (num) num.style.cssText = 'opacity:1; transform:scale(1.15); transition:all 0.25s;';
  });
  card.addEventListener('mouseleave', () => {
    if (num) num.style.cssText = 'opacity:0.7; transform:scale(1); transition:all 0.25s;';
  });
});

/* ── Terms list: highlight on hover ────────────── */
document.querySelectorAll('.terms-list li').forEach(li => {
  li.addEventListener('mouseenter', () => {
    li.style.color = '#111011';
    li.style.paddingLeft = '10px';
    li.style.transition = 'all 0.2s';
  });
  li.addEventListener('mouseleave', () => {
    li.style.color = '#333';
    li.style.paddingLeft = '4px';
  });
});

/* ── Contact cards: icon bounce on hover ───────── */
document.querySelectorAll('.cc').forEach(card => {
  const icon = card.querySelector('.cc-icon');
  card.addEventListener('mouseenter', () => {
    if (icon) {
      icon.style.transition = 'transform 0.3s cubic-bezier(0.22,1,0.36,1)';
      icon.style.transform = 'scale(1.3) rotate(-8deg)';
    }
  });
  card.addEventListener('mouseleave', () => {
    if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
  });
});

/* ── Privacy Policy Accordion ──────────────────────── */
document.querySelectorAll('.acc-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.acc-item');
    const isOpen = item.classList.contains('open');

    // Close ALL first (one-at-a-time behavior)
    document.querySelectorAll('.acc-item').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.acc-btn').setAttribute('aria-expanded', 'false');
    });

    // If it wasn't open, open it now
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');

      // Smooth scroll so panel is visible
      setTimeout(() => {
        item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
    }
  });
});

/* ── Footer nav: stagger reveal ────────────────────── */
const footerLinks = document.querySelectorAll('.footer-nav a');
footerLinks.forEach((link, i) => {
  link.style.opacity = '0';
  link.style.transform = 'translateY(10px)';
  link.style.transition = `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s`;
});
const footerObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      footerLinks.forEach(link => {
        link.style.opacity = '0.4';
        link.style.transform = 'translateY(0)';
      });
      footerObs.disconnect();
    }
  });
}, { threshold: 0.3 });
const footer = document.querySelector('.footer');
if (footer) footerObs.observe(footer);
