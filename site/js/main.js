// Navbar flyouts, mobile menu, marquee duplication.

document.addEventListener('DOMContentLoaded', () => {
  initFlyouts();
  initMobileNav();
  initMarquees();
  initProjectNavigation();
  initProjectReveal();
});

/* ---------- Flyout dropdowns (hover on desktop, click/keyboard everywhere) ---------- */
function initFlyouts() {
  const flyouts = document.querySelectorAll('[data-flyout]');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const setOpen = (flyout, open) => {
    flyout.dataset.open = String(open);
    flyout.querySelector('[data-flyout-button]').setAttribute('aria-expanded', String(open));
  };
  const closeAll = (except) => flyouts.forEach((f) => f !== except && setOpen(f, false));

  flyouts.forEach((flyout) => {
    const button = flyout.querySelector('[data-flyout-button]');

    button.addEventListener('click', () => {
      const open = flyout.dataset.open !== 'true';
      closeAll(flyout);
      setOpen(flyout, open);
    });

    if (canHover) {
      flyout.addEventListener('mouseenter', () => {
        closeAll(flyout);
        setOpen(flyout, true);
      });
      flyout.addEventListener('mouseleave', () => setOpen(flyout, false));
    }

    flyout.addEventListener('focusout', (e) => {
      if (!flyout.contains(e.relatedTarget)) setOpen(flyout, false);
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-flyout]')) closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('[data-flyout][data-open="true"]');
    closeAll();
    open?.querySelector('[data-flyout-button]').focus();
  });
}

/* ---------- Mobile navigation ---------- */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const panel = document.getElementById('mobile-nav');
  if (!toggle || !panel) return;

  const setOpen = (open) => {
    panel.dataset.open = String(open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('[data-icon="open"]').classList.toggle('hidden', open);
    toggle.querySelector('[data-icon="close"]').classList.toggle('hidden', !open);
  };

  toggle.addEventListener('click', () => setOpen(panel.dataset.open !== 'true'));
  panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  window.matchMedia('(min-width: 768px)').addEventListener('change', (e) => e.matches && setOpen(false));
}

/* ---------- Marquee: clone the track so the loop is seamless ---------- */
function initMarquees() {
  document.querySelectorAll('.marquee').forEach((marquee) => {
    const track = marquee.querySelector('.marquee-track');
    const copies = Number(marquee.dataset.copies || 1);
    for (let i = 0; i < copies; i++) {
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.inert = true;
      marquee.appendChild(clone);
    }
  });
}

/* ---------- Project links: smooth scrolling and target feedback ---------- */
function initProjectNavigation() {
  const projectLinks = document.querySelectorAll(
    'a[href^="#project-"], a[href="#toy-projects"], a[href="#showcase"]',
  );
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  projectLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      event.preventDefault();
      closeMobileNavigation();
      target.scrollIntoView({
        behavior: reducedMotion.matches ? 'auto' : 'smooth',
        block: 'start',
      });

      window.history.replaceState(null, '', link.getAttribute('href'));
      target.classList.remove('is-targeted');
      window.requestAnimationFrame(() => target.classList.add('is-targeted'));
      window.setTimeout(() => target.classList.remove('is-targeted'), 1200);
    });
  });
}

function closeMobileNavigation() {
  const panel = document.getElementById('mobile-nav');
  const toggle = document.getElementById('nav-toggle');
  if (!panel || panel.dataset.open !== 'true') return;

  panel.dataset.open = 'false';
  toggle?.setAttribute('aria-expanded', 'false');
  toggle?.querySelector('[data-icon="open"]')?.classList.remove('hidden');
  toggle?.querySelector('[data-icon="close"]')?.classList.add('hidden');
  panel.querySelectorAll('details[open]').forEach((details) => {
    details.removeAttribute('open');
  });
}

/* ---------- Project sections: animate into view without hiding content ---------- */
function initProjectReveal() {
  const sections = document.querySelectorAll(
    '[id^="project-"], #toy-projects, #showcase',
  );
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
  );

  sections.forEach((section) => {
    section.classList.add('project-reveal-section');
    section.querySelectorAll(':scope > div > *').forEach((item, index) => {
      item.classList.add('project-reveal-item');
      item.style.animationDelay = `${Math.min(index * 100, 300)}ms`;
    });
    observer.observe(section);
  });
}
