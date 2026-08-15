(function () {
  'use strict';

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn('[Alberto Navas]', name, 'failed:', e); }
  }

  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = pct + '%';
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initHeaderScroll() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 30) header.classList.add('is-scrolled');
      else header.classList.remove('is-scrolled');
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  function initMobileNav() {
    var toggle = document.querySelector('.nav-toggle');
    var panel = document.querySelector('.mobile-nav');
    if (!toggle || !panel) return;
    toggle.addEventListener('click', function () {
      var open = toggle.classList.toggle('is-open');
      panel.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    panel.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('is-open');
        panel.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  function initActiveNav() {
    var links = document.querySelectorAll('.main-nav a[href^="#"]');
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = document.getElementById(id);
      if (sec) sections.push({ link: a, sec: sec });
    });
    if (!sections.length || !('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var match = sections.find(function (s) { return s.sec === entry.target; });
        if (!match) return;
        if (entry.isIntersecting) {
          sections.forEach(function (s) { s.link.classList.remove('is-active'); });
          match.link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { obs.observe(s.sec); });
  }

  function initReveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (!items.length || !('IntersectionObserver' in window)) return;
    items.forEach(function (el) { el.classList.add('js-armed'); });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -80px 0px' });
    items.forEach(function (el) { obs.observe(el); });
    setTimeout(function () {
      items.forEach(function (el) { el.classList.add('is-visible'); });
    }, 6000);
  }

  function initHeroSplit() {
    var h1 = document.querySelector('.hero h1[data-split]');
    if (!h1) return;
    var lines = h1.innerHTML.split('<br>');
    h1.innerHTML = lines.map(function (line) {
      return '<span class="split-line" style="display:block;overflow:hidden;"><span class="split-inner" style="display:block; transform:translateY(110%); transition:transform 0.9s cubic-bezier(0.16,1,0.3,1);">' + line + '</span></span>';
    }).join('');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        var inners = h1.querySelectorAll('.split-inner');
        inners.forEach(function (el, i) {
          setTimeout(function () { el.style.transform = 'translateY(0)'; }, 180 + i * 140);
        });
      });
    });
  }

  function initPulseLine() {
    var path = document.getElementById('pulse-line');
    if (!path || typeof path.getTotalLength !== 'function') return;
    var length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    requestAnimationFrame(function () {
      path.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(0.16,1,0.3,1)';
      path.style.strokeDashoffset = '0';
    });
  }

  function initScrollAnimations() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.serv-chip').forEach(function (chip, i) {
      gsap.set(chip, { y: 16, opacity: 0.001 });
      gsap.to(chip, {
        y: 0, opacity: 1, duration: 0.5, delay: (i % 3) * 0.07, ease: 'power2.out',
        scrollTrigger: { trigger: chip, start: 'top 94%' }
      });
    });

    document.querySelectorAll('.proceso-step').forEach(function (step, i) {
      gsap.set(step, { x: -16, opacity: 0.001 });
      gsap.to(step, {
        x: 0, opacity: 1, duration: 0.6, delay: i * 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: step, start: 'top 92%' }
      });
    });

    document.querySelectorAll('.review-card').forEach(function (card, i) {
      gsap.set(card, { y: 22, opacity: 0.001 });
      gsap.to(card, {
        y: 0, opacity: 1, duration: 0.6, delay: i * 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: card, start: 'top 92%' }
      });
    });

    document.querySelectorAll('.feature-media img').forEach(function (img) {
      gsap.fromTo(img, { yPercent: -4 }, {
        yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  function initCardTilt() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    var cards = document.querySelectorAll('.serv-chip, .consulta-card');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(800px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    safe(initYear, 'initYear');
    safe(initScrollProgress, 'initScrollProgress');
    safe(initHeaderScroll, 'initHeaderScroll');
    safe(initMobileNav, 'initMobileNav');
    safe(initActiveNav, 'initActiveNav');
    safe(initReveal, 'initReveal');
    safe(initHeroSplit, 'initHeroSplit');
    safe(initPulseLine, 'initPulseLine');
    safe(initScrollAnimations, 'initScrollAnimations');
    safe(initCardTilt, 'initCardTilt');
  });
})();
