import { createTransport } from "nodemailer";

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export async function sendOtpEmail(email: string, otp: string, name?: string) {
  const displayName = name ?? "there";

  await transporter.sendMail({
    from: `"AI Mentor" <${process.env.NODEMAILER_EMAIL}>`,
    to: email,
    subject: "Your AI Mentor Verification Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
        <body style="margin:0;padding:0;background:#030b1a;font-family:'Segoe UI',sans-serif;">
          <div style="max-width:480px;margin:40px auto;background:linear-gradient(135deg,rgba(10,31,61,0.95),rgba(6,18,36,0.98));border:1px solid rgba(0,212,255,0.3);border-radius:16px;padding:40px;box-shadow:0 0 40px rgba(0,212,255,0.15);">
            <div style="text-align:center;margin-bottom:32px;">
              <h1 style="margin:0;font-size:28px;background:linear-gradient(90deg,#00d4ff,#a855f7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">AI MENTOR</h1>
              <p style="color:#00d4ff;font-size:11px;letter-spacing:3px;margin:4px 0 0;">⚡ QUANTUM KNOWLEDGE CORE ⚡</p>
            </div>
            <p style="color:#94a3b8;font-size:15px;margin-bottom:8px;">Hello, <strong style="color:#e2e8f0;">${displayName}</strong></p>
            <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin-bottom:28px;">Your one-time verification code is:</p>
            <div style="text-align:center;background:rgba(0,212,255,0.08);border:1px solid rgba(0,212,255,0.3);border-radius:12px;padding:24px;margin-bottom:28px;">
              <span style="font-size:42px;font-weight:700;letter-spacing:12px;color:#00d4ff;">${otp}</span>
            </div>
            <p style="color:#64748b;font-size:12px;text-align:center;margin:0;">This code expires in <strong style="color:#94a3b8;">10 minutes</strong>. Do not share it with anyone.</p>
            <hr style="border:none;border-top:1px solid rgba(255,255,255,0.06);margin:28px 0;" />
            <p style="color:#334155;font-size:11px;text-align:center;margin:0;">CORE v4.0.2 | CREATED BY SHAFIQ CHOHAN</p>
          </div>
        </body>
      </html>
    `,
  });
}
