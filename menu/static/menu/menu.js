document.querySelectorAll('.filter').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelector('.filter.active').classList.remove('active');
    button.classList.add('active');
    document.querySelectorAll('.dish').forEach((dish) => {
      dish.classList.toggle('hidden', button.dataset.category !== 'All' && dish.dataset.category !== button.dataset.category);
    });
  });
});
