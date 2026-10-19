/* ============================================================
   J.A Quality Commercial Cleaning LLC — Main JS
   Vanilla JS, no frameworks
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky nav ── */
  const nav = document.querySelector('.site-nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Active nav link ── */
  const navLinks = document.querySelectorAll('.nav-links a, .nav-drawer a');
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  navLinks.forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Mobile hamburger ── */
  const toggle   = document.querySelector('.nav-toggle');
  const drawer   = document.querySelector('.nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('open');
      drawer.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on drawer link click
    drawer.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      })
    );
    // Close on outside click
    document.addEventListener('click', e => {
      if (!nav.contains(e.target) && !drawer.contains(e.target)) {
        toggle.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── Back to top ── */
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
    backTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );
  }

  /* ── FAQ Accordion ── */
  const accordionBtns = document.querySelectorAll('.accordion-btn');
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const panel  = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');

      // Close all in same group (optional: remove for multi-open)
      const group = btn.closest('.faq-col, .faq-grid') || document.body;
      group.querySelectorAll('.accordion-btn.open').forEach(b => {
        if (b !== btn) {
          b.classList.remove('open');
          b.nextElementSibling.classList.remove('open');
        }
      });

      btn.classList.toggle('open', !isOpen);
      panel.classList.toggle('open', !isOpen);
    });
  });

  /* ── Testimonials Carousel ── */
  const track    = document.querySelector('.testimonials-track');
  const slides   = document.querySelectorAll('.testimonial-slide');
  const prevBtn  = document.querySelector('.carousel-btn.prev');
  const nextBtn  = document.querySelector('.carousel-btn.next');
  const dots     = document.querySelectorAll('.dot');
  let   current  = 0;
  let   autoplay;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    if (track) track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (track && slides.length > 1) {
    if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
    dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));
    goTo(0);

    function startAuto() {
      autoplay = setInterval(() => goTo(current + 1), 6000);
    }
    function resetAuto() { clearInterval(autoplay); startAuto(); }
    startAuto();

    // Swipe support
    let touchStart = 0;
    track.addEventListener('touchstart', e => { touchStart = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = touchStart - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    });
  }

  /* ── Gallery Filter ── */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? 'block' : 'none';
        // Trigger reflow for animation
        if (show) {
          item.style.opacity = '0';
          item.style.transform = 'scale(.95)';
          setTimeout(() => {
            item.style.transition = 'opacity .4s ease, transform .4s ease';
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 20);
        }
      });
    });
  });

  /* ── Lightbox ── */
  const lightbox     = document.querySelector('.lightbox');
  const lightboxImg  = document.querySelector('.lightbox img');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox && lightboxImg) {
    document.querySelectorAll('.gallery-item[data-src]').forEach(item => {
      item.addEventListener('click', () => {
        lightboxImg.src = item.dataset.src;
        lightboxImg.alt = item.querySelector('.caption')?.textContent || '';
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  /* ── Welcome Audio ── */
  const audioBar  = document.querySelector('.audio-bar');
  const audioEl   = document.querySelector('#welcome-audio');
  const playAudioBtn = document.querySelector('.audio-btn');
  const dismissBtn   = document.querySelector('.audio-dismiss');

  if (audioBar && audioEl) {
    // Show audio bar after 2 s
    setTimeout(() => audioBar.classList.add('visible'), 2000);

    let playing = false;
    if (playAudioBtn) {
      playAudioBtn.addEventListener('click', () => {
        if (playing) {
          audioEl.pause();
          playAudioBtn.textContent = '▶';
          playing = false;
        } else {
          audioEl.play().catch(() => {});
          playAudioBtn.textContent = '⏸';
          playing = true;
        }
      });
    }
    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        audioBar.classList.remove('visible');
        audioEl.pause();
      });
    }
    audioEl.addEventListener('ended', () => {
      playing = false;
      if (playAudioBtn) playAudioBtn.textContent = '▶';
    });
  }

  /* ── Scroll Reveal ── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  }

  /* ── Counter animation ── */
  const counters = document.querySelectorAll('.count-up');
  if (counters.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el    = e.target;
          const end   = parseInt(el.dataset.target, 10);
          const dur   = 1800;
          const step  = 16;
          const inc   = end / (dur / step);
          let   cur   = 0;
          const tick  = () => {
            cur = Math.min(cur + inc, end);
            el.textContent = Math.floor(cur).toLocaleString() + (el.dataset.suffix || '');
            if (cur < end) setTimeout(tick, step);
          };
          tick();
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => obs.observe(el));
  }

  /* ── Form handling (mailto fallback) ── */
  document.querySelectorAll('form[data-contact]').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const data = new FormData(form);
      const name    = data.get('name') || '';
      const email   = data.get('email') || '';
      const subject = data.get('subject') || 'Website Enquiry';
      const message = data.get('message') || '';

      const mailto = `mailto:info@jaqualitycleaning.com`
        + `?subject=${encodeURIComponent(subject)}`
        + `&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

      window.location.href = mailto;

      // Show feedback
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = 'Opening your email app…';
        btn.disabled = true;
        setTimeout(() => { btn.textContent = orig; btn.disabled = false; }, 3000);
      }
    });
  });

})();
