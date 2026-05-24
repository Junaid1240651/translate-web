const brandName = "Video Translator";
const primaryColor = "#10b981";
const primaryDark = "#059669";
const year = new Date().getFullYear();

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatOtpCode(code: string): string {
  return code.split("").join(" ");
}

function emailBaseStyles(): string {
  return `
    html, body {
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      color-scheme: light;
    }
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
      line-height: 1.7;
      color: #1a1a1a;
      background-color: #f0f4f8;
    }
    .wrapper {
      width: 100%;
      background-color: #f0f4f8;
      padding: 40px 20px;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      background-color: #0f172a;
      color: #ffffff !important;
      padding: 40px 30px;
      text-align: center;
    }
    .header-logo {
      margin: 0 auto 16px auto;
      text-align: center;
    }
    .header-logo span {
      display: inline-block;
      width: 72px;
      height: 72px;
      line-height: 72px;
      border-radius: 16px;
      background: rgba(16, 185, 129, 0.18);
      border: 2px solid rgba(16, 185, 129, 0.35);
      font-size: 28px;
      font-weight: 800;
      color: #10b981;
      letter-spacing: -0.02em;
      text-align: center;
      vertical-align: middle;
    }
    .header h1 {
      margin: 12px 0 8px 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: 0.5px;
      color: #ffffff !important;
    }
    .header p {
      margin: 0;
      font-size: 18px;
      opacity: 0.9;
      font-weight: 400;
      color: #ffffff !important;
    }
    .content {
      background: #ffffff;
      padding: 36px 32px;
    }
    .content p {
      font-size: 16px;
      color: #334155;
      margin: 0 0 16px 0;
      line-height: 1.7;
    }
    .otp-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%);
      border: 3px solid ${primaryColor};
      border-radius: 16px;
      padding: 28px 24px;
      text-align: center;
      margin: 24px 0;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.14);
    }
    .otp-label {
      font-size: 12px;
      color: ${primaryDark};
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      margin-bottom: 12px;
    }
    .otp-code {
      font-size: 40px;
      font-weight: 800;
      letter-spacing: 10px;
      color: ${primaryDark};
      font-family: 'Courier New', ui-monospace, monospace;
    }
    .key-box {
      background: linear-gradient(135deg, #f0fdf4 0%, #ecfeff 100%);
      border: 3px solid ${primaryColor};
      border-radius: 16px;
      padding: 28px 20px;
      text-align: center;
      margin: 20px 0 24px;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.14);
    }
    .key-label {
      font-size: 12px;
      color: ${primaryDark};
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      margin-bottom: 14px;
    }
    .key-code {
      display: inline-block;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: 3px;
      color: ${primaryDark};
      font-family: 'Courier New', ui-monospace, monospace;
      word-break: break-all;
      line-height: 1.4;
    }
    .success-notice {
      background: #ecfdf5;
      border-left: 5px solid ${primaryColor};
      padding: 14px 18px;
      margin: 0 0 20px 0;
      border-radius: 0 12px 12px 0;
    }
    .success-notice p {
      margin: 0 !important;
      font-size: 15px !important;
      color: #065f46 !important;
    }
    .expiry-notice {
      background: #fef3c7;
      border-left: 5px solid #f59e0b;
      padding: 14px 18px;
      margin: 20px 0 0 0;
      border-radius: 0 12px 12px 0;
    }
    .expiry-notice p {
      margin: 0 !important;
      font-size: 15px !important;
      color: #92400e !important;
    }
    .footer {
      text-align: center;
      padding: 22px 30px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }
    .footer p {
      font-size: 13px;
      color: #64748b;
      margin: 0;
    }
    @media only screen and (max-width: 480px) {
      .wrapper { padding: 20px 12px; }
      .header { padding: 28px 20px; }
      .header h1 { font-size: 22px; }
      .content { padding: 28px 20px; }
      .otp-code { font-size: 32px; letter-spacing: 6px; }
      .key-code { font-size: 20px; letter-spacing: 2px; }
    }
  `;
}

function emailShell(opts: { headerSubtitle: string; bodyHtml: string }): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${emailBaseStyles()}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:0 auto 16px auto;">
          <tr>
            <td align="center" style="text-align:center;">
              <span style="display:inline-block;width:72px;height:72px;line-height:72px;border-radius:16px;background:rgba(16,185,129,0.18);border:2px solid rgba(16,185,129,0.35);font-size:28px;font-weight:800;color:#10b981;text-align:center;">VT</span>
            </td>
          </tr>
        </table>
        <h1>${brandName}</h1>
        <p>${escapeHtml(opts.headerSubtitle)}</p>
      </div>
      <div class="content">
        ${opts.bodyHtml}
      </div>
      <div class="footer">
        <p>© ${year} ${brandName}. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function otpBodyHtml(intro: string, code: string): string {
  const spaced = formatOtpCode(code);
  return `
    <p>${escapeHtml(intro)}</p>
    <div class="otp-box">
      <div class="otp-label">Your verification code</div>
      <div class="otp-code">${spaced}</div>
    </div>
    <div class="expiry-notice">
      <p><strong>This code expires in 10 minutes.</strong></p>
    </div>
    <p style="margin-top:24px;font-size:15px;color:#64748b;">
      If you didn't request this code, you can safely ignore this email.
    </p>
    <p style="margin-top:20px;font-size:16px;color:#334155;">
      Best regards,<br><strong style="color:#0f172a;">The ${brandName} Team</strong>
    </p>
  `;
}

