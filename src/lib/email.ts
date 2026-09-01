import { Resend } from "resend";

const FROM = "AdventureTravels <boekingen@adventuretravels.nl>";

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendMagicLinkEmail(email: string, url: string) {
  if (!isEmailConfigured()) {
    console.warn(`RESEND_API_KEY ontbreekt; magic link voor ${email} niet verzonden: ${url}`);
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Je inloglink voor Mijn AdventureTravels",
    html: `
      <p>Klik op onderstaande link om je boeking(en) te bekijken. Deze link is 30 minuten geldig.</p>
      <p><a href="${url}">${url}</a></p>
      <p>Heb je deze link niet aangevraagd? Dan kun je deze e-mail negeren.</p>
    `,
  });
}
