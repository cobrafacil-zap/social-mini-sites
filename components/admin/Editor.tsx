"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, ChevronLeft, ChevronRight, Check, Copy, QrCode, ExternalLink,
  Building2, MapPin, Clock, Images, MousePointerClick, MessageCircle, Palette,
  CheckCircle2, Loader2, CircleAlert, Smartphone, type LucideIcon,
} from "lucide-react";
import type { Site } from "@/lib/types";
import { updateSite } from "@/lib/actions/sites";
import { EditorStep } from "./EditorStep";
import { StepHealthList } from "./StepHealthList";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { MiniSitePublic } from "@/components/public/MiniSitePublic";
import { siteHealth } from "@/lib/siteHealth";

const STEPS = [
  { key: "empresa", label: "Empresa", icon: Building2 },
  { key: "local", label: "Localização", icon: MapPin },
  { key: "horario", label: "Horários", icon: Clock },
  { key: "galeria", label: "Galeria", icon: Images },
  { key: "botoes", label: "Botões", icon: MousePointerClick },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { key: "estilo", label: "Personalização", icon: Palette },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export function Editor({ initial }: { initial: Site }) {
  const [site, setSite] = useState<Site>(initial);
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPublish, setShowPublish] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef(site);
  latestRef.current = site;

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

  const root = (process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "smdigtal.com").toLowerCase();
  const publicUrl = `https://${site.slug}.${root}`;
  const isLast = step === STEPS.length - 1;
  const current: { key: StepKey; label: string; icon: LucideIcon } = STEPS[step]!;

  const progress = ((step + 1) / STEPS.length) * 100;
  const health = useMemo(() => siteHealth(site), [site]);

  return (
    <div className="min-h-screen bg-paper">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/85 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
        <div className="flex h-14 items-center gap-3 px-4 sm:px-5">
          <Link href={`/admin/client/${site.id}`} className="btn-ghost btn-sm -ml-2">
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Voltar</span>
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold tracking-[-0.01em] text-ink">
              {site.company.name || "Novo mini site"}
            </p>
            <p className="truncate text-[11px] text-muted">{site.slug}.{root}</p>
          </div>

          <SaveState saved={saved} error={error} />

          <div className="flex items-center gap-2">
            <StatusPill status={site.status} />
            <button type="button" onClick={publish} className="btn-primary btn-sm shadow-sm">
              Publicar <span className="hidden sm:inline">mini site</span>
            </button>
          </div>
        </div>
        <div className="h-[2px] w-full bg-line" role="presentation">
          <div
            className="h-full bg-primary transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1400px] items-start gap-0">
        {/* Steps desktop */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[230px] shrink-0 overflow-y-auto border-r border-line bg-white p-3 lg:block">
          <p className="px-2.5 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">
            Etapas
          </p>
          <nav className="space-y-0.5" aria-label="Etapas do editor">
            {STEPS.map((s, i) => {
              const active = step === i;
              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setStep(i)}
                  aria-current={active ? "step" : undefined}
                  className={`group flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left text-[13px] transition duration-150 ${
                    active
                      ? "bg-primary-50 font-medium text-primary"
                      : "text-ink-soft hover:bg-paper-alt hover:text-ink"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] text-[11px] font-semibold tabular-nums transition duration-150 ${
                      active ? "bg-primary text-white" : "bg-paper-alt text-ink-muted group-hover:text-ink-soft"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{s.label}</span>
                  <s.icon size={14} className="shrink-0 opacity-40" />
                </button>
              );
            })}
          </nav>

          <StepHealthList
            health={health}
            currentKey={current.key}
            onPick={(label) => {
              const i = STEPS.findIndex((s) => s.label === label);
              if (i >= 0) setStep(i);
            }}
          />

          <div className="mt-4 rounded-xl border border-line bg-paper p-3">
            <p className="text-[11.5px] font-medium text-ink-soft">Como publicar</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              As alterações são salvas automaticamente. Ao terminar a personalização, clique em{" "}
              <b className="text-ink-soft">Salvar</b> e depois em <b className="text-ink-soft">Publicar</b>.
            </p>
          </div>
        </aside>

        {/* Formulário */}
        <section className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <div className="mx-auto max-w-[640px]">
            <div className="mb-5 flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                className="btn-secondary btn-sm"
                aria-expanded={sidebarOpen}
              >
                Etapa {step + 1} de {STEPS.length} · {current.label}
              </button>
            </div>

            {sidebarOpen && (
              <nav className="mb-5 grid grid-cols-2 gap-1.5 lg:hidden" aria-label="Etapas do editor">
                {STEPS.map((s, i) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => { setStep(i); setSidebarOpen(false); }}
                    className={`flex items-center gap-2 rounded-[10px] border px-2.5 py-2 text-left text-[12.5px] transition duration-150 ${
                      step === i
                        ? "border-primary/30 bg-primary-50 text-primary"
                        : "border-line bg-white text-ink-soft hover:bg-paper-alt"
                    }`}
                  >
                    <span className="tabular-nums opacity-50">{i + 1}</span>
                    <span className="truncate">{s.label}</span>
                  </button>
                ))}
              </nav>
            )}

            <div key={current.key} className="animate-rise">
              <EditorStep
                step={current.key}
                site={site}
                set={setPath}
                onSave={saveNow}
                saved={saved}
              />
            </div>

            <div className="mt-7 flex items-center justify-between gap-3 border-t border-line pt-5">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="btn-secondary"
                style={{ opacity: step === 0 ? 0.45 : 1 }}
              >
                <ChevronLeft size={15} /> Anterior
              </button>

              {isLast ? (
                <button type="button" onClick={() => void saveNow()} className="btn-primary shadow-sm">
                  <Check size={15} /> Salvar alterações
                </button>
              ) : (
                <button type="button" onClick={() => setStep((s) => s + 1)} className="btn-primary shadow-sm">
                  Próximo <ChevronRight size={15} />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Preview */}
        <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-[400px] shrink-0 overflow-y-auto border-l border-line bg-paper-alt/60 p-6 xl:block">
          <div className="mb-4 flex items-center justify-center gap-1.5">
            <Smartphone size={13} className="text-ink-muted" />
            <p className="text-[11.5px] font-medium text-ink-muted">Pré-visualização em tempo real</p>
          </div>
          <PhoneFrame>
            <MiniSitePublic site={site} interactive={false} onEvent={() => {}} />
          </PhoneFrame>
          <p className="mt-4 text-center text-[11px] text-muted">
            A prévia não registra acessos. Publique para valer no ar.
          </p>
        </aside>
      </div>

      {showPublish && <PublishSuccess url={publicUrl} onClose={() => setShowPublish(false)} />}
    </div>
  );
}

/* ============================ Blocos ============================ */

function patchSite(site: Site, path: string, value: unknown): Site {
  const keys = path.split(".");
  const next = structuredClone(site) as any;
  let cursor: any = next;
  while (keys.length > 1) {
    cursor = cursor[keys.shift()!];
  }
  cursor[keys[0]!] = value;
  next.updatedAt = Date.now();
  return next as Site;
}

function SaveState({ saved, error }: { saved: boolean; error: string | null }) {
  if (error) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-50 px-2.5 py-1 text-[11.5px] font-medium text-danger">
        <CircleAlert size={12} /> <span className="hidden sm:inline">Erro ao salvar</span>
      </span>
    );
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11.5px] font-medium transition-colors duration-150 ${
        saved ? "text-ok" : "text-ink-muted"
      }`}
      aria-live="polite"
    >
      {saved ? <CheckCircle2 size={12} /> : <Loader2 size={12} className="animate-spin" />}
      <span className="hidden sm:inline">{saved ? "Salvo" : "Salvando…"}</span>
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string; dot: string }> = {
    published: { label: "Publicado", cls: "bg-ok-50 text-ok", dot: "bg-okDot" },
    draft: { label: "Rascunho", cls: "bg-warn-50 text-warn", dot: "bg-[#F79009]" },
    disabled: { label: "Inativo", cls: "bg-paper-alt text-ink-muted", dot: "bg-[#C8CFCC]" },
  };
  const s = map[status] ?? map.draft!;
  return (
    <span className={`badge ${s.cls} hidden sm:inline-flex`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
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
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0D1110]/40 p-4 backdrop-blur-[3px] animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Mini site publicado"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-pop animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-ok-50 text-ok">
          <Check size={20} />
        </span>
        <h3 className="mt-3.5 text-center text-[16px] font-semibold tracking-[-0.01em] text-ink">
          Mini site publicado!
        </h3>
        <p className="mt-1 break-all text-center text-[12.5px] text-muted">{url}</p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrSrc}
          alt="QR Code do mini site"
          width={152}
          height={152}
          className="mx-auto my-5 h-[152px] w-[152px] rounded-xl border border-line"
        />

        <div className="grid grid-cols-2 gap-2">
          <a href={qrSrc} download="qrcode.png" className="btn-secondary">
            <QrCode size={14} /> Baixar QR
          </a>
          <button type="button" onClick={copy} className="btn-secondary">
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Copiado" : "Copiar"}
          </button>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-2 w-full shadow-sm"
        >
          <ExternalLink size={14} /> Ver mini site publicado
        </a>
        <button type="button" onClick={onClose} className="btn-ghost mt-1.5 w-full">
          Fechar
        </button>
      </div>
    </div>
  );
}
