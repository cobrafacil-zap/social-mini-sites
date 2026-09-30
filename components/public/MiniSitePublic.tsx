"use client";

import type { EventType, Site } from "@/lib/types";
import { MiniSiteShell } from "./layouts";

/**
 * Ponto único de entrada do mini site público.
 * Delega para um dos 8 layouts estruturalmente distintos conforme
 * `site.customization.layout` (persistido em JSONB, sem migração).
 *
 * Mantém o mesmo contrato usado pelo editor e pelo tracker de analytics.
 */
export function MiniSitePublic({
  site,
  interactive,
  onEvent,
  preview,
}: {
  site: Site;
  interactive: boolean;
  onEvent: (type: EventType) => void;
  preview?: boolean;
}) {
  return (
    <div className="min-h-full bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <MiniSiteShell site={site} interactive={interactive} onEvent={onEvent} preview={preview} />
    </div>
  );
}