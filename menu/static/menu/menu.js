const searchInput = document.querySelector('#menu-search');
const clearButton = document.querySelector('.search button');
const categoryButtons = document.querySelectorAll('.category');
const groups = document.querySelectorAll('.menu-group');
const menuItems = document.querySelectorAll('.menu-item');
const emptyState = document.querySelector('.empty-state');
const resultCount = document.querySelector('.result-count strong');
const backToTop = document.querySelector('.back-to-top');
const hero = document.querySelector('.hero');
const heroArt = document.querySelector('.juice-art');
const persianNumber = new Intl.NumberFormat('fa-IR');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeCategory = 'همه';
let countAnimation = 0;
let scrollFrame = 0;
let currentVisibleCount = menuItems.length;

function animateCount(target) {
  const animationId = ++countAnimation;
  const start = currentVisibleCount;
  const duration = reducedMotion.matches ? 0 : 360;
  const startTime = performance.now();

  function update(now) {
    if (animationId !== countAnimation) return;
    const progress = duration ? Math.min((now - startTime) / duration, 1) : 1;
    const eased = 1 - (1 - progress) ** 3;
    resultCount.textContent = persianNumber.format(Math.round(start + (target - start) * eased));
    if (progress < 1) requestAnimationFrame(update);
    else currentVisibleCount = target;
  }

  requestAnimationFrame(update);
}

function playReveal(element, delay = 0) {
  if (reducedMotion.matches || !element.animate) return;
  element.animate(
    [
      { opacity: 0, scale: '.97' },
      { opacity: 1, scale: '1' },
    ],
    { duration: 520, delay, easing: 'cubic-bezier(.2,.75,.25,1)' },
  );
}

function filterMenu() {
  const query = searchInput.value.trim().toLocaleLowerCase('fa');
  let visibleItems = 0;

  groups.forEach((group) => {
    let groupItems = 0;
    group.querySelectorAll('.menu-item').forEach((item) => {
      const categoryMatches = activeCategory === 'همه' || group.dataset.category === activeCategory;
      const searchMatches = item.dataset.name.toLocaleLowerCase('fa').includes(query);
      const visible = categoryMatches && searchMatches;
      const wasHidden = item.hidden;

      item.hidden = !visible;
      if (visible) {
        groupItems += 1;
        if (wasHidden) playReveal(item, Math.min(groupItems * 24, 144));
      }
    });
    group.hidden = groupItems === 0;
    visibleItems += groupItems;
  });

  clearButton.classList.toggle('visible', Boolean(query));
  emptyState.hidden = visibleItems !== 0;
  animateCount(visibleItems);
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const previousButton = document.querySelector('.category.active');
    if (previousButton === button) return;
    previousButton?.classList.remove('active');
    previousButton?.setAttribute('aria-pressed', 'false');
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
    button.animate?.(
      [{ transform: 'scale(.94)' }, { transform: 'scale(1.04)' }, { transform: 'scale(1)' }],
      { duration: reducedMotion.matches ? 0 : 260, easing: 'cubic-bezier(.2,.8,.2,1)' },
    );
    activeCategory = button.dataset.category;
    filterMenu();
  });
});

searchInput.addEventListener('input', filterMenu);
clearButton.addEventListener('click', () => {
  searchInput.value = '';
  searchInput.focus();
  filterMenu();
});

function updateScrollUI() {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
  document.documentElement.style.setProperty('--page-progress', progress);
  backToTop.classList.toggle('visible', window.scrollY > window.innerHeight * 0.7);
  scrollFrame = 0;
}

window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollUI);
}, { passive: true });
updateScrollUI();

if (!reducedMotion.matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-revealed');
      if (entry.target.matches('.menu-group')) {
        entry.target.querySelectorAll('.menu-item').forEach((item, index) => {
          item.style.setProperty('--reveal-delay', `${Math.min(index * 48, 240)}ms`);
          item.classList.add('is-revealed');
        });
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

  document.querySelectorAll('.menu-heading, .menu-group, .visit-copy, .qr-ticket').forEach((element) => {
    element.classList.add('motion-reveal');
    revealObserver.observe(element);
  });

  menuItems.forEach((item) => item.classList.add('motion-card'));

  window.addEventListener('load', () => {
    const heroCopy = document.querySelector('.hero-copy');
    heroCopy?.animate?.(
      [
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 720, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'both' },
    );
    heroArt?.animate?.(
      [{ opacity: 0, scale: '.97' }, { opacity: 1, scale: '1' }],
      { duration: 900, delay: 100, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'both' },
    );
  }, { once: true });
}

if (hero && heroArt && window.matchMedia('(pointer: fine)').matches && !reducedMotion.matches) {
  let pointerFrame = 0;
  hero.addEventListener('pointermove', (event) => {
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroArt.style.setProperty('--float-x', `${x * -10}px`);
      heroArt.style.setProperty('--float-y', `${y * -8}px`);
      pointerFrame = 0;
    });
  });
  hero.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--float-x', '0px');
    heroArt.style.setProperty('--float-y', '0px');
  });
}

menuItems.forEach((item) => {
  item.addEventListener('pointermove', (event) => {
    if (!window.matchMedia('(pointer: fine)').matches || reducedMotion.matches) return;
    const bounds = item.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    item.style.setProperty('--glow-x', `${x}%`);
    item.style.setProperty('--glow-y', `${y}%`);
  });
});

filterMenu();
