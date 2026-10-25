/* ===== MR SUIT CORE JAVASCRIPT ===== */

document.addEventListener('DOMContentLoaded', () => {
  // Header scroll state
  const hdr = document.getElementById('hdr');
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');

  if (hdr) {
    const onScroll = () => {
      hdr.classList.toggle('solid', window.scrollY > 30);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // Mobile menu toggle
  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // Scroll reveals (.rv and .rv-curtain) with IntersectionObserver
  const revealElements = document.querySelectorAll('.rv, .rv-curtain');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '150px 0px',
      threshold: 0
    });

    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 150) {
        el.classList.add('in');
      } else {
        observer.observe(el);
      }
    });

    // Failsafe: Ensure everything is revealed once page finishes loading
    window.addEventListener('load', () => {
      setTimeout(() => {
        revealElements.forEach((el) => el.classList.add('in'));
      }, 300);
    });
  } else {
    revealElements.forEach((el) => el.classList.add('in'));
  }

  // =========================================================
  // LUXURY ATELIER 3D TILT & DYNAMIC FABRIC SPOTLIGHT ENGINE
  // Dynamic fabric weave illumination + smooth perspective tilt
  // =========================================================
  const sartorialCards = document.querySelectorAll('.card-sartorial');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (sartorialCards.length > 0 && !prefersReduced) {
    sartorialCards.forEach((card) => {
      const mediaFrame = card.querySelector('.card-media-frame');
      const img = card.querySelector('.card-img');
      const spotlight = card.querySelector('.card-spotlight');
      if (!mediaFrame || !img) return;

      let rafId = null;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let targetImgX = 0;
      let targetImgY = 0;
      let currentImgX = 0;
      let currentImgY = 0;

      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtle 3D perspective angles (-4.5 to +4.5 deg)
        targetRotX = ((y - centerY) / centerY) * -4.5;
        targetRotY = ((x - centerX) / centerX) * 4.5;

        // Parallax counter-glide on the suit photograph
        targetImgX = ((x - centerX) / centerX) * -8;
        targetImgY = ((y - centerY) / centerY) * -8;

        // Dynamic fabric spotlight tracks exact pointer coordinates
        if (spotlight) {
          const frameRect = mediaFrame.getBoundingClientRect();
          const spotX = e.clientX - frameRect.left;
          const spotY = e.clientY - frameRect.top;
          card.style.setProperty('--spot-x', `${spotX}px`);
          card.style.setProperty('--spot-y', `${spotY}px`);
        }

        if (!rafId) {
          rafId = requestAnimationFrame(renderPhysics);
        }
      };

      const renderPhysics = () => {
        currentRotX += (targetRotX - currentRotX) * 0.12;
        currentRotY += (targetRotY - currentRotY) * 0.12;
        currentImgX += (targetImgX - currentImgX) * 0.12;
        currentImgY += (targetImgY - currentImgY) * 0.12;

        card.style.transform = `perspective(1000px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) translateZ(6px)`;
        img.style.transform = `scale(1.06) translate(${currentImgX.toFixed(2)}px, ${currentImgY.toFixed(2)}px)`;

        if (
          Math.abs(targetRotX - currentRotX) > 0.03 ||
          Math.abs(targetRotY - currentRotY) > 0.03 ||
          Math.abs(targetImgX - currentImgX) > 0.03 ||
          Math.abs(targetImgY - currentImgY) > 0.03
        ) {
          rafId = requestAnimationFrame(renderPhysics);
        } else {
          rafId = null;
        }
      };

      const onMouseLeave = () => {
        targetRotX = 0;
        targetRotY = 0;
        targetImgX = 0;
        targetImgY = 0;

        card.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.7s ease, border-color 0.4s ease';
        img.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s ease';
        card.style.transform = '';
        img.style.transform = '';

        setTimeout(() => {
          card.style.transition = '';
          img.style.transition = '';
        }, 700);

        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }

  // Footer Year
  const yr = document.getElementById('yr');
  if (yr) {
    yr.textContent = new Date().getFullYear();
  }

  // WhatsApp Enquiry Form
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    // Pre-fill clothingType dropdown from URL parameter if available
    const productParam = new URLSearchParams(window.location.search).get('product');
    const clothingSelect = document.getElementById('clothingType');
    if (productParam && clothingSelect) {
      for (let i = 0; i < clothingSelect.options.length; i++) {
        if (clothingSelect.options[i].value.toLowerCase().includes(productParam.toLowerCase()) ||
            productParam.toLowerCase().includes(clothingSelect.options[i].value.toLowerCase())) {
          clothingSelect.selectedIndex = i;
          break;
        }
      }
    }

    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);

      const name = formData.get('name')?.trim();
      const phone = formData.get('phone')?.trim();
      const clothingType = formData.get('clothingType') || 'Bespoke Suit';
      const occasion = formData.get('occasion') || 'General Consultation';
      const date = formData.get('date')?.trim();
      const message = formData.get('message')?.trim();

      if (!name || !phone) {
        alert('Please provide your name and phone number.');
        return;
      }

      // Build formatted WhatsApp message
      let text = `*New Tailoring Enquiry — MR SUIT*\n\n`;
      text += `👤 *Client Name:* ${name}\n`;
      text += `📞 *Phone:* ${phone}\n`;
      text += `👔 *Interested In:* ${clothingType}\n`;
      text += `✨ *Occasion:* ${occasion}\n`;
      if (date) {
        text += `📅 *Preferred Date:* ${date}\n`;
      }
      if (message) {
        text += `📝 *Notes/Requirements:* ${message}\n`;
      }
      text += `\n_Sent via mrsuit.in website_`;

      const clientWA = '919940152793';
      const whatsappUrl = `https://wa.me/${clientWA}?text=${encodeURIComponent(text)}`;

      // Show friendly confirmation notice on the page
      const statusNotice = document.getElementById('formStatus');
      if (statusNotice) {
        statusNotice.style.display = 'block';
        statusNotice.innerHTML = `<strong>Connecting to WhatsApp...</strong> We are opening WhatsApp with your consultation details prefilled. Please tap "Send" in WhatsApp to dispatch your enquiry directly to our master tailor.`;
      }

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // =========================================================
  // LUXURY EDITORIAL LOOKBOOK: SMOOTH DEEP-LINKING
  // =========================================================
  function handleLookbookHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    const targetEl = document.getElementById(hash);
    if (targetEl && targetEl.closest('.lookbook-section')) {
      setTimeout(() => {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }

  handleLookbookHash();
  window.addEventListener('hashchange', handleLookbookHash);

  // =========================================================
  // LUXURY SCROLL PARALLAX FOR IN-FRAME MEDIA & WATERMARKS
  // =========================================================
  const parallaxFrames = document.querySelectorAll('.parallax-frame');
  const watermarks = document.querySelectorAll('.story-step-watermark');

  if (!prefersReduced && (parallaxFrames.length > 0 || watermarks.length > 0)) {
    let ticking = false;

    const updateParallax = () => {
      const windowHeight = window.innerHeight;

      // In-frame image vertical parallax
      parallaxFrames.forEach((frame) => {
        const rect = frame.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < windowHeight) {
          // Normalize position (-1 at top, +1 at bottom)
          const factor = ((rect.top + rect.height / 2) - windowHeight / 2) / (windowHeight / 2);
          const img = frame.querySelector('img');
          if (img) {
            img.style.transform = `translateY(${(-factor * 16).toFixed(1)}px) scale(1.04)`;
          }
        }
      });

      // Watermark counter number floating
      watermarks.forEach((wm) => {
        const rect = wm.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < windowHeight) {
          const factor = (rect.top - windowHeight / 2) / (windowHeight / 2);
          wm.style.transform = `translateY(${(factor * 18).toFixed(1)}px)`;
        }
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });

    updateParallax();
  }

  // =========================================================
  // LOOKBOOK INTERACTIVE WEAVE & FABRIC LENS PAN
  // Subtle cursor-following micro-pan across cloth detailing
  // =========================================================
  const lookbookMedias = document.querySelectorAll('.lookbook-media');
  if (lookbookMedias.length > 0 && !prefersReduced) {
    lookbookMedias.forEach((media) => {
      const img = media.querySelector('img');
      if (!img) return;

      let rafId = null;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      const onMouseMove = (e) => {
        const rect = media.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // Subtle pan (-14px to +14px)
        targetX = (x - 0.5) * -24;
        targetY = (y - 0.5) * -24;

        if (!rafId) {
          rafId = requestAnimationFrame(updatePan);
        }
      };

      const updatePan = () => {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;

        img.style.transform = `scale(1.08) translate(${currentX.toFixed(1)}px, ${currentY.toFixed(1)}px)`;

        if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
          rafId = requestAnimationFrame(updatePan);
        } else {
          rafId = null;
        }
      };

      const onMouseLeave = () => {
        targetX = 0;
        targetY = 0;
        img.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        img.style.transform = 'scale(1.0) translate(0px, 0px)';
        setTimeout(() => {
          img.style.transition = '';
        }, 800);
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      media.addEventListener('mousemove', onMouseMove, { passive: true });
      media.addEventListener('mouseleave', onMouseLeave, { passive: true });
    });
  }
});

