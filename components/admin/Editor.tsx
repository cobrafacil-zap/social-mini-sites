"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Check, Copy, QrCode, ExternalLink,
} from "lucide-react";
import type { Site } from "@/lib/types";
import { slugify, isValidSlug } from "@/lib/slugify";
import { updateSite } from "@/lib/actions/sites";
import { EditorStep } from "./EditorStep";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { MiniSitePublic } from "@/components/public/MiniSitePublic";

const STEPS = [
  { key: "empresa", label: "Empresa" },
  { key: "local", label: "Localização" },
  { key: "horario", label: "Horários" },
  { key: "galeria", label: "Galeria" },
  { key: "botoes", label: "Botões" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "estilo", label: "Personalização" },
] as const;

type StepKey = typeof STEPS[number]["key"];

export function Editor({ initial }: { initial: Site }) {
  const [site, setSite] = useState<Site>(initial);
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef(site);
  latestRef.current = site;

  // Autosave debounced
  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaved(false);
    saveTimer.current = setTimeout(async () => {
      const result = await updateSite(latestRef.current.id, latestRef.current);
      if (result?.error) setError(result.error);
      else setError(null);
      setSaved(true);
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [site]);

  const setPath = useCallback((path: string, value: unknown) => {
    setSite((prev) => patchSite(prev, path, value));
  }, []);

  const saveNow = useCallback(async () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaved(false);
    setError(null);
    const result = await updateSite(latestRef.current.id, latestRef.current);
    if (result?.error) setError(result.error);
    else setError(null);
    setSaved(true);
    return result;
  }, []);

  const publish = () => {
    setPath("status", "published");
    setShowPublish(true);
  };

  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigital.com").toLowerCase();
  const publicUrl = `https://${site.slug}.${root}`;

  return (
    <div className="min-h-screen bg-paper">
      <div className="bg-white border-b border-line py-3.5 px-6 flex items-center justify-between sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-1.5 text-[13.5px] text-neutral-700 no-underline">
          <ArrowLeft size={15} /> Voltar
        </Link>
        <div className="text-[13px] text-[#8B8B85]">
          {error ? <span className="text-danger">{error}</span> : saved ? "Salvo" : "Salvando…"}
        </div>
        <div className="flex gap-2 items-center">
          <StatusBadge status={site.status} />
          <button
            type="button"
            onClick={publish}
            className="bg-primary text-white border-0 rounded-lg px-4 py-2 text-[13px] font-semibold cursor-pointer"
          >
            Publicar mini site
          </button>
        </div>
      </div>

      <div className="grid grid-cols-[300px_1fr_400px] gap-0 items-start max-[1100px]:grid-cols-1">
        <aside className="py-5 px-4 border-r border-line sticky top-[57px] max-h-[calc(100vh-57px)] overflow-y-auto">
          {STEPS.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => setStep(i)}
              className="block w-full text-left py-2.5 px-3 rounded-lg mb-0.5 text-[13.5px] border-0 cursor-pointer"
              style={{
                background: step === i ? "#EAF1EE" : "transparent",
                color: step === i ? "#145C4B" : "#3A3D38",
                fontWeight: step === i ? 600 : 500,
              }}
            >
              {i + 1}. {s.label}
            </button>
          ))}
        </aside>

        <section className="py-6 px-8 max-w-[620px]">
          <EditorStep step={STEPS[step].key} site={site} set={setPath} onSave={saveNow} saved={saved} />
          <div className="flex justify-between mt-6">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-[13px] text-neutral-700 bg-white border border-line rounded-lg py-2 px-3.5 cursor-pointer"
              style={{ opacity: step === 0 ? 0.35 : 1 }}
            >
              <ChevronLeft size={15} /> Anterior
            </button>
            {STEPS[step].key === "estilo" ? (
              <button
                type="button"
                onClick={async () => { const r = await saveNow(); if (!r?.error) { /* feedback via_saved */ } }}
                className="flex items-center gap-1 text-[13px] bg-primary text-white border border-primary rounded-lg py-2 px-5 font-semibold cursor-pointer"
              >
                <Check size={15} /> Salvar alterações
              </button>
            ) : (
              <button
                type="button"
                disabled={step === STEPS.length - 1}
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1 text-[13px] text-neutral-700 bg-white border border-line rounded-lg py-2 px-3.5 cursor-pointer"
                style={{ opacity: step === STEPS.length - 1 ? 0.35 : 1 }}
              >
                Próximo <ChevronRight size={15} />
              </button>
            )}
          </div>
        </section>

        <aside className="py-6 px-5 sticky top-[57px] max-h-[calc(100vh-57px)] overflow-y-auto">
          <p className="text-[12.5px] text-[#8B8B85] mb-2.5 text-center">Pré-visualização em tempo real</p>
          <PhoneFrame>
            <MiniSitePublic site={site} interactive={false} onEvent={() => {}} />
          </PhoneFrame>
        </aside>
      </div>

      {showPublish && (
        <PublishSuccess
          url={publicUrl}
          onClose={() => setShowPublish(false)}
        />
      )}
    </div>
  );
}

