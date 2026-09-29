# Indian Magician — Upendra Thakur (indianmagician.com)

A production-ready, full-stack 3D interactive website and headless CMS Admin Panel for **Magician Upendra Thakur**, combining the editorial aesthetic of `suhanishah.com` with persistent WebGL 3D scroll physics, bespoke mouse-tracking effects, and a complete CRUD Admin Panel.

---

## 🌟 Key Features

1. **Persistent 3D "King of Diamonds" Playing Card:**
   - Powered by Three.js & React Three Fiber (`src/components/Persistent3DCard.jsx`).
   - High-resolution HTML5 Canvas generated textures for front (regal K♦ with gold foil and crimson court artwork) and back (ornate obsidian filigree with "UT" monogram).
   - Floats persistently across the viewport, reacting dynamically to mouse tilt and tumbling on multi-axis rotation as the user scrolls through page sections (`Hero`, `About`, `Videos`, `News`).

2. **Magical Mouse-Tracking Cursor:**
   - Spring-physics golden precision ring + soft radial spotlight glow.
   - Spawns subtle, fading golden and emerald stardust particle trails.
   - Magnetically expands on interactive elements.

3. **Borderless Navigation & Dual-Layered Hero Typography:**
   - Exact Suhani Shah visual hierarchy with borderless header, brand button, 4 links (`ABOUT`, `VIDEOS`, `NEWS`, `CONTACT`), and Mail/WhatsApp action conduits.
   - Hero section with `/hero-magician.png` (high-res portrait with emerald-smoke atmosphere) and dual-layered hollow stroke + solid serif center title with scroll-zoom.

4. **Rich Homepage Sections:**
   - **About Section:** Glass bio container overlaying the floating 3D card + 8-photo asymmetric modern Bento collage with Lightbox + 11-slide client testimonials text carousel.
   - **Videos Section:** YouTube 2x3 Grid with embedded video player modal + "Binge them all" button; Instagram Reels 1x4 row (toggleable to 1x3 in Admin) + "Watch them all" button; "About Indian Magician" 1x3 highlight featurette cards.
   - **In The News Section:** 2x3 Grid with media type badges (Image/Video), date, and headline + "Show all" navigation to dedicated `/news` page.
   - **Dynamic Sections:** Custom admin-created blocks rendered dynamically.

5. **Dedicated Pages:**
   - **`/news`:** Full media archive with responsive grid and category filter tabs (`All`, `Articles`, `Videos & TV`, `Press Photos`).
   - **`/contact`:** 50vh hero banner + contact info + query form (saves to database, triggers email notification, and launches golden celebratory confetti).
   - **`/page/:slug`:** Standalone dynamic pages configured from Admin (e.g. `/page/corporate-shows`, `/page/luxury-weddings`).

6. **Full CRUD Admin Panel (`/admin`):**
   - Password protected (default password: `magicadmin123`).
   - Real-time CRUD managers for Hero & Global Settings, About Bio & 8-Photo Collage, 11 Testimonial Slides, Videos (YouTube, Reels layout & items, Highlights), News Media, Dynamic Sections, Custom Pages, and Contact Inquiries Inbox with direct email reply.
   - Built-in Multer image upload endpoint.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm

### Development Mode (Runs Frontend + Backend Concurrently)
```bash
npm run dev
```
- **Frontend:** `http://localhost:5173`
- **Backend API & Admin Server:** `http://localhost:5001`
- Proxies `/api` and `/uploads` automatically.

### Production Mode (Single Full-Stack Server)
```bash
npm run build
npm start
```
- Serves the entire website and API at `http://localhost:5001`.

---

## 🔐 Admin Dashboard Access
- **URL:** `http://localhost:5173/admin` (or `http://localhost:5001/admin`)
- **Default Master Password:** `magicadmin123`
*(Can be changed anytime inside the Admin "Global Settings" tab)*
# INDIANMAGICIAN-Website
# INDIANMAGICIAN-Website
