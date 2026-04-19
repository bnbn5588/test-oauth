import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}`;

  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1d4ed8;">Verify your email</h2>
        <p>Thanks for signing up. Click the button below to verify your email address.</p>
        <p>This link expires in <strong>24 hours</strong>.</p>
        <a
          href="${verifyUrl}"
          style="display:inline-block;margin:16px 0;padding:12px 24px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none;font-weight:600;"
        >
          Verify Email
        </a>
        <p style="color:#6b7280;font-size:13px;">
          Or copy this link into your browser:<br/>
          <span style="word-break:break-all;">${verifyUrl}</span>
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
