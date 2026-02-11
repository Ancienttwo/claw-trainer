/**
 * ClawTrainer Pixel Logo Generator
 * Generates a 64x64 pixel art logo as PNG (scaled to 512x512 for usability)
 *
 * 16-color palette, hand-placed pixels, no AA
 * Run: node scripts/gen-pixel-logo.js
 */

import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";

const SIZE = 64;
const SCALE = 8; // Output: 512x512
const OUT = new URL("../assets/logo-pixel.png", import.meta.url);

// === 16-Color Palette ===
const P = {
  BG_DEEP: "#050810",
  BG_MID: "#0A1628",
  BG_TEAL_D: "#0E2A3A",
  BG_TEAL_M: "#1A4A5A",
  BG_TEAL_L: "#2A7A7A",
  CYAN: "#00E5CC",
  GOLD: "#F5C842",
  GOLD_S: "#D4A82A",
  CORAL: "#FF4D4D",
  RED: "#CC2222",
  RED_D: "#8B1111",
  RED_DD: "#551010",
  WHITE: "#FFFFFF",
  GRAY_L: "#E0E0E0",
  GRAY_M: "#888888",
  BLACK: "#2A2A2A",
};

// Pixel buffer: 64x64
const pixels = Array.from({ length: SIZE }, () =>
  Array.from({ length: SIZE }, () => P.BG_MID),
);

function px(x, y, color) {
  if (x >= 0 && x < SIZE && y >= 0 && y < SIZE) pixels[y][x] = color;
}

function rect(x, y, w, h, color) {
  for (let dy = 0; dy < h; dy++)
    for (let dx = 0; dx < w; dx++) px(x + dx, y + dy, color);
}

function hline(x, y, len, color) {
  rect(x, y, len, 1, color);
}

// === Background ===
rect(0, 0, 64, 64, P.BG_DEEP);
rect(4, 4, 56, 56, P.BG_MID);

// Scanlines
for (let i = 0; i < 20; i++) {
  const y = 8 + i * 2;
  if (y < 46) {
    const c = i < 6 ? P.BG_TEAL_D : i < 12 ? P.BG_TEAL_M : P.BG_TEAL_D;
    for (let x = 4; x < 60; x++) {
      if ((x + y) % 3 === 0) px(x, y, c);
    }
  }
}

// Grid floor
for (let y = 46; y < 58; y++) {
  for (let x = 4; x < 60; x++) {
    if (y % 4 === 2) px(x, y, P.BG_TEAL_D);
    if (x % 8 === 2 && y >= 46) px(x, y, P.BG_TEAL_D);
  }
}

// === Gold glow outline (C-shape arc) ===
// Top arc
const goldTop = [
  [23, 7],
  [24, 7],
  [25, 7],
  [26, 7],
  [27, 7],
  [28, 7],
  [29, 7],
  [30, 7],
  [31, 7],
  [32, 7],
  [33, 7],
  [34, 7],
  [35, 7],
  [36, 8],
  [37, 8],
  [38, 9],
  [39, 10],
  [40, 11],
  [41, 12],
  [42, 13],
  [42, 14],
  [43, 15],
  [43, 16],
  [43, 17],
  [43, 18],
  [43, 19],
  [43, 20],
  [43, 21],
  [43, 22],
  [43, 23],
  [43, 24],
  [43, 25],
];
for (const [x, y] of goldTop) px(x, y, P.GOLD);

// Right side going down (shadow)
const goldRight = [
  [43, 26],
  [43, 27],
  [42, 28],
  [42, 29],
  [41, 30],
  [41, 31],
  [40, 32],
  [40, 33],
  [39, 34],
  [38, 35],
  [37, 36],
  [36, 37],
  [35, 38],
  [34, 39],
  [33, 40],
  [32, 41],
  [31, 41],
  [30, 42],
  [29, 42],
  [28, 42],
  [27, 42],
  [26, 42],
  [25, 42],
  [24, 41],
  [23, 41],
  [22, 40],
  [21, 39],
];
for (const [x, y] of goldRight) px(x, y, P.GOLD_S);

