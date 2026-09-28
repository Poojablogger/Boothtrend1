// Professional frames for The Booth Trend, grouped by occasion.
// Everything is drawn on a 1080 x 1350 (4:5) canvas, which fits Instagram,
// WhatsApp status and Facebook feeds without cropping.

export const CANVAS_W = 1080;
export const CANVAS_H = 1350;

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "wedding", label: "Wedding" },
  { id: "birthday", label: "Birthday" },
  { id: "festival", label: "Festivals" },
  { id: "brand", label: "Brand promotion" },
];

/* ---------- fonts ---------- */

const SCRIPT = "'Great Vibes', 'Brush Script MT', cursive";
const DISPLAY = "'Cormorant Garamond', Georgia, serif";
const CLASSIC = "Cinzel, 'Trajan Pro', Georgia, serif";
const SANS = "Montserrat, system-ui, -apple-system, 'Segoe UI', sans-serif";

export const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Great+Vibes&family=Montserrat:wght@500;600;700;800&display=swap";

let fontsPromise = null;

// Call once when the demo opens. Resolves when the fonts are ready,
// then clears the cache so frames redraw with the proper fonts.
export function loadTemplateFonts() {
  if (typeof document === "undefined") return Promise.resolve();
  if (fontsPromise) return fontsPromise;
  fontsPromise = (async () => {
    try {
      let link = document.querySelector(`link[href="${FONT_URL}"]`);
      if (!link) {
        link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = FONT_URL;
        const loaded = new Promise((res) => {
          link.onload = res;
          link.onerror = res;
        });
        document.head.appendChild(link);
        await loaded;
      }
      const specs = [
        "400 40px 'Great Vibes'",
        "600 40px 'Cormorant Garamond'",
        "italic 500 40px 'Cormorant Garamond'",
        "600 40px Cinzel",
        "500 40px Montserrat",
        "600 40px Montserrat",
        "700 40px Montserrat",
        "800 40px Montserrat",
      ];
      await Promise.all(specs.map((s) => document.fonts.load(s)));
    } catch {
      // Offline: the fallback fonts are used instead
    }
    clearTemplateCache();
  })();
  return fontsPromise;
}

/* ---------- layer cache ----------
   Each frame is painted once into an offscreen canvas and reused,
   so the camera preview stays smooth at 30 fps. */

const cache = new Map();

export function clearTemplateCache() {
  cache.clear();
}

function withCache(t) {
  return function draw(ctx, { caption = "", subtext = "" }) {
    if (typeof document === "undefined") return t.paint(ctx, { caption, subtext });
    const key = `${t.id}|${caption}|${subtext}`;
    let layer = cache.get(key);
    if (!layer) {
      layer = document.createElement("canvas");
      layer.width = CANVAS_W;
      layer.height = CANVAS_H;
      t.paint(layer.getContext("2d"), { caption, subtext });
      if (cache.size > 80) cache.clear();
      cache.set(key, layer);
    }
    ctx.drawImage(layer, 0, 0);
  };
}

/* ---------- layout ---------- */

// Most frames: photo on top, text area at the bottom
const STD = { x: 80, y: 80, w: 920, h: 990 };
const CAPTION_Y = 1192;
const DIVIDER_Y = 1226;
const SUBTEXT_Y = 1272;
const LEFT = 150;
const RIGHT = CANVAS_W - 150;

/* ---------- helpers ---------- */

// Paint everything EXCEPT the photo window
function paintBorder(ctx, win, fill) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, CANVAS_W, CANVAS_H);
  ctx.roundRect(win.x, win.y, win.w, win.h, win.r);
  ctx.clip("evenodd");
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.restore();
}

// Soft drop shadow around the photo (only on the border, never on the photo)
function photoShadow(ctx, win, color, blur = 44, offsetY = 16) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, CANVAS_W, CANVAS_H);
  ctx.roundRect(win.x, win.y, win.w, win.h, win.r);
  ctx.clip("evenodd");
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetY = offsetY;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(win.x, win.y, win.w, win.h, win.r);
  ctx.fill();
  ctx.restore();
}

