export const SegmentoRecrutamento = {
  SOFTWARE_DEV: "software-dev",
  CONTABILIDADE: "contabilidade",
  IMPLEMENTOS_AGRICOLAS: "agronegocio",
  EVENTOS_CERIMONIAIS: "eventos-cerimoniais",
} as const;

export type SegmentoRecrutamento =
  (typeof SegmentoRecrutamento)[keyof typeof SegmentoRecrutamento];

export const SEGMENT_OPTIONS: { value: SegmentoRecrutamento; label: string }[] = [
  { value: SegmentoRecrutamento.SOFTWARE_DEV,        label: "Desenvolvedor" },
  { value: SegmentoRecrutamento.CONTABILIDADE,       label: "Contabilidade" },
  { value: SegmentoRecrutamento.IMPLEMENTOS_AGRICOLAS, label: "Agronegocio" },
  { value: SegmentoRecrutamento.EVENTOS_CERIMONIAIS, label: "Eventos cerimoniais" },
];

export function mapShortToSegmento(short: "dev" | "contabilidade" | "agronegocio" | "eventos-cerimoniais"): SegmentoRecrutamento {
  switch (short) {
    case "dev": return SegmentoRecrutamento.SOFTWARE_DEV;
    case "contabilidade": return SegmentoRecrutamento.CONTABILIDADE;
    case "agronegocio": return SegmentoRecrutamento.IMPLEMENTOS_AGRICOLAS;
    default: return SegmentoRecrutamento.EVENTOS_CERIMONIAIS;
  }
}
