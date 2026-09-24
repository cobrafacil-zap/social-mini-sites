"use client";

import type { Site } from "@/lib/types";
import { StepEmpresa } from "./steps/StepEmpresa";
import { StepLocal } from "./steps/StepLocal";
import { StepHorario } from "./steps/StepHorario";
import { StepGaleria } from "./steps/StepGaleria";
import { StepBotoes } from "./steps/StepBotoes";
import { StepWhatsapp } from "./steps/StepWhatsapp";
import { StepEstilo } from "./steps/StepEstilo";

type StepKey = "empresa" | "local" | "horario" | "galeria" | "botoes" | "whatsapp" | "estilo";

export function EditorStep({
  step, site, set, onSave, saved,
}: { step: StepKey; site: Site; set: (path: string, value: unknown) => void; onSave?: () => Promise<unknown>; saved?: boolean }) {
  switch (step) {
    case "empresa": return <StepEmpresa site={site} set={set} />;
    case "local":   return <StepLocal site={site} set={set} />;
    case "horario": return <StepHorario site={site} set={set} />;
    case "galeria": return <StepGaleria site={site} set={set} />;
    case "botoes":  return <StepBotoes site={site} set={set} />;
    case "whatsapp":return <StepWhatsapp site={site} set={set} />;
    case "estilo":  return <StepEstilo site={site} set={set} onSave={onSave} saved={saved} />;
  }
}