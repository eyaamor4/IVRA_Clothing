import { NextRequest, NextResponse } from "next/server";
import { CONTACT_RECIPIENT, getMailTransport } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  const { name, email, subject, message } = await req.json();

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "Merci de remplir tous les champs." },
      { status: 400 }
    );
  }

  const transport = getMailTransport();

  if (!transport) {
    console.error(
      "Contact form: email not sent — GMAIL_USER/GMAIL_APP_PASSWORD missing in .env.local"
    );
    return NextResponse.json(
      {
        error:
          "L'envoi d'email n'est pas encore configuré sur le serveur. Contactez-nous directement par téléphone en attendant.",
      },
      { status: 503 }
    );
  }

  try {
    await transport.sendMail({
      from: `"Site IVRA" <${CONTACT_RECIPIENT}>`,
      to: CONTACT_RECIPIENT,
      replyTo: email,
      subject: `[Contact IVRA] ${subject}`,
      text: `Nom: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <p><strong>Nom :</strong> ${escapeHtml(name)}</p>
        <p><strong>Email :</strong> ${escapeHtml(email)}</p>
        <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message :</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form email failed:", err);
    return NextResponse.json(
      { error: "Impossible d'envoyer le message. Réessayez plus tard." },
      { status: 500 }
    );
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}