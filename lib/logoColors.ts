import type { Customization } from "./types";

/**
 * Extração de cores dominantes de uma logomarca — 100% no navegador.
 *
 * A ideia: a logo quase sempre vem sobre um fundo chapado (branco, transparente
 * ou preto). Amostramos as bordas para descobrir a cor de fundo, ignoramos
 * esses pixels e quantizamos o resto. O que sobra é a identidade visual real
 * da marca, e as paletas são geradas a partir dela.
 */

export type Rgb = { r: number; g: number; b: number };

/* ============================ cor ============================ */

export function hexToRgb(hex: string): Rgb | null {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: Rgb): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h: number;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h: h * 360, s, l };
}

export function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): Rgb {
  const hn = ((h % 360) + 360) % 360 / 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const ch = (t: number) => {
    let x = t;
    if (x < 0) x += 1;
    if (x > 1) x -= 1;
    if (x < 1 / 6) return p + (q - p) * 6 * x;
    if (x < 1 / 2) return q;
    if (x < 2 / 3) return p + (q - p) * (2 / 3 - x) * 6;
    return p;
  };
  return {
    r: Math.round(ch(hn + 1 / 3) * 255),
    g: Math.round(ch(hn) * 255),
    b: Math.round(ch(hn - 1 / 3) * 255),
  };
}

/** Clareia (amount > 0) ou escurece (amount < 0) mantendo o matiz. */
export function shift(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb);
  const l = amount >= 0 ? hsl.l + amount : hsl.l + amount;
  return rgbToHex(hslToRgb({ ...hsl, l: Math.max(0, Math.min(1, l)) }));
}

/** Gira o matiz preservando saturação e luminosidade. */
export function rotate(hex: string, degrees: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const hsl = rgbToHsl(rgb);
  if (hsl.s < 0.08) return hex; // cinza não tem matiz relevante
  return rgbToHex(hslToRgb({ ...hsl, h: hsl.h + degrees }));
}

export function luminance({ r, g, b }: Rgb): number {
  const f = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(a: string, b: string): number {
  const ra = hexToRgb(a), rb = hexToRgb(b);
  if (!ra || !rb) return 1;
  const la = luminance(ra), lb = luminance(rb);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/** Move a cor noHSL até atingir o contraste mínimo com `against`. */
export function ensureContrast(color: string, against: string, target = 4.5): string {
  let out = color;
  const towardDark = luminance(hexToRgb(against) ?? { r: 255, g: 255, b: 255 }) > 0.5;
  for (let i = 0; i < 22 && contrast(out, against) < target; i++) {
    out = shift(out, towardDark ? -0.04 : 0.04);
  }
  return contrast(out, against) >= target ? out : towardDark ? "#000000" : "#ffffff";
}

export function distance(a: string, b: string): number {
  const ra = hexToRgb(a), rb = hexToRgb(b);
  if (!ra || !rb) return 999;
  return Math.sqrt((ra.r - rb.r) ** 2 + (ra.g - rb.g) ** 2 + (ra.b - rb.b) ** 2);
}

function isNeutral(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return true;
  return rgbToHsl(rgb).s < 0.16;
}

/* ======================= extração da imagem ======================= */

/**
 * Cores dominantes da logo, já filtrando o fundo.
 * Lança se a imagem não puder ser lida por causa de CORS.
 */
export async function extractLogoColors(url: string, max = 5): Promise<string[]> {
  if (typeof document === "undefined") return [];

  const img = await loadImage(url);
  const size = 110; // reduz para ~12k pixels: rápido e suficiente
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  ctx.drawImage(img, 0, 0, size, size);
  const { data } = ctx.getImageData(0, 0, size, size);

  // cor de fundo = média das bordas
  const bg = borderAverage(data, size);
  const bgDist = bg ? distance(rgbToHex(bg), rgbToHex(bg)) : 0;

  // buckets de 12 bits (4096) para separar variações de ruído
  const buckets = new Map<number, { n: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3]!;
    if (a < 140) continue; // transparente

    const r = data[i]!, g = data[i + 1]!, b = data[i + 2]!;
    const d = Math.sqrt((r - bg.r) ** 2 + (g - bg.g) ** 2 + (b - bg.b) ** 2);
    if (d < 42) continue; // é o fundo

    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const cur = buckets.get(key);
    if (cur) {
      cur.n++; cur.r += r; cur.g += g; cur.b += b;
    } else {
      buckets.set(key, { n: 1, r, g, b });
    }
  }
  void bgDist;

  const ranked = [...buckets.values()]
    .map((k) => ({ hex: rgbToHex({ r: k.r / k.n, g: k.g / k.n, b: k.b / k.n }), n: k.n }))
    .sort((a, b) => b.n - a.n);

  const picked: string[] = [];
  for (const { hex, n } of ranked) {
    if (n < 4) break;                    // ruído isolado
    if (isNeutral(hex)) continue;        // branco/preto/cinza não definem marca
    if (picked.some((p) => distance(p, hex) < 58)) continue; // muito parecido
    picked.push(hex);
    if (picked.length >= max) break;
  }

  return picked;
}

function borderAverage(data: Uint8ClampedArray, size: number): Rgb {
  const band = Math.max(2, Math.round(size * 0.06));
  let r = 0, g = 0, b = 0, n = 0;
  const take = (x: number, y: number) => {
    const i = (y * size + x) * 4;
    if (data[i + 3]! < 140) return;
    r += data[i]!; g += data[i + 1]!; b += data[i + 2]!; n++;
  };
  for (let x = 0; x < size; x++) for (let k = 0; k < band; k++) { take(x, k); take(x, size - 1 - k); }
  for (let y = 0; y < size; y++) for (let k = 0; k < band; k++) { take(k, y); take(size - 1 - k, y); }
  return n ? { r: r / n, g: g / n, b: b / n } : { r: 255, g: 255, b: 255 };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // necessário para ler pixels via canvas
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Não consegui carregar a logomarca."));
    img.src = url;
  });
}

