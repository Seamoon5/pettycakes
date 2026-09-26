#!/usr/bin/env python3
"""
PettyCakes favicon generator — pure Python standard library only
(no Pillow, no ImageMagick, no pip install needed).

Draws the same cake-slice mark used in the site header and writes PNG
icons into ../assets/.

Usage:
    python3 tools/make_icons.py                 # writes all icons
    python3 tools/make_icons.py 64 out.png      # one custom size

Design space is 64x64 units; every size is rendered from the same
shapes at 3x3 supersampling for smooth edges.
"""

import os
import struct
import sys
import zlib

# ----------------------------------------------------------------- palette
GOLD_TOP = (0xE8, 0xC4, 0x6A)
GOLD_BOT = (0xC9, 0xA7, 0x4D)
WHITE = (0xFF, 0xFF, 0xFF)
CREAM = (0xFF, 0xF7, 0xE6)
FILLING = (0xE7, 0xB7, 0xA0)
CHERRY = (0xC0, 0x39, 0x2B)
SS = 3  # supersample factor per axis


# ----------------------------------------------------------------- helpers
def lerp(a, b, t):
    return a + (b - a) * t


def mix(c1, c2, t):
    return tuple(lerp(c1[i], c2[i], t) for i in range(3))


def inside_rounded_rect(px, py, x, y, w, h, r):
    """True when (px,py) is inside a rounded rectangle."""
    if px < x or px > x + w or py < y or py > y + h:
        return False
    # corners
    cx = min(max(px, x + r), x + w - r)
    cy = min(max(py, y + r), y + h - r)
    dx = px - cx
    dy = py - cy
    return (dx * dx + dy * dy) <= r * r


def inside_circle(px, py, cx, cy, r):
    dx = px - cx
    dy = py - cy
    return (dx * dx + dy * dy) <= r * r


def inside_polygon(px, py, pts):
    """Ray-casting point-in-polygon test."""
    inside = False
    n = len(pts)
    j = n - 1
    for i in range(n):
        xi, yi = pts[i]
        xj, yj = pts[j]
        if (yi > py) != (yj > py):
            x_cross = (xj - xi) * (py - yi) / (yj - yi) + xi
            if px < x_cross:
                inside = not inside
        j = i
    return inside


# cake body: slightly tapered slice (top wider than bottom)
CAKE_BODY = [(18.5, 35.5), (45.5, 35.5), (42.6, 50.5), (21.4, 50.5)]
# filling stripe, clipped to the body
FILLING_POLY = [(19.4, 42.6), (44.6, 42.6), (44.1, 46.0), (19.9, 46.0)]
# frosting drips (semicircle centres along the frosting base)
DRIPS = [(21.0, 32.4), (29.5, 32.4), (38.0, 32.4), (46.5, 32.4)]
DRIP_R = 3.1


def sample(px, py):
    """Return RGBA for one point in 64x64 design space."""
    # 1. background: rounded square with a vertical gold gradient
    grad_t = min(max(py / 64.0, 0.0), 1.0)
    r, g, b = mix(GOLD_TOP, GOLD_BOT, grad_t)
    a = 255

    if not inside_rounded_rect(px, py, 2, 2, 60, 60, 16):
        return (0, 0, 0, 0)

    # 2. cherry on top
    if inside_circle(px, py, 32.0, 17.2, 2.9):
        r, g, b = CHERRY

    # 3. candle
    if inside_rounded_rect(px, py, 30.9, 18.6, 2.2, 5.2, 1.1):
        r, g, b = WHITE

    # 4. frosting band + drips
    if inside_rounded_rect(px, py, 17.0, 26.0, 30.0, 6.6, 2.2):
        r, g, b = WHITE
    for cx, cy in DRIPS:
        if inside_circle(px, py, cx, cy, DRIP_R):
            r, g, b = WHITE

    # 5. cake body
    if inside_polygon(px, py, CAKE_BODY):
        r, g, b = CREAM

        # 6. filling stripe
        if inside_polygon(px, py, FILLING_POLY):
            r, g, b = FILLING

    return (r, g, b, a)


# ----------------------------------------------------------------- render
def render(size):
    """Render the mark at `size` px and return raw RGBA bytes."""
    scale = 64.0 / size
    step = 1.0 / SS
    offset = step / 2.0
    rows = []

    for y in range(size):
        row = bytearray()
        for x in range(size):
            acc_r = acc_g = acc_b = acc_a = 0
            for sy in range(SS):
                dy = (y + offset + sy * step) * scale
                for sx in range(SS):
                    dx = (x + offset + sx * step) * scale
                    pr, pg, pb, pa = sample(dx, dy)
                    # premultiply so transparent samples do not darken edges
                    acc_r += pr * pa
                    acc_g += pg * pa
                    acc_b += pb * pa
                    acc_a += pa
            n = SS * SS
            if acc_a == 0:
                row += bytes((0, 0, 0, 0))
            else:
                row += bytes((
                    int(round(acc_r / acc_a)),
                    int(round(acc_g / acc_a)),
                    int(round(acc_b / acc_a)),
                    int(round(acc_a / n)),
                ))
        rows.append(bytes(row))
    return rows


def write_png(path, rows, size):
    raw = b"".join(b"\x00" + row for row in rows)

    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 6, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(raw, 9))
    png += chunk(b"IEND", b"")

    with open(path, "wb") as fh:
        fh.write(png)
    return len(png)


def build(size, out):
    rows = render(size)
    n = write_png(out, rows, size)
    print("  %-34s %4d x %-4d %6.1f KB" % (out, size, size, n / 1024.0))


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    assets = os.path.join(here, "..", "assets")

    # optional custom build:  python3 tools/make_icons.py 64 out.png
    if len(sys.argv) == 3:
        build(int(sys.argv[1]), sys.argv[2])
        return

    print("Building PettyCakes icons ...")
    build(32, os.path.join(assets, "favicon-32.png"))
    build(180, os.path.join(assets, "apple-touch-icon.png"))
    build(192, os.path.join(assets, "icon-192.png"))
    build(512, os.path.join(assets, "icon-512.png"))
    print("Done.")


if __name__ == "__main__":
    main()
