/* Whispa Cleaning — interactions. No dependencies. */
(() => {
  const doc = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.remove('no-js');

  /* header state */
  const header = document.querySelector('[data-header]');
  const onScrollHeader = () => header && header.classList.toggle('is-scrolled', scrollY > 12);
  onScrollHeader();
  addEventListener('scroll', onScrollHeader, { passive: true });

  /* services dropdown */
  const dropBtn = document.querySelector('[data-drop]');
  if (dropBtn) {
    const li = dropBtn.closest('.has-drop');
    const set = (open) => { li.classList.toggle('open', open); dropBtn.setAttribute('aria-expanded', String(open)); };
    dropBtn.addEventListener('click', () => set(dropBtn.getAttribute('aria-expanded') !== 'true'));
    if (matchMedia('(hover: hover)').matches) {
      let t;
      li.addEventListener('mouseenter', () => { clearTimeout(t); set(true); });
      li.addEventListener('mouseleave', () => { t = setTimeout(() => set(false), 180); });
    }
    li.addEventListener('focusout', (e) => { if (!li.contains(e.relatedTarget)) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && li.classList.contains('open')) { set(false); dropBtn.focus(); } });
    document.addEventListener('click', (e) => { if (!li.contains(e.target)) set(false); });
  }

  /* mobile menu */
  const menuBtn = document.querySelector('[data-menu]');
  const menu = document.getElementById('mobile-menu');
  if (menuBtn && menu) {
    const open = (v) => {
      menuBtn.setAttribute('aria-expanded', String(v));
      menuBtn.querySelector('.sr').textContent = v ? 'Close menu' : 'Menu';
      if (v) {
        menu.hidden = false;
        requestAnimationFrame(() => menu.classList.add('open'));
        document.body.style.overflow = 'hidden';
        const first = menu.querySelector('a'); first && first.focus({ preventScroll: true });
      } else {
        menu.classList.remove('open');
        document.body.style.overflow = '';
        setTimeout(() => { if (menuBtn.getAttribute('aria-expanded') === 'false') menu.hidden = true; }, reduce ? 0 : 450);
      }
    };
    menuBtn.addEventListener('click', () => open(menuBtn.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) open(false); });
    document.addEventListener('keydown', (e) => {
      if (menuBtn.getAttribute('aria-expanded') !== 'true') return;
      if (e.key === 'Escape') { open(false); menuBtn.focus(); }
      if (e.key === 'Tab') { // keep focus within menu + toggle
        const items = [menuBtn, ...menu.querySelectorAll('a')];
        const i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    matchMedia('(min-width: 901px)').addEventListener('change', (m) => { if (m.matches) open(false); });
  }

  /* scroll reveals: content already on screen at load stays visible */
  const targets = document.querySelectorAll('.reveal, .reveal-mask, .draw, .plate');
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('r-in', 'in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    const vh = innerHeight;
    targets.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < vh * 0.95) { el.classList.add('in'); return; }
      if (!el.classList.contains('plate')) el.classList.add('r-pre');
      io.observe(el);
    });
  } else {
    targets.forEach((el) => el.classList.add('in'));
  }
  addEventListener('load', () => doc.classList.add('load-done'));

  /* parallax depth */
  const layers = [...document.querySelectorAll('[data-parallax]')];
  const mq = matchMedia('(min-width: 901px)');
  if (!reduce && layers.length) {
    let ticking = false;
    const update = () => {
      ticking = false;
      if (!mq.matches) { layers.forEach((el) => (el.style.transform = '')); return; }
      const mid = innerHeight / 2;
      layers.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const off = (r.top + r.height / 2 - mid) * parseFloat(el.dataset.parallax);
        el.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
      });
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', req, { passive: true });
    addEventListener('resize', req);
    update();
  }

  /* service index: plate follows the pointer horizontally */
  document.querySelectorAll('[data-hover-plates] .svc-row').forEach((row) => {
    const p = row.querySelector('.svc-plate');
    if (!p || reduce) return;
    row.addEventListener('mousemove', (e) => {
      const r = row.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - r.left - 115, 0), r.width - 240);
      p.style.left = x + 'px'; p.style.right = 'auto';
    });
  });

  /* FAQ accordions */
  document.querySelectorAll('[data-faq] .faq-q').forEach((b) => {
    b.addEventListener('click', () => {
      const item = b.closest('.faq-item');
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open));
      item.classList.toggle('open', open);
    });
  });

  /* copy phone number */
  document.querySelectorAll('[data-copy]').forEach((b) => {
    b.addEventListener('click', () => {
      const done = () => { const t = b.textContent; b.textContent = 'Copied'; setTimeout(() => (b.textContent = t), 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(b.dataset.copy).then(done).catch(() => select(b));
      else select(b);
    });
  });
  function select(b) {
    const el = b.previousElementSibling; const range = document.createRange();
    range.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(range);
  }

  /* enquiry form */
  const form = document.querySelector('[data-form]');
  if (form) {
    const status = form.querySelector('.form-status');
    const rules = {
      name: (v) => (v.trim().length >= 2 ? '' : 'Please enter your name.'),
      email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'Please enter a valid email address, for example name@example.com.'),
      telephone: (v) => (v.replace(/[^\d]/g, '').length >= 10 ? '' : 'Please enter a telephone number with at least 10 digits.')
    };
    const check = (input) => {
      const rule = rules[input.name]; if (!rule) return true;
      const msg = rule(input.value);
      const err = document.getElementById(input.id + '-err');
      input.closest('.field').classList.toggle('invalid', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) { err.textContent = msg; input.setAttribute('aria-describedby', err.id); }
      return !msg;
    };
    Object.keys(rules).forEach((n) => {
      const input = form.elements[n];
      input.addEventListener('blur', () => input.value && check(input));
      input.addEventListener('input', () => input.closest('.field').classList.contains('invalid') && check(input));
    });
    const show = (ok, title, text) => {
      status.hidden = false; status.classList.toggle('is-error', !ok);
      status.innerHTML = `<strong>${title}</strong>${text}`; status.focus();
    };
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const bad = Object.keys(rules).map((n) => form.elements[n]).filter((i) => !check(i));
      if (bad.length) { bad[0].focus(); return; }
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.querySelector('span').textContent = 'Sending…';
      try {
        const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
        let data = null; try { data = await res.json(); } catch (_) { /* not JSON */ }
        if (res.ok && data && data.ok) {
          form.reset();
          show(true, 'Thank you, your enquiry has been sent.', ' Elizabeth will be in touch soon. If it is urgent, call 07798 656301.');
        } else {
          show(false, 'Your enquiry could not be sent.', ` ${data && data.error ? data.error : 'The form is not connected on this version of the site.'} Please call Elizabeth on 07798 656301 instead.`);
        }
      } catch (_) {
        show(false, 'Your enquiry could not be sent.', ' Please check your connection and try again, or call Elizabeth on 07798 656301.');
      } finally {
        btn.disabled = false; btn.querySelector('span').textContent = 'Send enquiry';
      }
    });
  }
})();