/* ===================== paletas a partir da logo ===================== */

/**
 * Gera paletas completas a partir das cores da marca.
 * Garante contraste do texto sobre o fundo e da cor principal sobre branco
 * (vários layouts escrevem texto branco sobre a cor principal).
 */
export function palettesFromLogoColors(colors: string[]): Customization[] {
  if (colors.length === 0) return [];

  const brand = colors[0]!;
  const second = colors[1];
  const accent = second ?? rotate(brand, 150);

  const tint = (hex: string, amount: number) => shift(hex, amount);

  const palettes: { name: string; value: Customization }[] = [];

  // 1 — fiel à marca, fundo bem claro
  palettes.push({
    name: "Fiel à marca",
    value: build(brand, accent, tint(brand, 0.46), ensureContrast(shift(brand, -0.32), tint(brand, 0.46), 4.5), "rounded"),
  });

  // 2 — fundo branco, cor principal viva
  palettes.push({
    name: "Colorido",
    value: build(ensureContrast(brand, "#FFFFFF", 3), rotate(accent, 18), "#FFFFFF", ensureContrast(shift(brand, -0.4), "#FFFFFF", 4.5), "pill"),
  });

  // 3 — versão profunda (boa para hero com texto branco)
  palettes.push({
    name: "Profundo",
    value: build(shift(brand, -0.3), rotate(accent, -14), tint(brand, 0.47), ensureContrast(shift(brand, -0.5), tint(brand, 0.47), 4.5), "square"),
  });

  // 4 — só entra se tiver uma terceira cor relevante
  if (colors.length > 2) {
    palettes.push({
      name: "Tríade",
      value: build(brand, colors[2]!, tint(second ?? brand, 0.45), ensureContrast(shift(brand, -0.35), tint(second ?? brand, 0.45), 4.5), "rounded"),
    });
  }

  function build(primary: string, secondary: string, background: string, text: string, buttonStyle: Customization["buttonStyle"]): Customization {
    return {
      primary: ensureContrast(primary, "#FFFFFF", 3),
      secondary: ensureContrast(secondary, background, 3),
      background,
      text,
      buttonStyle,
    };
  }

  return palettes.map((p) => p.value);
}

export function paletteNames(colors: string[]): string[] {
  const brand = colors[0]!;
  const accent = colors[1] ?? rotate(brand, 150);
  const names = ["Fiel à marca", "Colorido", "Profundo"];
  if (colors.length > 2) names.push("Tríade");
  void accent;
  return names;
}