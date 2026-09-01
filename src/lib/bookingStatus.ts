export const STATUS_LABELS: Record<string, string> = {
  aangevraagd: "Aangevraagd",
  bevestigd: "Bevestigd",
  aanbetaling_voldaan: "Aanbetaling voldaan",
  volledig_betaald: "Volledig betaald",
  afgerond: "Afgerond",
  geannuleerd: "Geannuleerd",
  // legacy values from before the booking portal existed
  new: "Aangevraagd",
  contacted: "Contact gehad",
  done: "Afgerond",
};

export function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

export const STATUS_OPTIONS = [
  "aangevraagd",
  "bevestigd",
  "aanbetaling_voldaan",
  "volledig_betaald",
  "afgerond",
  "geannuleerd",
];
