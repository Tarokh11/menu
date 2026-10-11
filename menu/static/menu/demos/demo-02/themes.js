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
    if (announce) {
      status.textContent = `تم ${selected.textContent.trim()} انتخاب شد`;
      document.dispatchEvent(new CustomEvent('vita:palette-changed'));
    }
  }
  try { setTheme(localStorage.getItem(storageKey) || 'blue'); } catch { setTheme('blue'); }
  buttons.forEach(button => button.addEventListener('click', () => {
    const theme = button.dataset.colorTheme;
    setTheme(theme, true);
    try { localStorage.setItem(storageKey, theme); } catch { /* Theme switching works without storage. */ }
  }));
})();

// Layered motion: the cup floats inside a scene that responds to pointer and scroll.
(() => {
  const hero = document.querySelector('.blue-hero');
  const scene = document.querySelector('.blue-product');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(pointer: fine)');
  const activeAnimations = new Set();
  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  let inView = true;

  function animate(element, frames, options) {
    if (motion.matches || !element?.animate) return;
    const animation = element.animate(frames, options);
    activeAnimations.add(animation);
    animation.finished.then(() => activeAnimations.delete(animation), () => activeAnimations.delete(animation));
  }
  function updateScene() {
    frame = 0;
    if (motion.matches || !inView) return;
    const rect = hero.getBoundingClientRect();
    const progress = Math.min(Math.max(-rect.top / rect.height, 0), 1);
    scene.style.setProperty('--scene-x', `${pointerX * 14}px`);
    scene.style.setProperty('--scene-y', `${pointerY * 10 + progress * 28}px`);
    scene.style.setProperty('--scene-roll', `${pointerX * -1.4}deg`);
  }
  function scheduleScene() {
    if (!frame && !motion.matches && inView) frame = requestAnimationFrame(updateScene);
  }
  hero.addEventListener('pointermove', event => {
    if (!finePointer.matches || motion.matches) return;
    const rect = hero.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - .5;
    pointerY = (event.clientY - rect.top) / rect.height - .5;
    scheduleScene();
  });
  hero.addEventListener('pointerleave', () => {
    pointerX = 0;
    pointerY = 0;
    scheduleScene();
  });
  window.addEventListener('scroll', scheduleScene, { passive: true });
  if ('IntersectionObserver' in window) {
    const visibility = new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      hero.classList.toggle('scene-paused', !inView);
      if (inView) scheduleScene();
    });
    visibility.observe(hero);
    const reveals = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        animate(entry.target, [{ opacity: .35, transform: 'translateY(22px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 650, easing: 'cubic-bezier(.2,.7,.2,1)' });
        observer.unobserve(entry.target);
      });
    }, { threshold: .08 });
    document.querySelectorAll('.menu-group, .visit').forEach(element => reveals.observe(element));
  }
  animate(document.querySelector('.hero-copy'), [{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 800, easing: 'cubic-bezier(.2,.7,.2,1)' });
  document.addEventListener('vita:palette-changed', () => {
    animate(document.querySelector('.product-float'), [{ scale: '1', rotate: '0deg' }, { scale: '1.035', rotate: '-2deg' }, { scale: '1', rotate: '0deg' }], { duration: 620, easing: 'cubic-bezier(.2,.7,.2,1)' });
  });
  motion.addEventListener('change', () => {
    if (motion.matches) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      activeAnimations.forEach(animation => animation.cancel());
      scene.style.setProperty('--scene-x', '0px');
      scene.style.setProperty('--scene-y', '0px');
      scene.style.setProperty('--scene-roll', '0deg');
    } else scheduleScene();
  });
})();
