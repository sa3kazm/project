const body = document.body;
const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.main-nav a, .footer-nav a, .hero-actions a, .logo');
const revealItems = document.querySelectorAll('.reveal');
const toTopButton = document.querySelector('.to-top');

// Mobile navigation keeps the header compact on small screens.
menuToggle.addEventListener('click', () => {
  const isOpen = body.classList.toggle('menu-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const targetId = link.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;

    event.preventDefault();
    const target = document.querySelector(targetId);
    if (!target) return;

    body.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    const offset = header.offsetHeight - 1;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Ховаємо хедер при скролі вниз, показуємо при скролі вгору
  if (currentScrollY > 120) {
    header.classList.toggle('header--hidden', currentScrollY > lastScrollY);
  } else {
    header.classList.remove('header--hidden');
  }
  lastScrollY = currentScrollY;

  toTopButton.classList.toggle('visible', currentScrollY > 650);
}, { passive: true });

toTopButton.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Gallery filtering and preview lightbox.
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxCaption = lightbox.querySelector('p');
const lightboxClose = document.querySelector('.lightbox-close');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;

    galleryItems.forEach((item) => {
      const shouldShow = filter === 'all' || item.dataset.category === filter;
      item.hidden = !shouldShow;
    });
  });
});

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const image = item.querySelector('img');
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = item.dataset.title;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});

// Review slider supports autoplay, dots and manual controls.
const reviewTrack = document.querySelector('.review-track');
const reviewCards = Array.from(document.querySelectorAll('.review-card'));
const prevReview = document.querySelector('.prev-review');
const nextReview = document.querySelector('.next-review');
const dotsWrap = document.querySelector('.slider-dots');
let reviewIndex = 0;
let reviewTimer;

reviewCards.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.setAttribute('aria-label', `Відгук ${index + 1}`);
  dot.addEventListener('click', () => showReview(index, true));
  dotsWrap.appendChild(dot);
});

const dots = Array.from(dotsWrap.children);

function showReview(index, restart = false) {
  reviewIndex = (index + reviewCards.length) % reviewCards.length;
  reviewTrack.style.transform = `translateX(-${reviewIndex * 100}%)`;
  dots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === reviewIndex));

  if (restart) {
    clearInterval(reviewTimer);
    startReviewAutoplay();
  }
}

function startReviewAutoplay() {
  reviewTimer = setInterval(() => showReview(reviewIndex + 1), 5200);
}

prevReview.addEventListener('click', () => showReview(reviewIndex - 1, true));
nextReview.addEventListener('click', () => showReview(reviewIndex + 1, true));
showReview(0);
startReviewAutoplay();