// White "print mat" edge around the photo
function mat(ctx, win, color = "#FFFFFF", size = 12) {
  const r = Array.isArray(win.r) ? win.r.map((v) => v + size / 2) : win.r + size / 2;
  outline(ctx, win.x - size / 2, win.y - size / 2, win.w + size, win.h + size, r, color, size);
}

function outline(ctx, x, y, w, h, r, color, width = 2) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.stroke();
  ctx.restore();
}

// Gold foil gradient
function foil(ctx, x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, "#9C7A35");
  g.addColorStop(0.25, "#E9CF86");
  g.addColorStop(0.5, "#B8903F");
  g.addColorStop(0.75, "#F3DE9B");
  g.addColorStop(1, "#8A6A2F");
  return g;
}

const textFoil = (ctx, y) => foil(ctx, 240, y - 70, 840, y);

function linear(ctx, x0, y0, x1, y1, stops) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c));
  return g;
}

function radial(ctx, cx, cy, r0, r1, inner, outer) {
  const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  return g;
}

// Draw text, shrinking it until it fits maxWidth
function text(ctx, str, x, y, { font, size, weight = "400", italic = false, color, align = "center", maxWidth = 580, spacing = 0, caps = false }) {
  if (!str) return 0;
  const value = caps ? str.toUpperCase() : str;
  ctx.save();
  let s = size;
  const makeFont = () => `${italic ? "italic " : ""}${weight} ${s}px ${font}`;
  ctx.font = makeFont();
  if ("letterSpacing" in ctx) ctx.letterSpacing = `${spacing}px`;
  while (ctx.measureText(value).width > maxWidth && s > 16) {
    s -= 2;
    ctx.font = makeFont();
  }
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(value, x, y);
  const width = ctx.measureText(value).width;
  ctx.restore();
  return width;
}

function watermark(ctx, color) {
  text(ctx, "The Booth Trend", CANVAS_W - 36, CANVAS_H - 26, { font: SANS, size: 18, weight: "600", color, align: "right", maxWidth: 300, spacing: 1 });
}

