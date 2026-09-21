const searchInput = document.querySelector('#menu-search');
const clearButton = document.querySelector('.search button');
const categoryButtons = document.querySelectorAll('.category');
const groups = document.querySelectorAll('.menu-group');
const emptyState = document.querySelector('.empty-state');
let activeCategory = 'همه';

function filterMenu() {
  const query = searchInput.value.trim().toLocaleLowerCase('fa');
  let visibleItems = 0;

  groups.forEach((group) => {
    let groupItems = 0;
    group.querySelectorAll('.menu-item').forEach((item) => {
      const categoryMatches = activeCategory === 'همه' || group.dataset.category === activeCategory;
      const searchMatches = item.dataset.name.toLocaleLowerCase('fa').includes(query);
      const visible = categoryMatches && searchMatches;
      item.hidden = !visible;
      if (visible) groupItems += 1;
    });
    group.hidden = groupItems === 0;
    visibleItems += groupItems;
  });

  clearButton.classList.toggle('visible', Boolean(query));
  emptyState.hidden = visibleItems !== 0;
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
