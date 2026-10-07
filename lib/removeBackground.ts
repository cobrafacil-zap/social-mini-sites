/**
 * Remoção de fundo para logos/imagens com fundo sólido.
 *
 * Roda 100% no navegador (Canvas), sem enviar a imagem para nenhum serviço
 * externo e sem custo de API. Funciona bem quando o fundo é liso (branco,
 * preto ou uma cor chapada) — que é o caso típico de logo.
 *
 * A borda é suavizada em vez de "cortada": pixels próximos da cor de fundo
 * recebem alfa proporcional, então o recorte não fica serrilhado.
 */

export type RemoveBgOptions = {
  /** 0–100. Quão diferente da cor de fundo o pixel precisa ser para ser mantido. */
  tolerance?: number;
  /** Corta as bordas transparentes restantes, encaixando a imagem no conteúdo. */
  trim?: boolean;
};

export type RemoveBgResult = {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  /** percentual da área que ficou transparente */
  removedPercent: number;
};

type RGB = { r: number; g: number; b: number };

const RASTER = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export function canRemoveBackground(file: File): boolean {
  return RASTER.includes(file.type);
}

export async function removeBackground(
  file: File,
  { tolerance = 32, trim = true }: RemoveBgOptions = {},
): Promise<RemoveBgResult> {
  if (typeof document === "undefined") {
    throw new Error("Remoção de fundo só funciona no navegador.");
  }
  if (!canRemoveBackground(file)) {
    throw new Error("Formato não suportado. Envie PNG, JPG ou WebP.");
  }

  const img = await loadImage(file);
  const w = img.naturalWidth;
  const h = img.naturalHeight;

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas indisponível neste navegador.");

  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h);
  const px = data.data;

  const bg = estimateBackground(px, w, h);
  const t1 = clamp(tolerance, 1, 100) * 1.414; // normaliza 0-100 → distância euclidiana
  const t2 = t1 * 2;

  let removed = 0;
  for (let i = 0; i < px.length; i += 4) {
    const a = px[i + 3]!;
    if (a === 0) {
      removed++;
      continue;
    }
    const d = dist(px[i]!, px[i + 1]!, px[i + 2]!, bg);

    if (d <= t1) {
      px[i + 3] = 0;
      removed++;
    } else if (d < t2) {
      // borda: alfa proporcional evita recorte serrilhado
      const k = (d - t1) / (t2 - t1);
      px[i + 3] = Math.round(a * k);
    }
  }

  ctx.putImageData(data, 0, 0);

  let out = ctx.getImageData(0, 0, w, h);
  if (trim) out = trimTransparent(out.data, w, h) ?? out;
  ctx.putImageData(out, 0, 0);

  const blob = await toBlob(canvas);
  return {
    blob,
    url: URL.createObjectURL(blob),
    width: canvas.width,
    height: canvas.height,
    removedPercent: Math.round((removed / (w * h)) * 100),
  };
}

/* ============================ internos ============================ */

/** Média dos pixels dos cantos e bordas — o fundo costuma ser uniforme neles. */
function estimateBackground(px: Uint8ClampedArray, w: number, h: number): RGB {
  const band = Math.max(2, Math.round(Math.min(w, h) * 0.03));
  let r = 0, g = 0, b = 0, n = 0;

  const take = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    r += px[i]!; g += px[i + 1]!; b += px[i + 2]!; n++;
  };

  for (let x = 0; x < w; x++) {
    for (let k = 0; k < band; k++) {
      take(x, k);
      take(x, h - 1 - k);
    }
  }
  for (let y = 0; y < h; y++) {
    for (let k = 0; k < band; k++) {
      take(k, y);
      take(w - 1 - k, y);
    }
  }

  return { r: Math.round(r / n), g: Math.round(g / n), b: Math.round(b / n) };
}

function dist(r: number, g: number, b: number, bg: RGB): number {
  const dr = r - bg.r;
  const dg = g - bg.g;
  const db = b - bg.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/** Recorta as bordas totalmente transparentes. Retorna null se tudo sumiu. */
function trimTransparent(
  px: Uint8ClampedArray,
  w: number,
  h: number,
): ImageData | null {
  let top = h, left = w, right = -1, bottom = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (px[(y * w + x) * 4 + 3]! > 8) {
        if (y < top) top = y;
        if (y > bottom) bottom = y;
        if (x < left) left = x;
        if (x > right) right = x;
      }
    }
  }

  if (right < 0 || bottom < 0) return null; // imagem ficou 100% transparente
  const pad = 2;
  left = Math.max(0, left - pad);
  top = Math.max(0, top - pad);
  right = Math.min(w - 1, right + pad);
  bottom = Math.min(h - 1, bottom + pad);

  const nw = right - left + 1;
  const nh = bottom - top + 1;
  const out = new Uint8ClampedArray(nw * nh * 4);

  for (let y = 0; y < nh; y++) {
    const src = ((top + y) * w + left) * 4;
    out.set(px.subarray(src, src + nw * 4), y * nw * 4);
  }

  const img = new ImageData(out, nw, nh);
  return img;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não consegui ler esta imagem."));
    };
    img.src = url;
  });
}

function toBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Falha ao gerar a imagem."))),
      "image/png",
    );
  });
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}