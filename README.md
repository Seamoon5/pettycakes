# PettyCakes

A one-page website for selling cakes online. Visitors scroll the menu, read each cake's
details, pick one, fill in a short form, and your team gets the order and starts baking.

Design language taken from **[minon.com.tr](https://www.minon.com.tr/)** (the design
system you saved as `SKILL-minon-com-tr.md` / `DESIGN-minon-com-tr.md`): white canvas,
**Jost** everywhere, uppercase headings with tight letter-spacing, thin hairline rules,
square corners, monochrome plus one grey accent (`#888888`), and square product photos
with a tiny vendor line under each one. Everything is in **English**.

---

## The one thing that makes this site different

**The menu is a horizontal row that your page scroll drives.** As you scroll down, the
cakes glide in from the right, one at a time. Whichever cake is in focus gets its name,
description, price and an **Order this cake** button shown in the panel on the right.

- Each cake holds still for a moment, then glides to the next one — so nothing feels
  twitchy no matter how fast you scroll.
- The focused cake is full size and full colour; the ones on either side step back.
- Dots under the panel let you jump straight to a cake, and a thin line shows how far
  through the list you are.
- Arrow keys (`←` `→`) move through the list when the menu has keyboard focus.
- **On a phone there is no scroll-hijacking** — the row becomes a normal swipeable
  carousel and the panel underneath follows whatever is centred.
- If the visitor has "reduce motion" switched on in their device, the site gives them the
  swipeable version too.

---

## Quick start

**Option A — just open it (easiest)**
Double-click `index.html`. It opens in your browser straight away.

**Option B — run a tiny local server (recommended, behaves exactly like the live site)**

```bash
cd /home/salman/WebApps/pettycakes
python3 -m http.server 8080
```

Then open <http://localhost:8080> in Chrome. Press `Ctrl+C` in the terminal to stop it.

> On Windows the folder is at
> `\\wsl.localhost\Ubuntu\home\salman\WebApps\pettycakes`

---

## Make it yours — the only file you need to touch

Open **`js/main.js`** and edit the block at the very top:

```js
var SHOP = {
  whatsapp: "923001234567",   // digits only, no "+" and no spaces
  formspree: "",             // optional, see below
  minNoticeHours: 48         // earliest order date the form allows
};
```

| Setting | What it does |
|---|---|
| `whatsapp` | Your WhatsApp number: country code + number, digits only. `+92 300 1234567` becomes `"923001234567"`. |
| `formspree` | Leave `""` and orders arrive on WhatsApp only. To also get them by email, create a free form at [formspree.io](https://formspree.io), copy the endpoint (`https://formspree.io/f/abcdwxyz`) and paste it in. |
| `minNoticeHours` | How much notice you need. The date picker refuses anything earlier. |

Then swap the text in **`index.html`**: your city, your WhatsApp line in the footer, the
cake names, the descriptions and the prices. **Cakes live in one place only** — each
menu item carries its own `data-name`, `data-price`, `data-desc` and `data-meta`, and the
detail panel *and* the order dropdown are both generated from that markup, so they can
never drift apart. To add a cake, copy one `<li class="menu-item">` block, change the
values and the photo, and it appears in the row, in the panel and in the dropdown at once.

---

## How an order reaches your team

The site works with **no backend and no hosting costs**, using the way small bakeries in
Pakistan already take orders — WhatsApp.

1. The customer fills the form and presses **Send my order**.
2. The page checks everything (all fields marked, a real email address, a phone number
   with at least 10 digits, a date that respects your notice time) and names the exact
   fields that need fixing instead of saying "something is wrong".
3. A confirmation appears with a green **Send it on WhatsApp too** button.
4. Pressing it opens WhatsApp with the whole order already typed out — cake, quantity,
   date, name, phone, email and the customisation note.

If you set `formspree`, the order is also emailed to you the moment the form is sent, and
WhatsApp stays as the backup.

---

## Changing the cakes and photos

Photos live in `assets/img/` and are all **square (1:1)**. Keep the file names and drop
your own photos in their place — that is the whole procedure.

| File | Where it appears |
|---|---|
| `hero-1.jpg` `hero-2.jpg` `hero-3.jpg` | The three hero slides |
| `cake-*.jpg` | The menu row (one per cake, in order) |
| `story-*.jpg` | Our story photos |
| `order-dulce-de-leche.jpg` | The photo beside the order form |
| `kitchen-*.jpg` | The "Also on the counter" grid |

If you change the number of cakes, nothing else to do — the row, the panel, the dots and
the dropdown all size themselves.

Read **[ATTRIBUTIONS.md](ATTRIBUTIONS.md)** before you go live: the placeholder photos
come from a free API that does not grant re-use rights, so swap in your own.

---

## What is in the box

```
pettycakes/
├── index.html              the whole page (one file, no build step)
├── css/style.css           the design system + every section
├── js/main.js              SHOP config + menu engine + form logic
├── assets/
│   ├── img/                20 square photos
│   ├── favicon-32.png      ┐
│   ├── apple-touch-icon.png│ drawn by tools/make_icons.py
│   ├── icon-192.png        │ (pure Python, no libraries)
│   └── icon-512.png        ┘
├── tools/make_icons.py     re-create the icons any time
├── ATTRIBUTIONS.md         photo credits + how to replace them
└── README.md
```

No frameworks, no build step, no npm install. Open the file and it runs.

---

## Accessibility & browser support

- Works in current Chrome, Edge, Firefox and Safari, on Windows, macOS, Linux, Android
  and iOS.
- Full keyboard support: skip link, visible focus rings on the cake cards, arrow keys in
  the menu, Escape closes the mobile menu.
- Every image has real alt text and fixed `width`/`height`, so nothing jumps while
  loading. Every form field has a label. The detail panel announces the focused cake.
- `prefers-reduced-motion` is respected: no scroll-hijacking, no auto-advancing slides,
  no marquee.
- Verified with zero console errors, zero failed requests, no horizontal overflow at
  390 / 820 / 1280 / 1440 px, and no duplicate IDs or missing labels.

---

## Version history

| Version | Date | What changed |
|---|---|---|
| **2.0** | 2026-09-26 | Complete redesign in the minon.com.tr style: white + Jost + `#888888` accent, uppercase headings, square corners, script wordmark. **New: the menu is a horizontal row driven by your page scroll**, with the focused cake's details in a panel on the right (arrow keys, jump dots, progress line, swipe fallback on phones, reduced-motion fallback). New hero slideshow (3 slides, auto-advance, pauses on hover), new Our Story section, scrolling text band, new How It Works section, "Also on the counter" photo grid, newsletter box in the footer. All 20 photos replaced with a freshly chosen, visually checked set; menu rebuilt around 8 cakes plus a "Your Own Design" tile priced on request. New monochrome favicons. |
| 1.1 | 2026-09-22 | Replaced every stock photo with genuinely appetising cake shots after the first set was rejected as dull. Added `ATTRIBUTIONS.md`. |
| 1.0 | 2026-09-22 | First release: one-page cake shop, five cakes, WhatsApp order hand-off, Formspree option. |
