/* ===== MR SUIT CINEMATIC HERO CAROUSEL ===== */

(function () {
  function initCarousel() {
    const hero = document.getElementById('homeHero');
    if (!hero) return;

    const slides = Array.from(hero.querySelectorAll('.slide-full'));
    if (slides.length === 0) return;

    const dots = Array.from(hero.querySelectorAll('.dot-dash'));
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');

    const DELAY = 5000; // Auto-slides every 5 seconds
    const LOCK_DURATION = 750;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentIndex = 0;
    let timer = null;
    let isLocked = false;

    function updateDots(index) {
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === index);
        dot.setAttribute('aria-current', idx === index ? 'true' : 'false');
      });
    }

    function goToSlide(n) {
      if (isLocked) return;
      isLocked = true;
      setTimeout(() => {
        isLocked = false;
      }, LOCK_DURATION);

      slides[currentIndex].classList.remove('on');
      currentIndex = (n + slides.length) % slides.length;
      slides[currentIndex].classList.add('on');

      updateDots(currentIndex);
      startAutoPlay();
    }

    function startAutoPlay() {
      clearTimeout(timer);
      if (prefersReduced) return;
      timer = setTimeout(() => {
        goToSlide(currentIndex + 1);
      }, DELAY);
    }

    function stopAutoPlay() {
      clearTimeout(timer);
      timer = null;
    }

    // Manual navigation (resets the 5s auto-play countdown)
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      });
    }

    // Dot indicators
    dots.forEach((dot, idx) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        goToSlide(idx);
      });
    });

    // Keyboard arrow keys
    document.addEventListener('keydown', (e) => {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        if (e.key === 'ArrowRight') goToSlide(currentIndex + 1);
        if (e.key === 'ArrowLeft') goToSlide(currentIndex - 1);
      }
    });

    // Pause only when browser tab is inactive/minimized, resume on return
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoPlay();
      } else {
        startAutoPlay();
      }
    });

    // Touch Swipe for Mobile
    let touchStartX = 0;
    let touchStartY = 0;

    hero.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    hero.addEventListener('touchend', (e) => {
      if (!e.changedTouches || !e.changedTouches[0]) return;
      const diffX = e.changedTouches[0].clientX - touchStartX;
      const diffY = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX < 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
    }, { passive: true });

    // Initial state & start auto-sliding immediately
    updateDots(currentIndex);
    startAutoPlay();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }
})();
