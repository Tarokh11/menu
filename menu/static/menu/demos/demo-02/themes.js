(() => {
  const buttons = [...document.querySelectorAll('.theme-choice')];
  const status = document.querySelector('.theme-status');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const storageKey = 'vita-color-theme';
  function setTheme(theme, announce = false) {
    const selected = buttons.find(button => button.dataset.colorTheme === theme);
    if (!selected) return;
    document.body.dataset.colorTheme = theme;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
    themeMeta?.setAttribute('content', getComputedStyle(document.body).getPropertyValue('--theme-accent').trim());
    if (announce) status.textContent = `تم ${selected.textContent.trim()} انتخاب شد`;
  }
  try { setTheme(localStorage.getItem(storageKey) || 'blue'); } catch { setTheme('blue'); }
  buttons.forEach(button => button.addEventListener('click', () => {
    const theme = button.dataset.colorTheme;
    setTheme(theme, true);
    try { localStorage.setItem(storageKey, theme); } catch { /* Theme switching works without storage. */ }
  }));
})();


(() => {
  const cards = [...document.querySelectorAll('.menu-item[data-product-id]')];
  const filterButton = document.querySelector('.favorites-filter');
  const dialog = document.querySelector('.product-dialog');
  const status = document.querySelector('.interaction-status');
  const storageKey = 'vita-favorite-drinks';
  const knownIds = new Set(cards.map(card => card.dataset.productId));
  let favorites = new Set();
  let currentCard = null;
  let opener = null;
  let announcementTimer;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (Array.isArray(saved)) favorites = new Set(saved.filter(id => knownIds.has(id)));
  } catch { /* Favorites remain available for this visit. */ }

  function syncFavorites() {
    cards.forEach(card => {
      const saved = favorites.has(card.dataset.productId);
      const button = card.querySelector('.item-favorite');
      card.dataset.favorite = String(saved);
      button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', `${saved ? 'حذف از علاقه‌مندی‌ها:' : 'ذخیرهٔ'} ${card.querySelector('h3').textContent}`);
      button.querySelector('span').textContent = saved ? '♥' : '♡';
    });
    document.querySelector('.favorites-count').textContent = new Intl.NumberFormat('fa-IR').format(favorites.size);
    if (currentCard) {
      const saved = favorites.has(currentCard.dataset.productId);
      dialog.querySelector('.dialog-favorite').setAttribute('aria-pressed', String(saved));
      dialog.querySelector('.dialog-favorite').textContent = saved ? '♥ حذف از علاقه‌مندی‌ها' : '♡ ذخیره در علاقه‌مندی‌ها';
    }
  }

  function toggleFavorite(card) {
    const id = card.dataset.productId;
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    try { localStorage.setItem(storageKey, JSON.stringify([...favorites])); } catch { /* Storage can be unavailable. */ }
    syncFavorites();
    document.dispatchEvent(new CustomEvent('vita:favorites-changed'));
    clearTimeout(announcementTimer);
    status.textContent = `${card.querySelector('h3').textContent} ${favorites.has(id) ? 'ذخیره شد' : 'از علاقه‌مندی‌ها حذف شد'}`;
    status.classList.add('visible');
    announcementTimer = setTimeout(() => status.classList.remove('visible'), 2400);
  }

  cards.forEach(card => {
    card.querySelector('.item-favorite').addEventListener('click', (event) => {
      toggleFavorite(card);
      if (card.hidden) filterButton.focus();
    });
    card.querySelector('.item-details').addEventListener('click', (event) => {
      currentCard = card;
      opener = event.currentTarget;
      dialog.querySelector('#product-title').textContent = card.querySelector('h3').textContent;
      dialog.querySelector('#product-description').textContent = card.querySelector('p').textContent;
      dialog.querySelector('.product-category').textContent = card.closest('.menu-group').dataset.category;
      dialog.querySelector('.product-dialog-price strong').textContent = card.querySelector('.price strong').textContent;
      syncFavorites();
      dialog.showModal();
      document.body.classList.add('product-dialog-open');
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.dialog-favorite').addEventListener('click', () => toggleFavorite(currentCard));
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('product-dialog-open');
    (currentCard?.hidden ? filterButton : opener)?.focus();
  });
  filterButton.addEventListener('click', () => {
    const active = filterButton.getAttribute('aria-pressed') !== 'true';
    filterButton.setAttribute('aria-pressed', String(active));
    document.dispatchEvent(new CustomEvent('vita:favorites-filter', { detail: active }));
  });
  document.addEventListener('vita:reset-favorites', () => {
    filterButton.setAttribute('aria-pressed', 'false');
    document.dispatchEvent(new CustomEvent('vita:favorites-filter', { detail: false }));
  });
  syncFavorites();
})();
