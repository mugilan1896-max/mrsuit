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

  // 3D Perspective Tilt on Hover for Category Cards
  const tiltCards = document.querySelectorAll('.card-tilt-3d');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = window.matchMedia('(hover: none)').matches;

  if (tiltCards.length > 0 && !prefersReduced && !isTouchDevice) {
    tiltCards.forEach((card) => {
      let rafId = null;
      let targetX = 0;
      let targetY = 0;
      let currentX = 0;
      let currentY = 0;

      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation angles (-6 to +6 deg for subtle luxury feel)
        targetX = ((y - centerY) / centerY) * -6;
        targetY = ((x - centerX) / centerX) * 6;

        // Glare highlight coordinates
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        card.style.setProperty('--glare-x', `${glareX}%`);
        card.style.setProperty('--glare-y', `${glareY}%`);

        if (!rafId) {
          rafId = requestAnimationFrame(updateTilt);
        }
      };

      const updateTilt = () => {
        currentX += (targetX - currentX) * 0.12;
        currentY += (targetY - currentY) * 0.12;

        card.style.transform = `perspective(1000px) rotateX(${currentX.toFixed(2)}deg) rotateY(${currentY.toFixed(2)}deg) translateY(-4px)`;

        if (Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05) {
          rafId = requestAnimationFrame(updateTilt);
        } else {
          rafId = null;
        }
      };

      const onMouseLeave = () => {
        targetX = 0;
        targetY = 0;
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        setTimeout(() => {
          card.style.transition = '';
        }, 500);
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
});

