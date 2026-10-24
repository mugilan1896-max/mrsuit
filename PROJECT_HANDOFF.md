# Project Handoff: MR SUIT Website

## 1. Overview
Multi-page luxury presentation & enquiry website for **MR SUIT** (bespoke menswear tailoring house in Vadapalani, Chennai).
- **Tagline**: Completes Your Desire.
- **Location**: 332, Arcot Road, Vadapalani, Chennai – 600026.
- **Phones**: +91 99401 52793 / +91 72001 97418.
- **Email**: mr.suits21@gmail.com.
- **WhatsApp**: 919940152793.

## 2. Multi-Page Architecture
Clean native multi-page HTML architecture configured with Vite:
- `index.html` → `/` (Home)
- `stores/index.html` → `/stores/` (Stores)
- `customization/index.html` → `/customization/` (Customization)
- `about-us/index.html` → `/about-us/` (About Us)
- `contact/index.html` → `/contact/` (Contact)
- `enquiry/index.html` → `/enquiry/` (Enquiry)

## 3. Brand Colors & Design Tokens
Configured in `css/style.css`:
- **Matte Black**: `#111111` (`--matte-black`, `--ink`)
- **Ivory White**: `#F7F5F0` (`--ivory`)
- **Cream / Surface**: `#EDE8DE` (`--cream`), `#FCFAF7` (`--surface`)
- **Luxury Gold**: `#C8A04D` (`--luxury-gold`, `--gold-border`, `--gold-subtle`)
- **Signature Navy**: `#17183D` (`--navy`)
- **Typography**: Cormorant Garamond (editorial serif) and Jost (clean geometric sans).

## 4. Assets
All photorealistic assets reside in `/assets/images/`:
- `hero-01.jpg`: Male model wearing tailored black 3-piece bespoke suit.
- `hero-02.jpg`: Male model wearing tailored navy blazer with formal trousers.
- `hero-03.jpg`: Male model wearing midnight navy tuxedo with satin lapels.
- `col-suits.jpg`: Bespoke suits display.
- `col-blazers.jpg`: Italian wool houndstooth & navy blazer display.
- `col-wedding.jpg`: Wedding tuxedos and ceremonial formalwear.
- `craft-tailor.jpg`: Master tailor measuring and hand-cutting luxury cloth.
- `store-interior.jpg`: Boutique atelier showroom interior.
- `fabric-swatches.jpg`: Wool and cashmere suit fabric swatches.

## 5. Scripts & Motion
- `js/carousel.js`: 3-slide auto-advancing carousel with pause-on-hover, keyboard arrows, and non-overlapping bottom-right controls.
- `js/main.js`: Scroll header state, mobile drawer toggle, immediate & scroll-triggered reveal observer, and WhatsApp consultation dispatcher.