function patchSite(site: Site, path: string, value: unknown): Site {
  const keys = path.split(".");
  const next = structuredClone(site) as any;
  let cursor = next;
  while (keys.length > 1) {
    cursor = cursor[keys[0]!];
    keys.shift();
  }
  cursor[keys[0]!] = value;
  next.updatedAt = Date.now();
  return next as Site;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; fg: string }> = {
    draft: { label: "Rascunho", bg: "#FBF3DF", fg: "#93650F" },
    published: { label: "Publicado", bg: "#E4F3EC", fg: "#0E6B4F" },
    disabled: { label: "Desativado", bg: "#F1E7E6", fg: "#9C3B31" },
  };
  const s = map[status] ?? map.draft;
  return (
    <span className="px-2.5 py-1 rounded-md text-xs font-medium inline-block" style={{ background: s.bg, color: s.fg }}>
      {s.label}
    </span>
  );
}

function PublishSuccess({ url, onClose }: { url: string; onClose: () => void }) {
  const qrSrc = `/api/qr?data=${encodeURIComponent(url)}&size=220`;
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="fixed inset-0 bg-[rgba(20,20,18,0.5)] flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl p-7 w-[380px] text-center">
        <div className="w-11 h-11 rounded-full bg-[#E4F3EC] flex items-center justify-center mx-auto mb-3.5">
          <Check size={20} color="#0E6B4F" />
        </div>
        <h3 className="text-base font-semibold text-ink mb-1">Mini site publicado!</h3>
        <p className="text-[13px] text-muted mb-4 break-all">{url}</p>
        <img src={qrSrc} alt="QR Code" width={160} height={160} className="mx-auto mb-[18px] rounded-lg border border-line" />
        <div className="flex gap-2">
          <a
            href={qrSrc}
            download="qrcode.png"
            className="flex-1 flex items-center justify-center gap-1.5 text-[13px] text-neutral-700 bg-white border border-line rounded-lg py-2 no-underline"
          >
            <QrCode size={14} /> Baixar QR
          </a>
          <button
            type="button"
            onClick={copy}
            className="flex-1 flex items-center justify-center gap-1.5 text-[13px] text-neutral-700 bg-white border border-line rounded-lg py-2 cursor-pointer"
          >
            <Copy size={14} /> {copied ? "Copiado!" : "Copiar link"}
          </button>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mt-2.5 bg-primary text-white border-0 rounded-lg py-2.5 text-[13.5px] font-semibold no-underline"
        >
          Ver mini site publicado <ExternalLink size={13} className="inline -mt-0.5" />
        </a>
        <button
          type="button"
          onClick={onClose}
          className="mt-3 text-[12.5px] text-[#8B8B85] bg-transparent border-0 cursor-pointer"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}