const TOTAL = 12;
let current = 1;
let animating = false;

const slides = () => document.querySelectorAll('.slide');
const dotsEl = document.getElementById('dots');

// Build dots
for (let i = 1; i <= TOTAL; i++) {
  const d = document.createElement('span');
  d.className = 'dot' + (i === 1 ? ' active' : '');
  d.onclick = () => goTo(i);
  dotsEl.appendChild(d);
}

function goTo(n) {
  if (n < 1 || n > TOTAL || n === current || animating) return;
  animating = true;

  const prev = document.getElementById('s' + current);
  const next = document.getElementById('s' + n);

  prev.classList.add('leaving');
  prev.classList.remove('active');

  setTimeout(() => {
    prev.classList.remove('leaving');
    prev.querySelectorAll('.anim,.anim-left,.anim-scale').forEach(el => el.classList.remove('visible'));
    next.classList.add('active', 'entering');

    setTimeout(() => {
      next.classList.remove('entering');
      animating = false;
      triggerAnims(next);
      triggerSlideSpecific(n);
    }, 560);
  }, 460);

  current = n;
  updateUI();
}

function updateUI() {
  document.getElementById('slide-counter').textContent = current + ' / ' + TOTAL;
  document.getElementById('btnPrev').disabled = current === 1;
  document.getElementById('btnNext').disabled = current === TOTAL;
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i + 1 === current));
}

function triggerAnims(slide) {
  const els = slide.querySelectorAll('.anim, .anim-left, .anim-scale');
  els.forEach((el, i) => {
    const delay = parseFloat(el.style.transitionDelay) * 1000 || i * 80;
    setTimeout(() => el.classList.add('visible'), delay + 50);
  });
}

function triggerSlideSpecific(n) {
  if (n === 3) animateBars();
  if (n === 8) animateFinBars();
}

function animateBars() {
  const widths = { b1: 12, b2: 22, b3: 38, b4: 55, b5: 75 };
  setTimeout(() => {
    Object.entries(widths).forEach(([id, w]) => {
      const el = document.getElementById(id);
      if (el) el.style.width = w + '%';
    });
  }, 400);
}

function animateFinBars() {
  const widths = { fb1: 55, fb2: 20, fb3: 15, fb4: 10 };
  setTimeout(() => {
    Object.entries(widths).forEach(([id, w]) => {
      const el = document.getElementById(id);
      if (el) el.style.width = w + '%';
    });
  }, 450);
}

// Keyboard nav
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(current + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(current - 1);
});

// Touch/swipe
let tx = 0;
document.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx;
  if (Math.abs(dx) > 50) { dx < 0 ? goTo(current + 1) : goTo(current - 1); }
}, { passive: true });

// Init first slide
triggerAnims(document.getElementById('s1'));
updateUI();



(function(){
  function setupModal(triggerId, modalId, closeId) {
    const trigger = document.getElementById(triggerId);
    const modal   = document.getElementById(modalId);
    const close   = document.getElementById(closeId);

    if (!trigger || !modal || !close) return;

    // Agrega la clase que activa las animaciones CSS
    modal.classList.add('modal-anim');

    trigger.addEventListener('click', () => {
      modal.classList.remove('closing');
      modal.style.display = 'flex';
    });

    function closeModal() {
      modal.classList.add('closing');
      setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('closing');
      }, 400); // era 250, ahora igual que modalBackdropOut
    }

    close.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  }

  setupModal('trigger-casa',    'modal-casa',    'modal-close');
  setupModal('trigger-consumo', 'modal-consumo', 'modal-consumo-close');
})();



(function(){
  const bars = [
    { id: 'fb1', width: '52%' },
    { id: 'fb2', width: '25%' },
    { id: 'fb3', width: '22%' },
    { id: 'fb4', width: '1%' },
  ];

  function animateBars() {
    bars.forEach((b, i) => {
      const el = document.getElementById(b.id);
      if (!el) return;
      setTimeout(() => {
        el.style.transition = 'width 0.8s ease';
        el.style.width = b.width;
      }, i * 150);
    });
  }

  // Si ya tenés un IntersectionObserver para las animaciones, usalo acá también
  // Si no, simplemente animamos al cargar
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateBars();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const target = document.getElementById('finBars');
  if (target) observer.observe(target);
})();
