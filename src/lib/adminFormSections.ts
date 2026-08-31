export function parseIndexedRows(formData: FormData, prefix: string): Map<number, Record<string, string>> {
  const rows = new Map<number, Record<string, string>>();
  const pattern = new RegExp(`^${prefix}\\[(\\d+)\\]\\.(\\w+)$`);

  for (const [key, value] of formData.entries()) {
    const match = key.match(pattern);
    if (!match) continue;
    const index = Number(match[1]);
    const field = match[2];
    const row = rows.get(index) ?? {};
    row[field] = String(value);
    rows.set(index, row);
  }

  return rows;
}

export function indexedRowsInOrder(formData: FormData, prefix: string): Record<string, string>[] {
  const rows = parseIndexedRows(formData, prefix);
  return Array.from(rows.keys())
    .sort((a, b) => a - b)
    .map((index) => rows.get(index)!);
}
