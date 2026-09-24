const searchInput = document.querySelector('#menu-search');
const clearButton = document.querySelector('.search button');
const categoryButtons = document.querySelectorAll('.category');
const groups = document.querySelectorAll('.menu-group');
const emptyState = document.querySelector('.empty-state');
const resultCount = document.querySelector('.result-count strong');
const persianNumber = new Intl.NumberFormat('fa-IR');
let activeCategory = 'همه';

function normalizeSearch(value) {
  return value.toLocaleLowerCase('fa').replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/[\s\u200c]+/g, ' ').trim();
}

function filterMenu() {
  const query = normalizeSearch(searchInput.value);
  let visibleItems = 0;

  groups.forEach((group) => {
    let groupItems = 0;
    group.querySelectorAll('.menu-item').forEach((item) => {
      const categoryMatches = activeCategory === 'همه' || group.dataset.category === activeCategory;
      const searchMatches = normalizeSearch(item.dataset.name).includes(query);
      const visible = categoryMatches && searchMatches;
      item.hidden = !visible;
      if (visible) groupItems += 1;
    });
    group.hidden = groupItems === 0;
    visibleItems += groupItems;
  });

  clearButton.classList.toggle('visible', Boolean(query));
  emptyState.hidden = visibleItems !== 0;
  resultCount.textContent = persianNumber.format(visibleItems);
}

categoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const previousButton = document.querySelector('.category.active');
    previousButton.classList.remove('active');
    previousButton.setAttribute('aria-pressed', 'false');
    button.classList.add('active');
    button.setAttribute('aria-pressed', 'true');
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

filterMenu();

document.querySelector('#reset-filters').addEventListener('click', () => {
  searchInput.value = '';
  categoryButtons[0].click();
  searchInput.focus();
});