function buildOtpEmail(
  headerSubtitle: string,
  intro: string,
  code: string,
  subject: string,
  textIntro: string,
) {
  const text = `${textIntro}\n\nYour code is: ${code}\n\nThis code expires in 10 minutes.\n\n— ${brandName}`;
  const html = emailShell({ headerSubtitle, bodyHtml: otpBodyHtml(intro, code) });
  return { subject, html, text };
}

export function signupOtpEmail(code: string) {
  return buildOtpEmail(
    "Email Verification",
    "Use this code to finish creating your account:",
    code,
    `Your ${brandName} verification code`,
    "Thanks for signing up! Use the verification code below to complete your registration:",
  );
}

export function loginOtpEmail(code: string) {
  return buildOtpEmail(
    "Sign In Code",
    "Enter this code where you're signing in:",
    code,
    `Your ${brandName} sign-in code`,
    "Use the sign-in code below to access your account:",
  );
}

export function passwordResetOtpEmail(code: string) {
  return buildOtpEmail(
    "Password Reset",
    "Use this code to set a new password:",
    code,
    `Reset your ${brandName} password`,
    "We received a request to reset your password. Use the code below:",
  );
}

export function contactConfirmationEmail(name: string, inquiryType: string, message: string) {
  const subject = `We received your message — ${inquiryType}`;
  const text = [
    `Hi ${name},`,
    "",
    "Thanks for contacting us. We received your message and will get back to you soon.",
    "",
    `Topic: ${inquiryType}`,
    "",
    "Your message:",
    message,
    "",
    `— ${brandName}`,
  ].join("\n");

  const body = `
    <p>Hi <strong style="color:#0f172a;">${escapeHtml(name)}</strong>,</p>
    <p>Thanks for reaching out. Our team will reply as soon as we can — usually within one to two business days.</p>
    <p style="margin:20px 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Topic</p>
    <p style="margin:0 0 20px;">
      <span style="display:inline-block;padding:8px 14px;background:#ecfdf5;border:1px solid rgba(16,185,129,0.28);border-radius:10px;font-size:14px;font-weight:600;color:${primaryDark};">${escapeHtml(inquiryType)}</span>
    </p>
    <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Your message</p>
    <div style="padding:16px 18px;background:#f0fdf4;border-radius:12px;border:1px solid rgba(16,185,129,0.2);">
      <p style="margin:0;font-size:15px;line-height:1.65;color:#0f172a;white-space:pre-wrap;word-break:break-word;">${escapeHtml(message)}</p>
    </div>
    <p style="margin-top:20px;font-size:14px;color:#64748b;">You're all set — no need to reply unless you want to add something else.</p>
  `;

  const html = emailShell({ headerSubtitle: "Message received", bodyHtml: body });
  return { subject, html, text };
}

