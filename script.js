const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
const closeBtn = document.querySelector('[data-nav-close]');
const announcement = document.getElementById('announcement');
const yearEl = document.getElementById('year');

const setNavState = (isOpen) => {
  if (!nav) return;
  nav.setAttribute('aria-hidden', String(!isOpen));
  document.body.classList.toggle('nav-open', isOpen);
  navToggle?.setAttribute('aria-expanded', String(isOpen));
  if (announcement) {
    announcement.textContent = isOpen ? 'Navigation menu opened' : 'Navigation menu closed';
  }
};

navToggle?.addEventListener('click', () => {
  const isOpen = nav.getAttribute('aria-hidden') === 'true';
  setNavState(isOpen);
});

closeBtn?.addEventListener('click', () => setNavState(false));

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setNavState(false));
});

// Initialize hidden state for mobile nav
if (nav && !nav.hasAttribute('aria-hidden')) {
  nav.setAttribute('aria-hidden', 'true');
}

// Set current year in footer
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}
