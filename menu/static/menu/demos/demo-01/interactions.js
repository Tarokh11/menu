const visual = document.querySelector('.hero-visual');
const content = document.querySelector('.hero-copy');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!motionPreference.matches) {
  window.addEventListener('load', () => {
    content?.animate?.(
      [
        { opacity: 0, transform: 'translateY(18px)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration: 640, easing: 'cubic-bezier(.2,.75,.25,1)' },
    );
    visual?.animate?.(
      [{ opacity: 0, scale: '.97' }, { opacity: 1, scale: '1' }],
      { duration: 780, delay: 80, easing: 'cubic-bezier(.2,.75,.25,1)' },
    );
  }, { once: true });

  if (visual && window.matchMedia('(pointer: fine)').matches) {
    let frame = 0;
    visual.addEventListener('pointermove', (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = visual.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        visual.style.setProperty('--float-x', `${x * -8}px`);
        visual.style.setProperty('--float-y', `${y * -6}px`);
        frame = 0;
      });
    });
    visual.addEventListener('pointerleave', () => {
      visual.style.setProperty('--float-x', '0px');
      visual.style.setProperty('--float-y', '0px');
    });
  }
}
