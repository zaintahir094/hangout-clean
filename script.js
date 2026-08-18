/* =========================================================
   Hangout Sofa & Carpet Cleaning — script.js
   ========================================================= */

'use strict';

/* ----------------------------------------------------------
   1. COMPARE SLIDERS (before / after)
   ---------------------------------------------------------- */
function initCompare(el) {
  const after  = el.querySelector('.compare-after');
  const handle = el.querySelector('.compare-handle');
  const input  = el.querySelector('input[type=range]');
  if (!after || !input) return;

  function apply(v) {
    const pct = v + '%';
    after.style.clipPath  = 'inset(0 0 0 ' + pct + ')';
    handle.style.left     = pct;
    el.style.setProperty('--reveal', pct);
  }

  apply(input.value);
  input.addEventListener('input', () => apply(input.value));
}

document.querySelectorAll('.compare').forEach(initCompare);


/* ----------------------------------------------------------
   2. SCROLL REVEAL
   ---------------------------------------------------------- */
(function () {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
})();


/* ----------------------------------------------------------
   3. MOBILE MENU / HAMBURGER
   ---------------------------------------------------------- */
(function () {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  function toggle() {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  btn.addEventListener('click', toggle);

  // close button inside menu
  const closeBtn = document.getElementById('mobileMenuClose');
  if (closeBtn) closeBtn.addEventListener('click', () => {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });

  // close when clicking the backdrop (outside the sheet)
  menu.addEventListener('click', (e) => {
    if (e.target === menu) {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // close when any nav link is clicked
  menu.querySelectorAll('a').forEach((a) =>
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    })
  );
})();


/* ----------------------------------------------------------
   4. PRICE CALCULATOR
   ---------------------------------------------------------- */
(function () {
  const PRICES = { seats: 800, carpets: 2500, mattresses: 1800, pet: 800 };
  const state  = { seats: 0, carpets: 0, mattresses: 0 };

  const totalEl   = document.getElementById('calcTotal');
  const summaryEl = document.getElementById('calcSummary');
  const waBtn     = document.getElementById('calcWaBtn');
  const petToggle = document.getElementById('petToggle');
  if (!totalEl) return;

  function formatNum(n) {
    return n.toLocaleString('en-PK');
  }

  function update() {
    const pet  = petToggle && petToggle.checked ? PRICES.pet : 0;
    const base =
      state.seats     * PRICES.seats +
      state.carpets   * PRICES.carpets +
      state.mattresses * PRICES.mattresses +
      pet;
    const hi = Math.round(base * 1.15); // ±15 % upper estimate

    if (base === 0) {
      totalEl.innerHTML   = 'Rs. 0 <span>– Rs. 0</span>';
      summaryEl.textContent = 'Add items on the left to see your price.';
      if (waBtn) waBtn.href = 'https://wa.me/923111856789';
      return;
    }

    totalEl.innerHTML = 'Rs. ' + formatNum(base) + ' <span>– Rs. ' + formatNum(hi) + '</span>';

    // build summary line
    const parts = [];
    if (state.seats)     parts.push(state.seats + ' sofa seat' + (state.seats > 1 ? 's' : ''));
    if (state.carpets)   parts.push(state.carpets + ' carpet' + (state.carpets > 1 ? 's' : ''));
    if (state.mattresses) parts.push(state.mattresses + ' mattress' + (state.mattresses > 1 ? 'es' : ''));
    if (pet)             parts.push('pet treatment');
    summaryEl.textContent = parts.join(', ');

    // pre-fill WhatsApp message
    const msg = encodeURIComponent(
      'Hi! I\'d like to book a cleaning.\n' +
      parts.join(', ') + '\n' +
      'Estimate: Rs. ' + formatNum(base) + ' – Rs. ' + formatNum(hi)
    );
    if (waBtn) waBtn.href = 'https://wa.me/923111856789?text=' + msg;
  }

  // stepper buttons
  document.querySelectorAll('.stepper').forEach((stepper) => {
    const key    = stepper.dataset.key;
    const output = stepper.querySelector('output');
    if (!key || !output) return;

    stepper.addEventListener('click', (e) => {
      const action = e.target.closest('button') && e.target.closest('button').dataset.action;
      if (!action) return;
      if (action === 'plus')  state[key] = (state[key] || 0) + 1;
      if (action === 'minus') state[key] = Math.max(0, (state[key] || 0) - 1);
      output.value = state[key];
      update();
    });
  });

  if (petToggle) petToggle.addEventListener('change', update);
  update();
})();


/* ----------------------------------------------------------
   5. BUTTON RIPPLE EFFECT
   ---------------------------------------------------------- */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn');
  if (!btn) return;
  const r   = document.createElement('span');
  const d   = Math.max(btn.clientWidth, btn.clientHeight);
  const rect = btn.getBoundingClientRect();
  r.className = 'ripple';
  Object.assign(r.style, {
    width:  d + 'px',
    height: d + 'px',
    left:   (e.clientX - rect.left - d / 2) + 'px',
    top:    (e.clientY - rect.top  - d / 2) + 'px',
  });
  btn.appendChild(r);
  r.addEventListener('animationend', () => r.remove());
});


