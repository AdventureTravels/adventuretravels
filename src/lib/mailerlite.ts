const API_BASE = "https://connect.mailerlite.com/api";

function apiKey() {
  return process.env.MAILERLITE_API_KEY;
}

async function mlFetch(path: string, init?: RequestInit) {
  const key = apiKey();
  if (!key) throw new Error("MAILERLITE_API_KEY is not set");

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`MailerLite API error ${res.status}: ${text}`);
  }
  return res.json();
}

/** Finds an existing MailerLite group by name (case-insensitive), or creates one. */
export async function findOrCreateGroup(name: string): Promise<string> {
  const list = await mlFetch(`/groups?limit=100`);
  const groups = (list.data ?? []) as { id: string; name: string }[];
  const existing = groups.find((g) => g.name.toLowerCase() === name.toLowerCase());
  if (existing) return existing.id;

  const created = await mlFetch(`/groups`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  return created.data.id as string;
}

/** Adds (or updates) a subscriber and assigns them to the given group. */
export async function subscribeToGroup(email: string, groupId: string): Promise<void> {
  await mlFetch(`/subscribers`, {
    method: "POST",
    body: JSON.stringify({ email, groups: [groupId] }),
  });
}

export function isMailerLiteConfigured() {
  return Boolean(apiKey());
}
