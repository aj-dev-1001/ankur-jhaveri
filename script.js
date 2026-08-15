// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Fade-slide navigation
const slidesWrap = document.getElementById('slides');
const slides = Array.from(slidesWrap.querySelectorAll('.slide'));
const navLinks = document.querySelectorAll('[data-slide-link]');
const dotsWrap = document.getElementById('slideDots');

let current = 0;
let animating = false;
const TRANSITION_MS = 650;

slides.forEach((slide, i) => {
  const dot = document.createElement('button');
  dot.className = 'slide-dot';
  dot.setAttribute('aria-label', 'Go to ' + (slide.id || 'section ' + i));
  dot.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(dot);
});

const dots = Array.from(dotsWrap.querySelectorAll('.slide-dot'));

function render() {
  slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  navLinks.forEach((link) => {
    const targetId = link.getAttribute('href').slice(1);
    link.classList.toggle('active', slides[current] && slides[current].id === targetId);
  });
  history.replaceState(null, '', '#' + (slides[current] ? slides[current].id : ''));
}

function goTo(index) {
  if (animating || index === current || index < 0 || index >= slides.length) return;
  animating = true;
  current = index;
  render();
  setTimeout(() => { animating = false; }, TRANSITION_MS);
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

// Wheel navigation
let wheelCooldown = false;
window.addEventListener('wheel', (e) => {
  if (wheelCooldown) return;
  if (Math.abs(e.deltaY) < 10) return;
  wheelCooldown = true;
  if (e.deltaY > 0) next(); else prev();
  setTimeout(() => { wheelCooldown = false; }, TRANSITION_MS + 100);
}, { passive: true });

// Touch navigation
let touchStartY = 0;
slidesWrap.addEventListener('touchstart', (e) => {
  touchStartY = e.touches[0].clientY;
}, { passive: true });

slidesWrap.addEventListener('touchend', (e) => {
  const delta = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(delta) < 50) return;
  if (delta > 0) next(); else prev();
}, { passive: true });

// Keyboard navigation
window.addEventListener('keydown', (e) => {
  if (['ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); next(); }
  else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); prev(); }
  else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
  else if (e.key === 'End') { e.preventDefault(); goTo(slides.length - 1); }
});

// Nav link clicks
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const index = slides.findIndex((s) => s.id === targetId);
    if (index !== -1) goTo(index);
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Initial slide from hash
const initialId = window.location.hash.slice(1);
const initialIndex = slides.findIndex((s) => s.id === initialId);
current = initialIndex !== -1 ? initialIndex : 0;
render();
