const visual = document.querySelector('.hero-visual');
const content = document.querySelector('.hero-copy');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');

if (!motionPreference.matches) {
  content?.animate?.(
    [
      { opacity: 0, translate: '0 18px' },
      { opacity: 1, translate: '0 0' },
    ],
    { duration: 650, easing: 'cubic-bezier(.2,.75,.25,1)', fill: 'both' },
  );

  const playArtworkEntrance = () => {
    if (!visual || visual.classList.contains('is-entered')) return;
    visual.classList.add('is-entered');

    const entrance = [
      ['.hero-splash', 80],
      ['.hero-leaves', 210],
      ['.hero-juice', 330],
      ['.hero-orange', 450],
      ['.hero-strawberry', 560],
      ['.hero-kiwi', 670],
    ];

    entrance.forEach(([selector, delay]) => {
      visual.querySelector(selector)?.animate?.(
        [
          { opacity: 0, translate: '0 34px', scale: '.88' },
          { opacity: 1, translate: '0 0', scale: '1' },
        ],
        {
          delay,
          duration: 820,
          easing: 'cubic-bezier(.16,.8,.24,1)',
          fill: 'both',
        },
      );
    });
  };

  if (visual && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('demo-motion-ready');
    const artworkObserver = new IntersectionObserver((entries, observer) => {
      if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.35)) {
        observer.disconnect();
        playArtworkEntrance();
      }
    }, { threshold: [0.35] });
    artworkObserver.observe(visual);
  } else {
    playArtworkEntrance();
  }

  if (visual && window.matchMedia('(pointer: fine)').matches) {
    let frame = 0;
    visual.addEventListener('pointermove', (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const bounds = visual.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        visual.style.setProperty('--float-x', `${x * -7}px`);
        visual.style.setProperty('--float-y', `${y * -5}px`);
        frame = 0;
      });
    });
    visual.addEventListener('pointerleave', () => {
      visual.style.setProperty('--float-x', '0px');
      visual.style.setProperty('--float-y', '0px');
    });
  }
}