// Thin line - ornament - thin line
function divider(ctx, cx, y, half, color, mark = "diamond") {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - half, y);
  ctx.lineTo(cx - 20, y);
  ctx.moveTo(cx + 20, y);
  ctx.lineTo(cx + half, y);
  ctx.stroke();
  if (mark === "diamond") {
    ctx.beginPath();
    ctx.moveTo(cx, y - 7);
    ctx.lineTo(cx + 7, y);
    ctx.lineTo(cx, y + 7);
    ctx.lineTo(cx - 7, y);
    ctx.closePath();
    ctx.fill();
  } else if (mark === "heart") {
    heart(ctx, cx, y - 8, 16, color);
  } else {
    ctx.beginPath();
    ctx.arc(cx, y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// L-shaped corner ornaments with a small dot
function corners(ctx, x, y, w, h, len, color, width = 2) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = width;
  [
    [x, y, 1, 1],
    [x + w, y, -1, 1],
    [x, y + h, 1, -1],
    [x + w, y + h, -1, -1],
  ].forEach(([px, py, dx, dy]) => {
    ctx.beginPath();
    ctx.moveTo(px + dx * len, py);
    ctx.lineTo(px, py);
    ctx.lineTo(px, py + dy * len);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(px + dx * 11, py + dy * 11, 3.5, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

// "Priya & Arun" -> "P & A"
function coupleInitials(caption) {
  const skip = new Set(["&", "and", "weds", "with", "+"]);
  return caption
    .split(/\s+/)
    .filter((w) => w && !skip.has(w.toLowerCase()))
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join(" & ");
}

// "Your Brand" -> "YB"
function brandInitials(caption) {
  return caption
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

// Seeded random so decorations never move
function seeded(seed) {
  let s = seed;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// Points that land on the border only, never on the photo or the text
function borderPoints(seed, count, win) {
  const rand = seeded(seed);
  const pts = [];
  while (pts.length < count) {
    const x = rand() * CANVAS_W;
    const y = rand() * CANVAS_H;
    const inPhoto = x > win.x - 16 && x < win.x + win.w + 16 && y > win.y - 16 && y < win.y + win.h + 16;
    const inText = x > 210 && x < 870 && y > 1110 && y < 1295;
    const inMark = x > 820 && y > 1295;
    if (!inPhoto && !inText && !inMark) pts.push({ x, y, r: rand(), k: rand(), a: rand() * Math.PI });
  }
  return pts;
}
const CONFETTI = borderPoints(7, 70, STD);
const SNOW = borderPoints(11, 55, STD);
const GLINTS = borderPoints(3, 22, STD);

/* ---------- motifs ---------- */

function heart(ctx, x, y, s, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + s * 0.3);
  ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3);
  ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.8, x, y + s);
  ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3);
  ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3);
  ctx.fill();
  ctx.restore();
}

function star(ctx, cx, cy, outer, color, points = 5, innerRatio = 0.45) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : outer * innerRatio;
    const a = (Math.PI / points) * i - Math.PI / 2;
    const px = cx + Math.cos(a) * r;
    const py = cy + Math.sin(a) * r;
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

const sparkle = (ctx, cx, cy, r, color) => star(ctx, cx, cy, r, color, 4, 0.22);

function balloon(ctx, x, y, r, color) {
  ctx.save();
  ctx.strokeStyle = "rgba(60,40,80,0.25)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y + r * 1.2);
  ctx.quadraticCurveTo(x - 12, y + r * 1.2 + 35, x, y + r * 1.2 + 70);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - 6, y + r * 1.2 + 7);
  ctx.lineTo(x + 6, y + r * 1.2 + 7);
  ctx.lineTo(x, y + r * 1.2 - 2);
  ctx.fill();
  // shading
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.45, 0, x, y, r * 1.3);
  g.addColorStop(0, "rgba(255,255,255,0.6)");
  g.addColorStop(0.45, "rgba(255,255,255,0)");
  g.addColorStop(1, "rgba(0,0,0,0.18)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.ellipse(x, y, r, r * 1.2, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function diya(ctx, x, y) {
  ctx.save();
  ctx.fillStyle = radial(ctx, x, y - 44, 2, 70, "rgba(255,200,80,0.55)", "rgba(255,200,80,0)");
  ctx.beginPath();
  ctx.arc(x, y - 44, 70, 0, Math.PI * 2);
  ctx.fill();
  const flame = ctx.createLinearGradient(x, y - 66, x, y - 18);
  flame.addColorStop(0, "#FFF3B0");
  flame.addColorStop(1, "#FF9F1C");
  ctx.fillStyle = flame;
  ctx.beginPath();
  ctx.moveTo(x, y - 68);
  ctx.quadraticCurveTo(x + 14, y - 36, x, y - 20);
  ctx.quadraticCurveTo(x - 14, y - 36, x, y - 68);
  ctx.fill();
  ctx.fillStyle = foil(ctx, x - 55, y - 20, x + 55, y + 20);
  ctx.beginPath();
  ctx.moveTo(x - 58, y - 18);
  ctx.quadraticCurveTo(x, y + 44, x + 58, y - 18);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function sun(ctx, x, y, r, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI * 2 * i) / 16;
    const len = i % 2 ? 1.6 : 1.9;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r * 1.3, y + Math.sin(a) * r * 1.3);
    ctx.lineTo(x + Math.cos(a) * r * len, y + Math.sin(a) * r * len);
    ctx.stroke();
  }
  ctx.fillStyle = radial(ctx, x - r * 0.3, y - r * 0.3, 0, r * 1.2, "#FFD36B", color);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function crescent(ctx, x, y, r, color, bg) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.arc(x + r * 0.42, y - r * 0.16, r * 0.84, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  star(ctx, x + r * 0.8, y - r * 0.2, r * 0.26, color);
}

function tree(ctx, x, base, s, color) {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < 3; i++) {
    const bottom = base - i * s * 0.32;
    const w = s * (1 - i * 0.24);
    ctx.beginPath();
    ctx.moveTo(x, bottom - s * 0.52);
    ctx.lineTo(x + w / 2, bottom);
    ctx.lineTo(x - w / 2, bottom);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  star(ctx, x, base - s * 1.2, s * 0.14, color);
}