/* ----------------------------------------------------------
   6. FAQ ACCORDION
   ---------------------------------------------------------- */
document.querySelectorAll('.faq-item').forEach((item) => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!q || !a) return;

  q.addEventListener('click', () => {
    const open = item.classList.toggle('open');
    a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
    q.setAttribute('aria-expanded', String(open));
  });
});


/* ----------------------------------------------------------
   7. TESTIMONIAL CAROUSEL
   ---------------------------------------------------------- */
(function () {
  const track = document.getElementById('testiTrack');
  const prev  = document.getElementById('testiPrev');
  const next  = document.getElementById('testiNext');
  const dots  = document.querySelectorAll('#testiDots .dot-item');
  if (!track) return;

  const cards = track.querySelectorAll('.testi-card');
  let current = 0;

  function scrollTo(idx) {
    current = Math.max(0, Math.min(cards.length - 1, idx));
    cards[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prev) prev.addEventListener('click', () => scrollTo(current - 1));
  if (next) next.addEventListener('click', () => scrollTo(current + 1));

  // sync dots on manual scroll
  track.addEventListener('scroll', () => {
    const cardW = cards[0] ? cards[0].offsetWidth + 20 : 1; // 20 = gap
    const idx   = Math.round(track.scrollLeft / cardW);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    current = idx;
  }, { passive: true });
})();


/* ----------------------------------------------------------
   8. GALLERY DOTS (scroll sync)
   ---------------------------------------------------------- */
(function () {
  const grid = document.querySelector('.gallery-grid');
  const dots = document.querySelectorAll('#galleryDots .dot-item');
  if (!grid || !dots.length) return;

  grid.addEventListener('scroll', () => {
    const tileW = grid.querySelector('.reveal') ? grid.querySelector('.reveal').offsetWidth + 20 : 1;
    const idx   = Math.round(grid.scrollLeft / tileW);
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }, { passive: true });
})();


/* ----------------------------------------------------------
   9. SERVICE FILTER TABS
   ---------------------------------------------------------- */
(function () {
  const tabs  = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.service-card[data-category]');
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      cards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();


/* ----------------------------------------------------------
   10. MAGNETIC BUTTON (subtle cursor follow)
   ---------------------------------------------------------- */
document.querySelectorAll('.magnetic').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width  / 2) * 0.25;
    const y = (e.clientY - rect.top  - rect.height / 2) * 0.25;
    el.style.transform = 'translate(' + x + 'px, ' + y + 'px) translateY(-2px)';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});


/* ----------------------------------------------------------
   11. FLOATING WHATSAPP STATUS PILL (show after 3 s)
   ---------------------------------------------------------- */
(function () {
  const pill = document.querySelector('.wa-status');
  if (!pill) return;
  setTimeout(() => pill.classList.add('show'), 3000);
})();


/* ----------------------------------------------------------
   12. STICKY HEADER — add scrolled class for shadow
   ---------------------------------------------------------- */
(function () {
  const header = document.querySelector('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
})();
