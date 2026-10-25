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

  // Scroll reveal with IntersectionObserver
  const revealElements = document.querySelectorAll('.rv');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '60px 0px',
      threshold: 0.02
    });

    revealElements.forEach((el) => {
      // If already in initial viewport, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('in');
      } else {
        observer.observe(el);
      }
    });
  } else {
    revealElements.forEach((el) => el.classList.add('in'));
  }

  // =========================================================
  // LUXURY 3D ATTIRE POP-OUT & SUBJECT SEPARATION ENGINE
  // Only the dress comes forward; card padding & borders stay anchored
  // =========================================================
  const attireStages = document.querySelectorAll('.attire-stage');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (attireStages.length > 0 && !prefersReduced) {
    attireStages.forEach((stage) => {
      const cutout = stage.querySelector('.attire-cutout');
      const bg = stage.querySelector('.attire-bg');
      const badge = stage.querySelector('.attire-inspect-badge');
      if (!cutout || !bg) return;

      let isPopped = false;
      let rafId = null;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;

      // Handle Mouse Movement (Directional Parallax on THE DRESS ONLY)
      const onMouseMove = (e) => {
        const rect = stage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtle rotation angles for the dress (-6 to +6 deg)
        targetRotX = ((y - centerY) / centerY) * -5;
        targetRotY = ((x - centerX) / centerX) * 7;

        if (!rafId) {
          rafId = requestAnimationFrame(updateParallax);
        }
      };

      const updateParallax = () => {
        currentRotX += (targetRotX - currentRotX) * 0.14;
        currentRotY += (targetRotY - currentRotY) * 0.14;

        if (isPopped) {
          // ACTIVE POP-FORWARD: Dress floats forward in 3D, responds to mouse direction
          cutout.style.transform = `perspective(1000px) translateZ(85px) scale(1.15) translateY(-14px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
          // Background recedes slightly with gentle opposite shift for realistic depth
          bg.style.transform = `scale(0.96) translate(${(-currentRotY * 0.35).toFixed(2)}px, ${(currentRotX * 0.35).toFixed(2)}px)`;
        } else {
          // HOVER STATE: Elegant gentle lift-off on the dress only
          cutout.style.transform = `perspective(1000px) translateZ(35px) scale(1.05) translateY(-6px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg)`;
          bg.style.transform = `scale(0.98)`;
        }

        if (Math.abs(targetRotX - currentRotX) > 0.05 || Math.abs(targetRotY - currentRotY) > 0.05) {
          rafId = requestAnimationFrame(updateParallax);
        } else {
          rafId = null;
        }
      };

      const onMouseLeave = () => {
        targetRotX = 0;
        targetRotY = 0;
        if (!isPopped) {
          cutout.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
          bg.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), filter 0.7s cubic-bezier(0.16, 1, 0.3, 1)';
          cutout.style.transform = '';
          bg.style.transform = '';
          setTimeout(() => {
            cutout.style.transition = '';
            bg.style.transition = '';
          }, 700);
        }
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      };

      // Toggle Popped Forward on Click (left vs right side tilt)
      const togglePopped = (e) => {
        e.stopPropagation();
        isPopped = !isPopped;

        // Close any other open attire stages so only one is popped at a time
        if (isPopped) {
          attireStages.forEach((other) => {
            if (other !== stage && other.classList.contains('attire-popped')) {
              other.classList.remove('attire-popped');
              other.setAttribute('aria-pressed', 'false');
              const otherCutout = other.querySelector('.attire-cutout');
              const otherBg = other.querySelector('.attire-bg');
              const otherBadgeText = other.querySelector('.attire-inspect-badge .badge-text');
              if (otherCutout) otherCutout.style.transform = '';
              if (otherBg) otherBg.style.transform = '';
              if (otherBadgeText) otherBadgeText.textContent = 'Click to pop forward';
            }
          });
        }

        stage.classList.toggle('attire-popped', isPopped);
        stage.setAttribute('aria-pressed', isPopped);

        if (badge) {
          const badgeText = badge.querySelector('.badge-text');
          if (badgeText) {
            badgeText.textContent = isPopped ? 'Pop-out Active • Click to reset' : 'Click to pop forward';
          }
        }

        cutout.style.transition = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), filter 0.75s cubic-bezier(0.16, 1, 0.3, 1)';
        bg.style.transition = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), filter 0.75s cubic-bezier(0.16, 1, 0.3, 1)';

        if (isPopped) {
          // If user clicked left side, angle slightly left; if right, angle slightly right
          const rect = stage.getBoundingClientRect();
          const clickX = e.clientX - rect.left;
          const sideAngle = (clickX < rect.width / 2) ? -5 : 5;
          currentRotY = sideAngle;
          targetRotY = sideAngle;
          cutout.style.transform = `perspective(1000px) translateZ(85px) scale(1.15) translateY(-14px) rotateY(${sideAngle}deg)`;
          bg.style.transform = 'scale(0.96)';
        } else {
          currentRotX = 0;
          currentRotY = 0;
          targetRotX = 0;
          targetRotY = 0;
          cutout.style.transform = '';
          bg.style.transform = '';
        }

        setTimeout(() => {
          cutout.style.transition = '';
          bg.style.transition = '';
        }, 750);
      };

      stage.addEventListener('mousemove', onMouseMove, { passive: true });
      stage.addEventListener('mouseleave', onMouseLeave, { passive: true });
      stage.addEventListener('click', togglePopped);

      // Support keyboard accessibility (Enter/Space to toggle)
      stage.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          togglePopped(e);
        }
      });
    });

    // Close active popped attire if user clicks anywhere outside the cards
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.attire-stage')) {
        attireStages.forEach((stage) => {
          if (stage.classList.contains('attire-popped')) {
            stage.classList.remove('attire-popped');
            stage.setAttribute('aria-pressed', 'false');
            const cutout = stage.querySelector('.attire-cutout');
            const bg = stage.querySelector('.attire-bg');
            const badgeText = stage.querySelector('.attire-inspect-badge .badge-text');
            if (cutout) {
              cutout.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
              cutout.style.transform = '';
            }
            if (bg) {
              bg.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
              bg.style.transform = '';
            }
            if (badgeText) badgeText.textContent = 'Click to pop forward';
          }
        });
      }
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
});

