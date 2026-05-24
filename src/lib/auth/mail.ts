import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null | undefined;

function getTransporter(): nodemailer.Transporter | null {
  if (transporter !== undefined) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  } else {
    transporter = null;
  }
  return transporter;
}

export async function sendMail(
  to: string,
  subject: string,
  html: string,
  text: string,
): Promise<void> {
  const from =
    process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@videotranslator.local";
  const tx = getTransporter();

  if (!tx) {
    console.log(`[auth email — no SMTP] to=${to} subject=${subject}\n${text}`);
    return;
  }

  await tx.sendMail({ from, to, subject, html, text });
}
