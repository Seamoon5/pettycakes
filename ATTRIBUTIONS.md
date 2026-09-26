# Image credits & licences

The photos in this project are **free placeholder stock**, chosen so the site looks real
while you decide on your own product photography. Every one was opened and checked to
make sure it actually shows the dessert it is labelled with — several first-choice
candidates were rejected for looking dull, homemade or "not something I'd pay for".

**Replace them with your own cake photos before you launch.** Keep the file names and
nothing else needs to change.

---

## Files in `assets/img/`

Every photo comes from **[TheMealDB](https://www.themealdb.com)**, a free recipe
database, reached through its public free API. Dish names are credited below.

| File | Used for | TheMealDB dish |
|---|---|---|
| `hero.jpg` | Hero section | Polish chocolate & walnut cake |
| `cake-chocolate-fudge.jpg` | Chocolate Fudge Cake card | Chocolate Raspberry Brownies (52860) |
| `cake-chocolate-bundt.jpg` | Chocolate Ganache Bundt card | Mini bundt cakes (53304) |
| `cake-strawberry-tart.jpg` | Strawberry Cream Tart card | Strawberry tart (53550) |
| `cake-salted-caramel.jpg` | Salted Caramel Cheesecake card | Salted Caramel Cheescake (52833) |
| `cake-pistachio-rose.jpg` | Pistachio Rose Cake card | Pistachio Kunafa Chocolate Cake and Cupcakes (53224) |
| `order-celebration.jpg` | Order section photo | Dulce de Leche Cheesecake (53543) |

Dish pages follow the pattern `https://www.themealdb.com/meal/52860`.

### Important — please read before going live

TheMealDB does **not** publish a per-image Creative Commons licence, and its terms are
written for its own website rather than for re-use on someone else's shop. These images
are fine as a temporary placeholder, which is exactly what they are here for. But if you
keep them on a site that takes real money, you are relying on goodwill.

The clean fix is to spend an afternoon with your own phone:

1. Photograph your five best cakes near a window, on a plain background.
2. Resize them to **1400 × 1050** (landscape 4:3) for the cards, and **1200 × 1200** for
   the hero square.
3. Save them into `assets/img/` using the same file names.

Your own photos will always beat stock — customers buy the cake, not the picture.

### A note on resolution

TheMealDB serves these at **700 × 700**, which is why the cards are sized for it. That is
plenty for phones and normal screens, but it will look slightly soft on a high-DPI
monitor. Another reason to use your own photos.

---

## Icons in `assets/`

`favicon-32.png`, `apple-touch-icon.png`, `icon-192.png` and `icon-512.png` are drawn
from scratch by `tools/make_icons.py` (pure Python standard library, no external
libraries). They are yours to use, modify and ship — no attribution needed.

The header logo in `index.html` is an inline SVG using the same cake-slice design.

---

## Fonts

**Libre Caslon Text** and **Montserrat**, both served from Google Fonts
(Google Fonts Licence — free for commercial use, no attribution required).