function burst(ctx, x, y, r, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  for (let i = 0; i < 16; i++) {
    const a = (Math.PI * 2 * i) / 16;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r * 0.3, y + Math.sin(a) * r * 0.3);
    ctx.lineTo(x + Math.cos(a) * r * 0.85, y + Math.sin(a) * r * 0.85);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/* ---------- templates ----------
   Each one has a paint() function. draw() is added at the bottom
   and caches the painted frame for speed. */

const LIST = [
  /* ===== WEDDING ===== */
  {
    id: "wedding-classic",
    category: "wedding",
    name: "Classic Gold",
    caption: "Priya & Arun",
    subtext: "12 December 2026",
    window: { ...STD, r: 0 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      const gold = foil(ctx, 0, 0, CANVAS_W, CANVAS_H);
      paintBorder(ctx, w, "#FFFFFF");
      outline(ctx, w.x - 16, w.y - 16, w.w + 32, w.h + 32, 0, gold, 1.5);
      corners(ctx, w.x - 32, w.y - 32, w.w + 64, w.h + 64, 64, gold, 2);
      text(ctx, caption, 540, 1196, { font: SCRIPT, size: 100, color: textFoil(ctx, 1196) });
      divider(ctx, 540, 1242, 130, gold);
      text(ctx, subtext, 540, 1286, { font: SANS, size: 20, weight: "500", color: "#6B6B6B", spacing: 6, caps: true });
      watermark(ctx, "#CFC3A8");
    },
  },
  {
    id: "wedding-blush",
    category: "wedding",
    name: "Blush Romance",
    caption: "Priya & Arun",
    subtext: "Engagement, 12 December 2026",
    window: { ...STD, r: 32 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      paintBorder(ctx, w, linear(ctx, 0, 0, 0, CANVAS_H, ["#FCF3F2", "#F3DCDB"]));
      photoShadow(ctx, w, "rgba(142,75,85,0.22)");
      mat(ctx, w, "#FFFFFF", 14);
      text(ctx, caption, 540, CAPTION_Y, { font: DISPLAY, size: 80, weight: "500", italic: true, color: "#7A3E48" });
      divider(ctx, 540, DIVIDER_Y, 120, "#D48E99", "heart");
      text(ctx, subtext, 540, SUBTEXT_Y, { font: SANS, size: 19, weight: "500", color: "#B07A82", spacing: 5, caps: true });
      watermark(ctx, "#D4A7AD");
    },
  },
  {
    id: "wedding-temple",
    category: "wedding",
    name: "Temple Wedding",
    caption: "Priya weds Arun",
    subtext: "Muhurtham, 12 December 2026",
    window: { x: 104, y: 104, w: 872, h: 956, r: 0 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      const gold = foil(ctx, 0, 0, CANVAS_W, CANVAS_H);
      paintBorder(ctx, w, radial(ctx, 540, 620, 120, 950, "#7E1629", "#43081A"));
      outline(ctx, w.x - 14, w.y - 14, w.w + 28, w.h + 28, 0, gold, 2.5);
      outline(ctx, w.x - 26, w.y - 26, w.w + 52, w.h + 52, 0, gold, 1);
      corners(ctx, w.x - 46, w.y - 46, w.w + 92, w.h + 92, 76, gold, 2.5);
      text(ctx, caption, 540, CAPTION_Y + 4, { font: CLASSIC, size: 54, weight: "600", color: textFoil(ctx, CAPTION_Y), spacing: 3 });
      divider(ctx, 540, DIVIDER_Y + 4, 140, gold);
      text(ctx, subtext, 540, SUBTEXT_Y + 6, { font: DISPLAY, size: 32, weight: "500", italic: true, color: "#F3E3C3" });
      watermark(ctx, "rgba(233,196,106,0.6)");
    },
  },
  {
    id: "wedding-monogram",
    category: "wedding",
    name: "Monogram",
    caption: "Priya & Arun",
    subtext: "12 December 2026",
    window: { x: 90, y: 90, w: 900, h: 905, r: 0 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      const gold = foil(ctx, 460, 1020, 620, 1160);
      paintBorder(ctx, w, "#F8F4EC");
      outline(ctx, w.x - 14, w.y - 14, w.w + 28, w.h + 28, 0, "#C9B48A", 1);
      ctx.save();
      ctx.strokeStyle = gold;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(540, 1086, 60, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(540, 1086, 52, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      text(ctx, coupleInitials(caption), 540, 1099, { font: DISPLAY, size: 40, weight: "600", color: gold, maxWidth: 88 });
      text(ctx, caption, 540, 1226, { font: SCRIPT, size: 78, color: "#3E3526" });
      text(ctx, subtext, 540, 1276, { font: SANS, size: 17, weight: "500", color: "#9C8D74", spacing: 6, caps: true });
      watermark(ctx, "#C8B99E");
    },
  },

  /* ===== BIRTHDAY ===== */
  {
    id: "birthday-balloons",
    category: "birthday",
    name: "Balloons",
    caption: "Happy Birthday, Aadhya",
    subtext: "Turning 5",
    window: { ...STD, r: 36 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      paintBorder(ctx, w, linear(ctx, 0, 0, 0, CANVAS_H, ["#FFFFFF", "#F6F0FD"]));
      photoShadow(ctx, w, "rgba(76,29,149,0.18)");
      balloon(ctx, 206, 1182, 19, "#F6B21A");
      balloon(ctx, 118, 1168, 31, "#FF4F8B");
      balloon(ctx, 170, 1140, 26, "#A855F7");
      balloon(ctx, CANVAS_W - 206, 1182, 19, "#FF4F8B");
      balloon(ctx, CANVAS_W - 118, 1168, 31, "#3BCEAC");
      balloon(ctx, CANVAS_W - 170, 1140, 26, "#F6B21A");
      text(ctx, caption, 540, CAPTION_Y + 6, { font: SANS, size: 56, weight: "800", color: "#2A1B3D" });
      text(ctx, subtext, 540, SUBTEXT_Y - 12, { font: SANS, size: 20, weight: "600", color: "#9A8FB0", spacing: 5, caps: true });
      watermark(ctx, "#C9C0D6");
    },
  },
  {
    id: "birthday-confetti",
    category: "birthday",
    name: "Confetti Pop",
    caption: "Party Time!",
    subtext: "Nila turns 21",
    window: { ...STD, r: 32 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      paintBorder(ctx, w, "#FFF8EE");
      const colors = ["#FF4F8B", "#F6B21A", "#3BCEAC", "#9333EA"];
      CONFETTI.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.fillStyle = p.k > 0.85 ? foil(ctx, -10, -10, 10, 10) : colors[Math.floor(p.k * 4) % 4];
        if (p.r > 0.5) ctx.fillRect(-9, -4, 18, 8);
        else {
          ctx.beginPath();
          ctx.arc(0, 0, 5 + p.r * 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      photoShadow(ctx, w, "rgba(160,90,40,0.16)");
      text(ctx, caption, 540, CAPTION_Y + 6, {
        font: SANS, size: 72, weight: "800", italic: true,
        color: linear(ctx, 260, 0, 820, 0, ["#FF7A45", "#FF4F8B", "#C026D3"]),
      });
      text(ctx, subtext, 540, SUBTEXT_Y - 8, { font: SANS, size: 20, weight: "600", color: "#9A7B5A", spacing: 5, caps: true });
      watermark(ctx, "#D8C3A0");
    },
  },
  {
    id: "birthday-star",
    category: "birthday",
    name: "Little Star",
    caption: "Little Star",
    subtext: "Kavin's 1st birthday",
    window: { ...STD, r: 44 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      paintBorder(ctx, w, linear(ctx, 0, 0, 0, CANVAS_H, ["#EEF6FD", "#D9E9F8"]));
      photoShadow(ctx, w, "rgba(30,58,95,0.18)");
      mat(ctx, w, "#FFFFFF", 14);
      [[LEFT, 1195, 34], [LEFT + 54, 1150, 15], [LEFT + 44, 1246, 11]].forEach(([x, y, r]) => {
        star(ctx, x, y, r, "#F6B21A");
        star(ctx, CANVAS_W - x, y, r, "#F6B21A");
      });
      text(ctx, caption, 540, CAPTION_Y + 6, { font: SANS, size: 62, weight: "800", color: "#1E3A5F" });
      text(ctx, subtext, 540, SUBTEXT_Y - 10, { font: SANS, size: 20, weight: "600", color: "#5B7A99", spacing: 5, caps: true });
      watermark(ctx, "#A9C4DA");
    },
  },

  /* ===== FESTIVALS ===== */
  {
    id: "festival-deepavali",
    category: "festival",
    name: "Deepavali",
    caption: "Happy Deepavali",
    subtext: "From the Kumar family",
    window: { ...STD, r: 16 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      const gold = foil(ctx, 0, 0, CANVAS_W, CANVAS_H);
      paintBorder(ctx, w, radial(ctx, 540, 1200, 80, 1100, "#1E2E57", "#0A1024"));
      outline(ctx, w.x - 14, w.y - 14, w.w + 28, w.h + 28, w.r + 10, gold, 1.5);
      GLINTS.forEach((p) => sparkle(ctx, p.x, p.y, 5 + p.r * 9, "rgba(243,222,155,0.85)"));
      diya(ctx, LEFT, 1250);
      diya(ctx, RIGHT, 1250);
      text(ctx, caption, 540, CAPTION_Y, { font: DISPLAY, size: 78, weight: "600", color: textFoil(ctx, CAPTION_Y) });
      divider(ctx, 540, DIVIDER_Y, 120, gold);
      text(ctx, subtext, 540, SUBTEXT_Y, { font: SANS, size: 19, weight: "500", color: "#E8DCC0", spacing: 5, caps: true });
      watermark(ctx, "rgba(243,222,155,0.6)");
    },
  },
  {
    id: "festival-pongal",
    category: "festival",
    name: "Pongal",
    caption: "Happy Pongal",
    subtext: "Wishes from our family",
    window: { ...STD, r: 16 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      paintBorder(ctx, w, linear(ctx, 0, 0, 0, CANVAS_H, ["#FFF7E3", "#FBE1B0"]));
      photoShadow(ctx, w, "rgba(140,80,20,0.2)");
      mat(ctx, w, "#FFFFFF", 12);
      sun(ctx, LEFT, 1205, 22, "#E8900F");
      sun(ctx, RIGHT, 1205, 22, "#E8900F");
      text(ctx, caption, 540, CAPTION_Y, { font: DISPLAY, size: 78, weight: "600", color: "#8C3A12" });
      divider(ctx, 540, DIVIDER_Y, 120, "#C98B3A");
      text(ctx, subtext, 540, SUBTEXT_Y, { font: SANS, size: 19, weight: "600", color: "#A8733A", spacing: 5, caps: true });
      watermark(ctx, "#D2AE72");
    },
  },
  {
    id: "festival-christmas",
    category: "festival",
    name: "Christmas",
    caption: "Merry Christmas",
    subtext: "Love, the Joseph family",
    window: { ...STD, r: 16 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      const gold = foil(ctx, 0, 0, CANVAS_W, CANVAS_H);
      paintBorder(ctx, w, linear(ctx, 0, 0, 0, CANVAS_H, ["#235842", "#10301F"]));
      ctx.save();
      SNOW.forEach((p) => {
        ctx.fillStyle = `rgba(255,255,255,${0.35 + p.k * 0.5})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 + p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();
      outline(ctx, w.x - 14, w.y - 14, w.w + 28, w.h + 28, w.r + 10, gold, 1.5);
      tree(ctx, LEFT, 1262, 64, foil(ctx, LEFT - 32, 1180, LEFT + 32, 1262));
      tree(ctx, RIGHT, 1262, 64, foil(ctx, RIGHT - 32, 1180, RIGHT + 32, 1262));
      text(ctx, caption, 540, CAPTION_Y + 6, { font: SCRIPT, size: 96, color: "#FFFFFF" });
      divider(ctx, 540, DIVIDER_Y + 6, 120, gold);
      text(ctx, subtext, 540, SUBTEXT_Y + 4, { font: SANS, size: 19, weight: "500", color: "#CFE3D6", spacing: 5, caps: true });
      watermark(ctx, "rgba(255,255,255,0.55)");
    },
  },
  {
    id: "festival-eid",
    category: "festival",
    name: "Eid",
    caption: "Eid Mubarak",
    subtext: "With love, the Rahman family",
    window: { x: 120, y: 80, w: 840, h: 990, r: [420, 420, 12, 12] },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      const bg = "#0F4B5B";
      const gold = foil(ctx, 0, 0, CANVAS_W, CANVAS_H);
      paintBorder(ctx, w, bg);
      outline(ctx, w.x - 16, w.y - 16, w.w + 32, w.h + 32, [436, 436, 24, 24], gold, 2);
      crescent(ctx, 150, 160, 40, "#E9CF86", bg);
      star(ctx, 930, 130, 16, "#E9CF86");
      star(ctx, 972, 190, 9, "#E9CF86");
      star(ctx, 900, 205, 7, "#E9CF86");
      text(ctx, caption, 540, CAPTION_Y, { font: DISPLAY, size: 80, weight: "600", color: textFoil(ctx, CAPTION_Y) });
      divider(ctx, 540, DIVIDER_Y, 120, gold);
      text(ctx, subtext, 540, SUBTEXT_Y, { font: SANS, size: 19, weight: "500", color: "#A9CBD2", spacing: 5, caps: true });
      watermark(ctx, "rgba(233,207,134,0.6)");
    },
  },
  {
    id: "festival-newyear",
    category: "festival",
    name: "New Year",
    caption: "Happy New Year",
    subtext: "Welcome 2027",
    window: { ...STD, r: 0 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      const gold = foil(ctx, 0, 0, CANVAS_W, CANVAS_H);
      paintBorder(ctx, w, radial(ctx, 540, 1200, 60, 1100, "#222222", "#050505"));
      outline(ctx, w.x - 16, w.y - 16, w.w + 32, w.h + 32, 0, gold, 1.5);
      corners(ctx, w.x - 32, w.y - 32, w.w + 64, w.h + 64, 56, gold, 2);
      burst(ctx, LEFT, 1205, 50, "#E9CF86");
      burst(ctx, LEFT + 58, 1148, 20, "#E9CF86");
      burst(ctx, RIGHT, 1205, 50, "#E9CF86");
      burst(ctx, RIGHT - 58, 1148, 20, "#E9CF86");
      text(ctx, caption, 540, CAPTION_Y, { font: CLASSIC, size: 56, weight: "600", color: textFoil(ctx, CAPTION_Y), spacing: 4 });
      divider(ctx, 540, DIVIDER_Y, 120, gold);
      text(ctx, subtext, 540, SUBTEXT_Y, { font: SANS, size: 20, weight: "500", color: "#E8E0CF", spacing: 7, caps: true });
      watermark(ctx, "rgba(233,207,134,0.6)");
    },
  },

  /* ===== BRAND PROMOTION ===== */
  {
    id: "brand-strip",
    category: "brand",
    name: "Brand Card",
    caption: "Your Brand",
    subtext: "Follow @yourbrand",
    window: { x: 40, y: 40, w: 1000, h: 1080, r: 0 },
    paint(ctx, { caption, subtext }) {
      paintBorder(ctx, this.window, "#FFFFFF");
      ctx.save();
      ctx.fillStyle = linear(ctx, 0, 0, CANVAS_W, 0, ["#4C1D95", "#7C3AED"]);
      ctx.fillRect(0, 1140, CANVAS_W, CANVAS_H - 1140);
      ctx.fillStyle = linear(ctx, 0, 0, CANVAS_W, 0, ["#D946EF", "#9333EA"]);
      ctx.fillRect(0, 1140, CANVAS_W, 6);
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(140, 1246, 60, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(140, 1246, 72, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      text(ctx, brandInitials(caption), 140, 1260, { font: SANS, size: 40, weight: "800", color: "#6D28D9", maxWidth: 92 });
      text(ctx, caption, 240, 1238, { font: SANS, size: 46, weight: "700", color: "#FFFFFF", align: "left", maxWidth: 600 });
      text(ctx, subtext, 240, 1282, { font: SANS, size: 22, weight: "500", color: "rgba(255,255,255,0.78)", align: "left", maxWidth: 560, spacing: 1 });
      watermark(ctx, "rgba(255,255,255,0.55)");
    },
  },
  {
    id: "brand-opening",
    category: "brand",
    name: "Grand Opening",
    caption: "Grand Opening",
    subtext: "Your Brand, now open",
    window: { x: 60, y: 60, w: 960, h: 1030, r: 24 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      paintBorder(ctx, w, linear(ctx, 0, 0, CANVAS_W, CANVAS_H, ["#D946EF", "#A21CAF", "#7E22CE"]));
      // soft diagonal sheen
      paintBorder(ctx, w, linear(ctx, 0, 0, CANVAS_W, CANVAS_H, ["rgba(255,255,255,0)", "rgba(255,255,255,0.14)", "rgba(255,255,255,0)"]));
      outline(ctx, w.x, w.y, w.w, w.h, w.r, "rgba(255,255,255,0.95)", 6);
      // ribbon
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      [[200, 262], [880, 818]].forEach(([outer, inner]) => {
        ctx.beginPath();
        ctx.moveTo(outer, 1150);
        ctx.lineTo(inner, 1150);
        ctx.lineTo(inner, 1236);
        ctx.lineTo(outer, 1236);
        ctx.lineTo(outer + (inner > outer ? 24 : -24), 1193);
        ctx.closePath();
        ctx.fill();
      });
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.roundRect(240, 1138, 600, 88, 6);
      ctx.fill();
      ctx.restore();
      text(ctx, caption, 540, 1198, { font: SANS, size: 44, weight: "800", color: linear(ctx, 260, 0, 820, 0, ["#C026D3", "#7E22CE"]), spacing: 3, caps: true, maxWidth: 540 });
      sparkle(ctx, 128, 1186, 26, "#FFFFFF");
      sparkle(ctx, CANVAS_W - 128, 1186, 26, "#FFFFFF");
      text(ctx, subtext, 540, 1286, { font: SANS, size: 21, weight: "600", color: "rgba(255,255,255,0.92)", spacing: 5, caps: true });
      watermark(ctx, "rgba(255,255,255,0.7)");
    },
  },
  {
    id: "brand-new",
    category: "brand",
    name: "Now Open",
    caption: "Now Open",
    subtext: "Follow @yourbrand for offers",
    window: { x: 60, y: 60, w: 960, h: 1030, r: 20 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      paintBorder(ctx, w, "#FFFFFF");
      photoShadow(ctx, w, "rgba(0,0,0,0.14)");
      // "NEW" seal on the photo corner
      star(ctx, 920, 170, 92, "#FF4F8B", 24, 0.88);
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.8)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 5]);
      ctx.beginPath();
      ctx.arc(920, 170, 68, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      text(ctx, "NEW", 920, 184, { font: SANS, size: 40, weight: "800", color: "#FFFFFF", maxWidth: 120, spacing: 2 });
      text(ctx, caption, 540, 1196, { font: SANS, size: 66, weight: "800", color: "#111111" });
      ctx.save();
      ctx.fillStyle = linear(ctx, 500, 0, 580, 0, ["#FF4F8B", "#9333EA"]);
      ctx.fillRect(500, 1220, 80, 6);
      ctx.restore();
      text(ctx, subtext, 540, 1274, { font: SANS, size: 21, weight: "600", color: "#E23D7B", spacing: 4, caps: true });
      watermark(ctx, "#BBBBBB");
    },
  },
  {
    id: "brand-boothtrend",
    category: "brand",
    name: "The Booth Trend",
    caption: "Say cheese!",
    subtext: "Captured at The Booth Trend",
    window: { ...STD, r: 28 },
    paint(ctx, { caption, subtext }) {
      const w = this.window;
      const brand = linear(ctx, 0, 0, CANVAS_W, 0, ["#D946EF", "#9333EA"]);
      paintBorder(ctx, w, "#FFFFFF");
      photoShadow(ctx, w, "rgba(126,34,206,0.2)");
      ctx.save();
      ctx.fillStyle = brand;
      ctx.fillRect(0, CANVAS_H - 12, CANVAS_W, 12);
      ctx.restore();
      text(ctx, caption, 540, CAPTION_Y, { font: SANS, size: 64, weight: "800", color: linear(ctx, 280, 0, 800, 0, ["#D946EF", "#9333EA"]) });
      divider(ctx, 540, DIVIDER_Y, 110, "#C4A6EA", "dot");
      text(ctx, subtext, 540, SUBTEXT_Y, { font: SANS, size: 19, weight: "600", color: "#9C86BD", spacing: 5, caps: true });
      watermark(ctx, "#C4B0E0");
    },
  },
];

export const TEMPLATES = LIST.map((t) => {
  const tpl = { ...t };
  tpl.paint = t.paint.bind(tpl);
  tpl.draw = withCache(tpl);
  return tpl;
});