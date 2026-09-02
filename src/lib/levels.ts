export const LEVELS = ["beginner", "intermediate", "advanced", "all"] as const;
export type Level = (typeof LEVELS)[number];

const LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Gevorderd",
  advanced: "Ervaren",
  all: "Alle niveaus",
};

export function levelLabel(level: string): string {
  return LABELS[level] ?? level;
}

/** Niveaus die een deelnemer kan kiezen (nooit "all"). */
export const PARTICIPANT_LEVELS = ["beginner", "intermediate", "advanced"] as const;
