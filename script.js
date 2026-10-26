(() => {
  'use strict';

  const cover = document.getElementById('coverScreen');
  const stage = document.getElementById('bookStage');
  const book = document.getElementById('book');
  const openButton = document.getElementById('openInvitation');
  const closeButton = document.getElementById('closeBook');
  const nextButton = document.getElementById('nextPage');
  const prevButton = document.getElementById('prevPage');
  const pages = [...document.querySelectorAll('.page')];
  const progress = document.getElementById('progressBar');
  const counter = document.getElementById('pageCounter');
  const hint = document.getElementById('gestureHint');
  const turnSurface = document.getElementById('turnSurface');

  let current = 0;
  let busy = false;
  let startX = 0;
  let startY = 0;
  let pointerActive = false;

  function render() {
    pages.forEach((page, index) => {
      page.classList.toggle('flipped', index < current);
      page.style.zIndex = String(index < current ? index + 1 : pages.length - index + 3);
    });

    const shown = Math.min(current + 1, pages.length);
    counter.textContent = `${shown} / ${pages.length}`;
    progress.style.width = `${Math.max(20, (shown / pages.length) * 100)}%`;
    if (current > 0) hint.classList.add('hide');
  }

  function openBook() {
    cover.classList.add('opened');
    stage.classList.add('visible');
    stage.setAttribute('aria-hidden', 'false');
    render();
  }

  function closeBook() {
    if (busy) return;
    stage.classList.remove('visible');
    stage.setAttribute('aria-hidden', 'true');
    cover.classList.remove('opened');
    current = 0;
    render();
  }

  function turn(direction) {
    if (busy) return;
    if (direction > 0 && current >= pages.length) return;
    if (direction < 0 && current <= 0) return;

    busy = true;
    const pageIndex = direction > 0 ? current : current - 1;
    const page = pages[pageIndex];

    page.classList.add('turning');
    if (direction > 0) page.classList.add('flipped');
    else page.classList.remove('flipped');

    current += direction;
    render();

    turnSurface.classList.remove('active');
    void turnSurface.offsetWidth;
    turnSurface.classList.add('active');
    if (direction < 0) turnSurface.style.transform = 'rotateY(-180deg) scaleX(-1)';
    else turnSurface.style.transform = '';

    window.setTimeout(() => {
      page.classList.remove('turning');
      turnSurface.classList.remove('active');
      turnSurface.style.transform = '';
      busy = false;
    }, 1100);
  }

  function handleKey(event) {
    if (!stage.classList.contains('visible')) return;
    if (event.key === 'ArrowRight' || event.key === 'Enter') turn(1);
    if (event.key === 'ArrowLeft') turn(-1);
    if (event.key === 'Escape') closeBook();
  }

  function pointerDown(event) {
    if (!stage.classList.contains('visible') || busy) return;
    pointerActive = true;
    startX = event.clientX;
    startY = event.clientY;
  }

  function pointerUp(event) {
    if (!pointerActive || busy) return;
    pointerActive = false;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (Math.abs(dx) < 24 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
    if (dx < 0) turn(1);
    else turn(-1);
  }

  openButton.addEventListener('click', openBook);
  openButton.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openBook();
    }
  });
  closeButton.addEventListener('click', closeBook);
  nextButton.addEventListener('click', () => turn(1));
  prevButton.addEventListener('click', () => turn(-1));
  window.addEventListener('keydown', handleKey);
  book.addEventListener('pointerdown', pointerDown, { passive: true });
  book.addEventListener('pointerup', pointerUp, { passive: true });
  book.addEventListener('pointercancel', () => { pointerActive = false; }, { passive: true });

  render();
})();