// Left side going up
const goldLeft = [
  [22, 8],
  [21, 9],
  [21, 10],
  [20, 11],
  [20, 12],
  [20, 13],
  [20, 14],
  [20, 15],
  [20, 16],
  [20, 17],
  [20, 18],
  [20, 19],
  [20, 20],
  [20, 21],
  [20, 22],
  [20, 23],
  [20, 24],
  [20, 25],
  [20, 26],
  [20, 27],
  [20, 28],
  [20, 29],
  [20, 30],
  [20, 31],
  [20, 32],
  [20, 33],
  [20, 34],
  [20, 35],
  [20, 36],
  [20, 37],
  [21, 38],
];
for (const [x, y] of goldLeft) px(x, y, P.GOLD);

// === Red claw body (C-shape fill) ===

// Top of C
hline(23, 8, 13, P.CORAL);
hline(22, 9, 15, P.CORAL);
hline(22, 10, 17, P.RED);
hline(21, 11, 19, P.RED);
hline(21, 12, 20, P.RED);
hline(21, 13, 21, P.RED_D);

// Upper body
hline(21, 14, 22, P.RED);
hline(21, 15, 22, P.RED);
hline(21, 16, 22, P.RED_D);
hline(21, 17, 22, P.RED_D);

// Mid body (leave hole for pokeball)
hline(21, 18, 22, P.RED_DD);
hline(21, 19, 6, P.RED_DD);
hline(37, 19, 6, P.RED_DD);
hline(21, 20, 5, P.RED_DD);
hline(38, 20, 5, P.RED_DD);
hline(21, 21, 5, P.RED_DD);
hline(38, 21, 5, P.RED_DD);
hline(21, 22, 5, P.RED_DD);
hline(38, 22, 5, P.RED_DD);
hline(21, 23, 5, P.RED_DD);
hline(38, 23, 5, P.RED_DD);
hline(21, 24, 6, P.RED_DD);
hline(37, 24, 6, P.RED_DD);
hline(21, 25, 22, P.RED_DD);

// Lower body
hline(21, 26, 22, P.RED_D);
hline(21, 27, 21, P.RED_D);
hline(21, 28, 21, P.RED);
hline(21, 29, 20, P.RED);
hline(21, 30, 20, P.RED);
hline(21, 31, 19, P.RED_D);
hline(21, 32, 19, P.RED_D);
hline(21, 33, 19, P.RED_DD);
hline(21, 34, 18, P.RED_DD);

// Bottom curve
hline(21, 35, 17, P.RED);
hline(21, 36, 16, P.RED);
hline(21, 37, 15, P.RED_D);
hline(22, 38, 13, P.RED_D);
hline(22, 39, 12, P.RED_DD);
hline(23, 40, 10, P.RED_DD);
hline(24, 41, 7, P.RED_DD);

// === Top-left pincer (upper claw) ===
hline(15, 10, 3, P.RED);
hline(13, 11, 5, P.RED);
hline(12, 12, 6, P.CORAL);
hline(11, 13, 7, P.CORAL);
hline(10, 14, 8, P.CORAL);
hline(11, 15, 8, P.RED);
hline(12, 16, 7, P.RED);
hline(14, 17, 5, P.RED_D);
hline(16, 18, 3, P.RED_D);

// Pincer teeth
px(9, 13, P.RED);
px(8, 14, P.RED_D);
px(8, 15, P.RED_D);
px(9, 16, P.RED);
px(10, 16, P.CORAL);
px(10, 17, P.RED);

// Lower pincer of top claw
hline(16, 19, 3, P.RED);
hline(14, 20, 5, P.RED);
hline(13, 21, 6, P.CORAL);
hline(12, 22, 7, P.CORAL);
hline(11, 23, 8, P.RED);
hline(12, 24, 7, P.RED_D);
hline(14, 25, 5, P.RED_D);

// === Bottom-right arm (lower claw extension) ===

// Mechanical joint
px(41, 27, P.GRAY_M);
rect(40, 28, 2, 2, P.BLACK);

// Arm segments
hline(42, 29, 3, P.RED);
hline(42, 30, 4, P.RED);
hline(43, 31, 4, P.CORAL);
hline(43, 32, 5, P.CORAL);
hline(44, 33, 4, P.RED);
hline(44, 34, 5, P.RED);

// Joint 2
rect(46, 34, 2, 2, P.BLACK);
px(47, 34, P.GRAY_M);

