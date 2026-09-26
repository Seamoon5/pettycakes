# Image credits & licences

The photos in this project are **free placeholder stock**, chosen so the site looks real
while you decide on your own product photography. Every single one was downloaded,
**rendered and looked at** before it was accepted — titles lie more often than you would
think, and about a third of the first-round candidates were rejected for looking dull,
homemade, or "not something I'd pay for".

**Replace them with your own cake photos before you launch.** Keep the file names and
nothing else needs to change.

---

## Files in `assets/img/`

Every photo comes from **[TheMealDB](https://www.themealdb.com)**, a free recipe
database, reached through its public free API. Dish names are credited below.

| File | Used for | TheMealDB dish |
|---|---|---|
| `hero-1.jpg` | Hero slide 1 | Polish chocolate & walnut cake (53295) |
| `hero-2.jpg` | Hero slide 2 | Authentic Norwegian Kransake (53127) |
| `hero-3.jpg` | Hero slide 3 | Apple Frangipane Tart (52768) |
| `cake-salted-caramel-cheesecake.jpg` | Menu 01 | Salted Caramel Cheescake (52833) |
| `cake-strawberry-glaze-tart.jpg` | Menu 02 | Strawberry tart (53550) |
| `cake-carrot-walnut.jpg` | Menu 03 | Carrot Cake (52897) |
| `cake-pistachio-rose.jpg` | Menu 04 | Pistachio Kunafa Chocolate Cake and Cupcakes (53224) |
| `cake-chocolate-ganache-bundt.jpg` | Menu 05 | Mini bundt cakes (53304) |
| `cake-rocky-road-fudge.jpg` | Menu 06 | Rocky Road Fudge (52786) |
| `cake-cinnamon-rice-tart.jpg` | Menu 07 | Traditional Dutch rice tart (53391) |
| `cake-key-lime-pie.jpg` | Menu 08 | Key Lime Pie (52859) |
| `story-almond-cake.jpg` | Our story, tall photo | Suksesertøte, Norwegian almond success (53130) |
| `story-berry-pie.jpg` | Our story, small photo | Saskatoon Pie (53337) |
| `order-dulce-de-leche.jpg` | Order section photo | Dulce de Leche Cheesecake (53543) |
| `kitchen-chocolate-souffle.jpg` | Counter grid | Chocolate Soufflé (52905) |
| `kitchen-rhubarb-pie.jpg` | Counter grid | Quark and Rhubarb Pie (53574) |
| `kitchen-coconut-squares.jpg` | Counter grid | Chocolate Coconut Squares (53101) |
| `kitchen-lamington.jpg` | Counter grid | Lamington (53104) |
| `kitchen-butter-cake.jpg` | Counter grid | Boterkoek, Dutch butter cake (53385) |
| `kitchen-passion-mousse.jpg` | Counter grid | Passion fruit mousse (53333) |

Dish pages follow the pattern `https://www.themealdb.com/meal/52860`.

Every product is **named after the photo that is actually shown**, never the other way
round — a tray of fudgy squares is called a fudge brownie, not a "truffle cake".

### Important — please read before going live

TheMealDB does **not** publish a per-image Creative Commons licence, and its terms are
written for its own website rather than for re-use on someone else's shop. These images
are fine as a temporary placeholder, which is exactly what they are here for. But if you
keep them on a site that takes real money, you are relying on goodwill.

The clean fix is to spend an afternoon with your own phone:

1. Photograph your best cakes near a window, on a plain background.
2. Shoot **square** — the menu cards, the hero and the grid are all 1:1.
3. Save them as **1200 × 1200** JPEG into `assets/img/` using the same file names.

Your own photos will always beat stock — customers buy the cake, not the picture.

### A note on resolution

TheMealDB serves these at **700 × 700**. The menu cards and the grid are fine at that
size, which is why the design is built around square photos. The hero uses a trick: on a
wide screen the photo is shown at its own size and a blurred copy of itself fills the rest
of the frame, so nothing is ever stretched. On a phone the photo simply fills the screen.

---

## Icons in `assets/`

`favicon-32.png`, `apple-touch-icon.png`, `icon-192.png` and `icon-512.png` are drawn
from scratch by `tools/make_icons.py` (pure Python standard library, no external
libraries, no `pip install`). They are yours to use, modify and ship — no attribution
needed. Re-create them any time with:

```bash
python3 tools/make_icons.py
```

---

## Fonts

**Jost** (headings and body) and **Kaushan Script** (the wordmark in the header and
footer), both served from Google Fonts (Google Fonts Licence — free for commercial use,
no attribution required).
