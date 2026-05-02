# 🛡️ AI Mentor Gateway

> **Secure, passwordless authentication gateway for the AI Mentor platform — built with a cyber-glass aesthetic and instant Streamlit redirection.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NextAuth](https://img.shields.io/badge/Auth.js-v5_Beta-purple?style=for-the-badge&logo=auth0&logoColor=white)](https://authjs.dev/)
[![Prisma](https://img.shields.io/badge/Prisma-6.x-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Passwordless OTP Auth** | Register & login with just an email. A 6-digit OTP is delivered via Gmail and verified server-side. |
| 🔵 **Google OAuth 2.0** | One-click sign-in with Google, fully integrated via NextAuth v5. |
| ⚡ **Instant Streamlit Bridge** | After successful auth, the user is immediately redirected to the AI Mentor Streamlit app with their name as a URL param. |
| 🌐 **Mobile-First Responsive UI** | Cyber-glass dark theme built entirely with Tailwind CSS. Works on all screen sizes with zero horizontal scroll. |
| 🛡️ **Two-Layer Session Guard** | Edge middleware (NextAuth) blocks unauthenticated requests server-side. Client-side `useSession` guard provides a second layer of protection. |
| 🍪 **Production-Safe Cookies** | Explicit `__Secure-` prefixed, `httpOnly`, `SameSite=lax` cookies on HTTPS (Vercel). Automatic dev/prod switching. |
| 🔄 **OTP Replay Protection** | Each OTP is single-use, time-limited (10 min), and marked `used: true` the moment it is consumed. |

---

## 🏗️ Architecture & Auth Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
└──────────────────┬──────────────────────────────────────────────┘
                   │
         ┌─────────▼──────────┐
         │  /auth/register     │  Enter name + email
         │  /auth/login        │  Enter email only
         └─────────┬──────────┘
                   │  POST /api/send-otp
                   │  (creates User if new, saves OTP to MongoDB)
                   ▼
         ┌─────────────────────┐
         │  Gmail → 6-digit    │  Nodemailer delivers OTP
         │  OTP email          │  (expires in 10 minutes)
         └─────────┬───────────┘
                   │
                   ▼
         ┌─────────────────────┐
         │  /auth/verify-otp   │  User enters 6-digit code
         │                     │  signIn("otp", { email, otp })
         └─────────┬───────────┘
                   │  NextAuth Credentials provider
                   │  authorize() → validates OTP → marks used
                   │  NextAuth sets session cookie (JWT)
                   ▼
         ┌─────────────────────┐
         │  /dashboard         │  Auth guard checks session
         │                     │  status === "authenticated"
         └─────────┬───────────┘
                   │  window.location.href (instant, no delay)
                   ▼
         ┌─────────────────────┐
         │  Streamlit App      │  ?name=<encoded_user_name>
         │  (AI Mentor)        │
         └─────────────────────┘

         ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─

         Google OAuth Path:
         /auth/login → signIn("google") → Google → /dashboard → Streamlit
```

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth handler
│   │   ├── send-otp/             # Generate & email OTP
│   │   └── verify-otp/           # Validate OTP (pre-check)
│   ├── auth/
│   │   ├── login/                # Email-only login page
│   │   ├── register/             # Name + email register page
│   │   └── verify-otp/           # 6-digit OTP entry page
│   ├── dashboard/                # Auth-guarded redirect page
│   └── globals.css               # Cyber-glass Tailwind utilities
├── components/
│   ├── AuthCard.tsx              # Glassmorphic card wrapper
│   ├── CyberBackground.tsx       # Animated grid + neon glows
│   ├── CyberInput.tsx            # Styled input component
│   ├── PageHeader.tsx            # AI Mentor title + tagline
│   └── SessionProvider.tsx       # NextAuth session context
├── lib/
│   ├── auth.ts                   # Full NextAuth config + Credentials provider
│   ├── mailer.ts                 # Nodemailer OTP email sender
│   └── prisma.ts                 # Prisma client singleton
├── prisma/
│   └── schema.prisma             # MongoDB schema
├── auth.config.ts                # Edge-safe NextAuth config (middleware)
└── middleware.ts                 # Route protection at the edge
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root with the following keys:

```env
# ── Database ─────────────────────────────────────────────────────────
DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>"

# ── NextAuth ──────────────────────────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate: openssl rand -base64 32>"

# ── Google OAuth ─────────────────────────────────────────────────────
GOOGLE_CLIENT_ID="<your-google-client-id>"
GOOGLE_CLIENT_SECRET="<your-google-client-secret>"

# ── Nodemailer (Gmail App Password) ───────────────────────────────────
NODEMAILER_EMAIL="your-email@gmail.com"
NODEMAILER_PASSWORD="xxxx xxxx xxxx xxxx"

# ── Streamlit Redirect ───────────────────────────────────────────────
STREAMLIT_APP_URL="https://your-app.streamlit.app"
NEXT_PUBLIC_STREAMLIT_APP_URL="https://your-app.streamlit.app"
```

> `.env.local` is in `.gitignore` — your secrets are never committed.

---

## 🚀 Local Development

```bash
# 1. Clone
git clone https://github.com/Shafiqdeveloper786/ai-mentor-gateway.git
cd ai-mentor-gateway

# 2. Install
npm install

# 3. Push schema to MongoDB
npx prisma db push

# 4. Add environment variables
# Create .env.local and fill in the keys above

# 5. Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects to the Register page.

---

## ☁️ Deployment (Vercel)

1. Push this repo to GitHub.
2. Import at [vercel.com/new](https://vercel.com/new).
3. Add all `.env.local` keys in **Vercel → Settings → Environment Variables**.
4. Set `NEXTAUTH_URL` to your production domain.
5. Add to **Google Cloud Console → Authorized Redirect URIs**:
   ```
   https://<your-domain>/api/auth/callback/google
   ```
6. Deploy — `npm run build` runs automatically.

> `__Secure-` prefixed cookies are applied automatically on HTTPS — no extra config needed.

---

## 🗃️ Database Collections (MongoDB via Prisma)

| Collection | Purpose |
|---|---|
| `User` | Name, email, image, emailVerified |
| `Account` | OAuth provider links (Google) |
| `OtpToken` | Active codes — single-use, 10-min expiry |
| `VerificationToken` | NextAuth email tokens |

---

## 📬 Google Cloud Console Setup

1. [console.cloud.google.com](https://console.cloud.google.com) → **APIs & Services** → **Credentials** → **OAuth 2.0 Client ID**
2. **Authorized JavaScript Origins**: `http://localhost:3000` + your production domain
3. **Authorized Redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://<your-domain>/api/auth/callback/google`

---

## 👤 Developer

**Muhammad Shafiq Chohan**

> *"Built with precision, secured with care."*

[![GitHub](https://img.shields.io/badge/GitHub-Shafiqdeveloper786-181717?style=flat-square&logo=github)](https://github.com/Shafiqdeveloper786)

---

## 📄 License

Private & proprietary. All rights reserved © 2026 Muhammad Shafiq Chohan.
