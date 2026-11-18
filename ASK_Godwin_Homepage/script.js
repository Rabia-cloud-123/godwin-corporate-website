// ASK Godwin Ltd homepage interactions
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.primary-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  menuButton?.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));

  // Highlight the current section in the navigation.
  const observedSections = document.querySelectorAll('main section[id], main section:not([id])');
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || !entry.target.id) return;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  observedSections.forEach(section => sectionObserver.observe(section));

  // Animate numerical indicators once they enter the viewport.
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const duration = 1000;
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(counter => countObserver.observe(counter));

  // Reveal elements as they scroll into view.
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // Preview testimonial controls: cycle through brand-approved placeholder statements.
  const testimonials = [
    'Your next chapter deserves thoughtful planning, reliable information and the confidence to take that first step.',
    'A global opportunity can begin with one clear question. We are here to help you explore what comes next.',
    'Travel, education and career ambitions are different journeys — your guidance should begin with your goals.'
  ];
  let testimonialIndex = 0;
  const quote = document.querySelector('.quote-text');
  const quoteCount = document.querySelector('.quote-count');
  const updateQuote = direction => {
    testimonialIndex = (testimonialIndex + direction + testimonials.length) % testimonials.length;
    quote.textContent = testimonials[testimonialIndex];
    quoteCount.textContent = `0${testimonialIndex + 1} / 0${testimonials.length}`;
  };
  document.querySelector('.slider-btn.prev')?.addEventListener('click', () => updateQuote(-1));
  document.querySelector('.slider-btn.next')?.addEventListener('click', () => updateQuote(1));

  document.getElementById('year').textContent = new Date().getFullYear();

  // Close the mobile menu when Escape is pressed.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.focus();
    }
  });
});
