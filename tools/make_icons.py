#!/usr/bin/env python3
"""
PettyCakes favicon generator — pure Python standard library only
(no Pillow, no ImageMagick, no pip install needed).

Draws the two-layer cake slice used across the site and writes PNG icons
into ../assets/. The mark follows the site identity: a solid ink square
with a cream cake slice and one grey cherry on top.

Usage:
    python3 tools/make_icons.py                 # writes all icons
    python3 tools/make_icons.py 64 out.png      # one custom size

Design space is 64x64 units; every size is rendered from the same shapes
at 3x3 supersampling for smooth edges.
"""

import os
import struct
import sys
import zlib

# ----------------------------------------------------------------- palette
INK = (0x27, 0x27, 0x27)
CREAM = (0xFF, 0xFF, 0xFF)
ACCENT = (0x88, 0x88, 0x88)
SS = 3  # supersample factor per axis


# ----------------------------------------------------------------- helpers
def inside_rounded_rect(px, py, x, y, w, h, r):
    """True when (px,py) is inside a rounded rectangle."""
    if px < x or px > x + w or py < y or py > y + h:
        return False
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


# a simple side-view cake: slab body, dripping frosting, cherry on top
BODY_X, BODY_Y, BODY_W, BODY_H = 13.0, 27.0, 38.0, 19.0
FROST_X, FROST_Y, FROST_W, FROST_H = 12.0, 22.5, 40.0, 7.5
DRIPS = [(19.0, 29.5), (32.0, 29.5), (45.0, 29.5)]
DRIP_R = 3.4
LAYER_LINE_Y = 37.0
LAYER_LINE_H = 2.0


def sample(px, py):
    """Return RGBA for one point in the 64x64 design space."""
    if not inside_rounded_rect(px, py, 2, 2, 60, 60, 11):
        return (0, 0, 0, 0)

    # cherry on a stem
    if inside_circle(px, py, 32.0, 15.0, 3.4):
        return ACCENT + (255,)
    if inside_rounded_rect(px, py, 31.2, 17.4, 1.6, 5.4, 0.8):
        return CREAM + (255,)

    # frosting band with drips
    if inside_rounded_rect(px, py, FROST_X, FROST_Y, FROST_W, FROST_H, 2.0):
        return CREAM + (255,)
    for cx, cy in DRIPS:
        if inside_circle(px, py, cx, cy, DRIP_R):
            return CREAM + (255,)

    # cake body, with a thin gap that reads as two sponge layers
    if inside_rounded_rect(px, py, BODY_X, BODY_Y, BODY_W, BODY_H, 2.0):
        if LAYER_LINE_Y <= py <= LAYER_LINE_Y + LAYER_LINE_H:
            return INK + (255,)
        return CREAM + (255,)

    return INK + (255,)


# ----------------------------------------------------------------- render
def render(size):
    """Render the mark at `size` px and return raw RGBA rows."""
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
