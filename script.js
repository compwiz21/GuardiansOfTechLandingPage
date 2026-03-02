/**
 * Guardians of Tech — Landing Page Scripts
 * Interactions: nav scroll state, reveal animations, AI log, mobile nav, form
 */

(function () {
  'use strict';

  /* ---- Sticky Nav ---- */
  const nav = document.getElementById('main-nav');
  const onScroll = () => {
    if (window.scrollY > 30) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile Nav ---- */
  const hamburger = document.getElementById('hamburger');
  const mobileNav  = document.getElementById('mobile-nav');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');

  const openMobileNav = () => {
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const closeMobileNav = () => {
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    if (mobileNav.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  mobileBackdrop.addEventListener('click', closeMobileNav);

  document.querySelectorAll('#mobile-nav a').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  /* ---- Scroll Reveal ---- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ---- Staggered Reveal ---- */
  const staggerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.querySelectorAll('.stagger-child');
          children.forEach((child, i) => {
            setTimeout(() => child.classList.add('revealed'), i * 100);
          });
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.stagger-parent').forEach(el => staggerObserver.observe(el));

  /* ---- Animated Counters ---- */
  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const decimals = el.dataset.decimals || 0;
    const duration = 1800;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = (target * eased).toFixed(decimals);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

  /* ---- AI Protection Log ---- */
  const logContainer = document.getElementById('ai-log');
  if (logContainer) {
    const logEntries = [
      { time: '00:00:01', type: 'INFO', cls: 'info', msg: 'Guardian Protection Layer — online' },
      { time: '00:00:03', type: 'OK',   cls: 'ok',   msg: 'Alert normalization engine started' },
      { time: '00:00:05', type: 'INFO', cls: 'info', msg: 'AI ticket triage ready — 0 queue' },
      { time: '00:00:07', type: 'OK',   cls: 'ok',   msg: 'Endpoint monitoring: 24 devices active' },
      { time: '00:00:12', type: 'ALERT',cls: 'alert',msg: 'Anomaly detected — workstation WRKSTN-07' },
      { time: '00:00:13', type: 'INFO', cls: 'info', msg: 'Auto-triage initiated — classifying threat' },
      { time: '00:00:14', type: 'OK',   cls: 'ok',   msg: 'Threat classified: unauthorized auth attempt' },
      { time: '00:00:15', type: 'BLOCK',cls: 'block',msg: 'Session blocked — isolating endpoint' },
      { time: '00:00:16', type: 'OK',   cls: 'ok',   msg: 'Remediation applied — endpoint secured' },
      { time: '00:00:18', type: 'INFO', cls: 'info', msg: 'Guardian Report entry logged' },
      { time: '00:00:20', type: 'OK',   cls: 'ok',   msg: 'Client notification dispatched' },
      { time: '00:00:22', type: 'OK',   cls: 'ok',   msg: 'Knowledge base auto-updated' },
      { time: '00:00:25', type: 'INFO', cls: 'info', msg: 'Status: Protected Circle — all systems nominal' },
    ];

    let entryIndex = 0;
    let intervalId = null;

    const appendLog = () => {
      if (entryIndex >= logEntries.length) {
        clearInterval(intervalId);
        setTimeout(() => {
          logContainer.innerHTML = '';
          entryIndex = 0;
          startLog();
        }, 4000);
        return;
      }

      const entry = logEntries[entryIndex++];
      const div = document.createElement('div');
      div.className = 'log-entry';
      div.innerHTML = `
        <span class="log-time">${entry.time}</span>
        <span class="log-type ${entry.cls}">[${entry.type}]</span>
        <span class="log-msg">${entry.msg}</span>
      `;
      logContainer.appendChild(div);
      logContainer.scrollTop = logContainer.scrollHeight;

      if (logContainer.children.length > 8) {
        logContainer.removeChild(logContainer.firstChild);
      }
    };

    const startLog = () => {
      intervalId = setInterval(appendLog, 700);
    };

    const logObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startLog();
            logObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    logObserver.observe(logContainer);
  }

  /* ---- AI Feature Tabs ---- */
  document.querySelectorAll('.ai-feature-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.ai-feature-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    });
  });

  /* ---- Contact Form ---- */
  const form = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      const origText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending…';

      setTimeout(() => {
        btn.disabled = false;
        btn.textContent = origText;
        form.reset();
        showToast('✅ Message sent! A Guardian will reach out within 24 hours.');
      }, 1200);
    });
  }

  const showToast = (message) => {
    if (!toast) return;
    toast.querySelector('.toast-msg').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  };

  /* ---- Smooth Scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const y = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

})();