hline(44, 36, 5, P.RED_D);
hline(43, 37, 6, P.RED_D);
hline(43, 38, 6, P.RED);
hline(42, 39, 6, P.RED);
hline(41, 40, 7, P.CORAL);
hline(41, 41, 7, P.CORAL);

// Lower pincer
hline(39, 42, 9, P.RED);
hline(38, 43, 10, P.CORAL);
hline(38, 44, 10, P.RED);
hline(39, 45, 8, P.RED_D);
hline(40, 46, 6, P.RED_DD);

// Lower pincer teeth
px(37, 43, P.RED_D);
px(36, 44, P.RED);
px(36, 45, P.RED);
px(37, 45, P.RED_D);

// === Pokeball ===
// Outline
hline(28, 19, 8, P.BLACK);
px(27, 20, P.BLACK);
px(36, 20, P.BLACK);
px(26, 21, P.BLACK);
px(37, 21, P.BLACK);
px(26, 22, P.BLACK);
px(37, 22, P.BLACK);
px(26, 23, P.BLACK);
px(37, 23, P.BLACK);
px(27, 24, P.BLACK);
px(36, 24, P.BLACK);
hline(28, 25, 8, P.BLACK);

// Top half (red)
hline(28, 20, 8, P.CORAL);
hline(27, 21, 10, P.CORAL);

// Center divider
hline(26, 22, 12, P.BLACK);

// Bottom half (white)
hline(27, 23, 10, P.GRAY_L);
hline(28, 24, 8, P.WHITE);

// Center button ring
px(30, 21, P.BLACK);
px(33, 21, P.BLACK);
px(30, 22, P.BLACK);
px(33, 22, P.BLACK);
px(30, 23, P.BLACK);
px(33, 23, P.BLACK);

// Center button fill
px(31, 21, P.WHITE);
px(32, 21, P.WHITE);
px(31, 22, P.WHITE);
px(32, 22, P.GRAY_L);
px(31, 23, P.GRAY_L);
px(32, 23, P.GRAY_M);

// Highlight
px(29, 20, P.WHITE);
px(30, 20, P.GRAY_L);

// === Cyan glow accents ===
px(19, 15, P.CYAN);
px(19, 16, P.CYAN);
px(19, 20, P.BG_TEAL_L);
px(44, 18, P.CYAN);
px(44, 19, P.CYAN);

// === Rounded corners (mask BG_DEEP over corners) ===
// Top-left
for (let r = 0; r < 6; r++) {
  for (let c = 0; c < 6; c++) {
    const dist = Math.sqrt((5 - r) ** 2 + (5 - c) ** 2);
    if (dist > 5.5) px(c, r, P.BG_DEEP);
  }
}
// Top-right
for (let r = 0; r < 6; r++) {
  for (let c = 0; c < 6; c++) {
    const dist = Math.sqrt((5 - r) ** 2 + (5 - c) ** 2);
    if (dist > 5.5) px(63 - c, r, P.BG_DEEP);
  }
}
// Bottom-left
for (let r = 0; r < 6; r++) {
  for (let c = 0; c < 6; c++) {
    const dist = Math.sqrt((5 - r) ** 2 + (5 - c) ** 2);
    if (dist > 5.5) px(c, 63 - r, P.BG_DEEP);
  }
}
// Bottom-right
for (let r = 0; r < 6; r++) {
  for (let c = 0; c < 6; c++) {
    const dist = Math.sqrt((5 - r) ** 2 + (5 - c) ** 2);
    if (dist > 5.5) px(63 - c, 63 - r, P.BG_DEEP);
  }
}

// === Render to canvas ===
const canvas = createCanvas(SIZE * SCALE, SIZE * SCALE);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false; // CRITICAL: no AA for pixel art

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    ctx.fillStyle = pixels[y][x];
    ctx.fillRect(x * SCALE, y * SCALE, SCALE, SCALE);
  }
}

const buf = canvas.toBuffer("image/png");
writeFileSync(OUT, buf);
console.log(`Wrote ${buf.length} bytes to ${OUT.pathname}`);
console.log(`Size: ${SIZE}x${SIZE} @ ${SCALE}x = ${SIZE * SCALE}x${SIZE * SCALE}`);