export function contactAdminNotificationEmail(
  inquiryType: string,
  subjectLine: string,
  name: string,
  email: string,
  signedIn: boolean,
  message: string,
) {
  const subject = `[Contact] ${inquiryType}${subjectLine ? `: ${subjectLine}` : ""}`;
  const signedLabel = signedIn ? "Yes (account)" : "No (guest)";
  const text = [
    "New contact form submission",
    `Inquiry: ${inquiryType}`,
    `Subject: ${subjectLine}`,
    `From: ${name} <${email}>`,
    `Signed in: ${signedLabel}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const body = `
    <p>Someone submitted the contact form on your site.</p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;width:100px;">Inquiry</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:${primaryDark};">${escapeHtml(inquiryType)}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;">Subject</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">${escapeHtml(subjectLine)}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;">Name</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">${escapeHtml(name)}</td></tr>
      <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;"><a href="mailto:${escapeHtml(email)}" style="color:${primaryColor};text-decoration:none;">${escapeHtml(email)}</a></td></tr>
      <tr><td style="padding:10px 0;font-size:13px;color:#64748b;">Signed in</td><td style="padding:10px 0;font-size:14px;color:#0f172a;">${escapeHtml(signedLabel)}</td></tr>
    </table>
    <p style="margin:16px 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Message</p>
    <div style="padding:16px;background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;">
      <p style="margin:0;font-size:15px;line-height:1.65;color:#0f172a;white-space:pre-wrap;word-break:break-word;">${escapeHtml(message)}</p>
    </div>
  `;

  const html = emailShell({ headerSubtitle: "New contact submission", bodyHtml: body });
  return { subject, html, text };
}

function formatEmailDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function subscriptionConfirmationEmail(opts: {
  name: string;
  planName: string;
  planId: string;
  amountLabel: string;
  activationKey: string;
  expiresAt: string;
  startsAt?: string;
  orderId: string;
  paymentId: string;
  adminCopy?: boolean;
  customerEmail?: string;
}) {
  const subject = opts.adminCopy
    ? `${opts.planName} subscription — ${opts.customerEmail}`
    : `Your ${brandName} activation key — ${opts.planName}`;

  const intro = opts.adminCopy
    ? `New subscription purchased by ${opts.customerEmail}.`
    : `Thank you for subscribing. Your ${opts.planName} plan is now active — use the activation key below to unlock the Mac app.`;

  const text = [
    opts.adminCopy ? `Admin copy — customer: ${opts.customerEmail}` : `Hi ${opts.name},`,
    "",
    intro,
    "",
    `Plan: ${opts.planName}`,
    `Amount paid: ${opts.amountLabel}`,
    opts.startsAt ? `Started: ${formatEmailDate(opts.startsAt)}` : "",
    `Valid until: ${formatEmailDate(opts.expiresAt)}`,
    "",
    "YOUR ACTIVATION KEY",
    opts.activationKey,
    "",
    "How to activate in the Mac app:",
    "1. Open Video Translator on your Mac",
    "2. Paste your activation key on the license screen",
    "3. Start dubbing videos and creating audiobooks",
    "",
    "You can also view your key anytime on your account page after signing in.",
    "",
    `Payment ID: ${opts.paymentId}`,
    `Order ID: ${opts.orderId}`,
    "",
    `— ${brandName}`,
  ]
    .filter(Boolean)
    .join("\n");

  const body = opts.adminCopy
    ? `
    <p>${escapeHtml(intro)}</p>
    <p>Subscription details are below.</p>
    ${subscriptionDetailsTable(opts)}
    ${activationKeyBlock(opts.activationKey)}
    <p style="font-size:13px;color:#64748b;margin:0;">Payment ID: ${escapeHtml(opts.paymentId)} · Order ID: ${escapeHtml(opts.orderId)}</p>
  `
    : `
    <p>Hi <strong style="color:#0f172a;">${escapeHtml(opts.name)}</strong>,</p>
    <div class="success-notice">
      <p><strong>Payment successful!</strong> Your subscription is active.</p>
    </div>
    <p>${escapeHtml(intro)}</p>
    ${subscriptionDetailsTable(opts)}
    ${activationKeyBlock(opts.activationKey)}
    <p style="font-size:15px;color:#334155;margin-bottom:8px;"><strong style="color:#0f172a;">How to activate</strong></p>
    <ol style="margin:0 0 20px;padding-left:20px;color:#334155;font-size:15px;line-height:1.7;">
      <li>Open <strong>Video Translator</strong> on your Mac</li>
      <li>Paste your activation key on the license screen</li>
      <li>Start translating videos and creating audiobooks</li>
    </ol>
    <div class="expiry-notice">
      <p><strong>Keep this email safe.</strong> You will need your activation key to use the desktop app. You can also find it on your account page after signing in.</p>
    </div>
    <p style="margin-top:20px;font-size:16px;color:#334155;">
      Best regards,<br><strong style="color:#0f172a;">The ${brandName} Team</strong>
    </p>
    <p style="font-size:13px;color:#64748b;margin:16px 0 0;">Payment ID: ${escapeHtml(opts.paymentId)} · Order ID: ${escapeHtml(opts.orderId)}</p>
  `;

  const html = emailShell({
    headerSubtitle: opts.adminCopy ? "New subscription" : "Subscription confirmed",
    bodyHtml: body,
  });

  return { subject, html, text };
}

function subscriptionDetailsTable(opts: {
  planName: string;
  amountLabel: string;
  expiresAt: string;
  startsAt?: string;
  adminCopy?: boolean;
  customerEmail?: string;
}) {
  return `
    <p style="margin:20px 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Subscription</p>
    <p style="margin:0 0 16px;">
      <span style="display:inline-block;padding:8px 14px;background:#ecfdf5;border:1px solid rgba(16,185,129,0.28);border-radius:10px;font-size:14px;font-weight:600;color:${primaryDark};">${escapeHtml(opts.planName)}</span>
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 8px;">
      <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;width:120px;">Amount</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;font-weight:600;color:#0f172a;">${escapeHtml(opts.amountLabel)}</td></tr>
      ${opts.startsAt ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;">Started</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">${escapeHtml(formatEmailDate(opts.startsAt))}</td></tr>` : ""}
      <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;">Valid until</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">${escapeHtml(formatEmailDate(opts.expiresAt))}</td></tr>
      ${opts.adminCopy && opts.customerEmail ? `<tr><td style="padding:10px 0;font-size:13px;color:#64748b;">Customer</td><td style="padding:10px 0;font-size:14px;"><a href="mailto:${escapeHtml(opts.customerEmail)}" style="color:${primaryColor};text-decoration:none;">${escapeHtml(opts.customerEmail)}</a></td></tr>` : ""}
    </table>
  `;
}

function activationKeyBlock(activationKey: string) {
  return `
    <p style="margin:24px 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#64748b;">Your activation key</p>
    <div class="key-box">
      <div class="key-label">Enter this in the Mac app</div>
      <div class="key-code">${escapeHtml(activationKey)}</div>
    </div>
  `;
}
