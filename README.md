# Auth App

A Next.js authentication application supporting email/password credentials and Google OAuth, built with NextAuth.js, Prisma, and PostgreSQL.

## Tech Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | NextAuth.js v4 |
| Session strategy | JWT (stateless, 12-hour expiry) |
| ORM | Prisma 5 + `@next-auth/prisma-adapter` |
| Database | PostgreSQL (Neon) |
| Styling | Tailwind CSS v4 |
| Language | TypeScript |

## Features

- Email/password registration and login (bcrypt hashing)
- Google OAuth sign-in
- JWT sessions stored in HTTP-only cookies — no database session table
- Protected routes via Next.js middleware
- OAuth provider and last sign-in tracking per user
- Session expiry countdown on dashboard

## Project Structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts   # NextAuth config — providers, callbacks
│   │   ├── register/route.ts        # POST /api/auth/register
│   │   └── me/route.ts              # GET  /api/auth/me  (protected)
│   ├── auth/
│   │   ├── login/page.tsx           # Login page
│   │   └── register/page.tsx        # Register page
│   ├── dashboard/page.tsx           # Protected dashboard with session countdown
│   └── layout.tsx                   # Root layout — wraps app with providers
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx            # Credentials login form
│   │   ├── RegisterForm.tsx         # Registration form
│   │   ├── GoogleSignInButton.tsx   # Google OAuth button
│   │   └── UserMenu.tsx             # Dropdown with sign-out
│   └── providers/
│       └── NextAuthSessionProvider.tsx
├── context/
│   └── AuthContext.tsx              # Shared auth state + helpers
├── lib/
│   ├── auth.ts                      # registerUser, loginUser, getUserBy*
│   └── prisma.ts                    # Prisma client singleton
├── middleware.ts                    # Route protection
└── types/
    └── next-auth.d.ts               # JWT / Session type extensions

prisma/
├── schema.prisma                    # Database schema
└── migrations/                      # Migration history
```

## Database Schema

### User
All users share this table regardless of how they sign in.

| Column | Notes |
|---|---|
| `id` | CUID primary key |
| `email` | Unique |
| `name` | Optional |
| `image` | Populated from Google profile for OAuth users |
| `password` | Bcrypt hash. `null` for OAuth-only users |
| `emailVerified` | Reserved for future email verification |
| `primaryProvider` | `CREDENTIALS` \| `GOOGLE` \| `GITHUB` — updated on every sign-in |
| `lastSignIn` | Updated on every sign-in |

### Account
OAuth tokens — **only OAuth sign-ins create a row here**. Credentials users have no Account row.

| Column | Notes |
|---|---|
| `provider` | e.g. `"google"` |
| `providerAccountId` | Provider's user ID |
| `access_token` | Google access token |
| `id_token` | Google ID token (contains user profile) |
| `refresh_token` | Issued on first consent only |

The PrismaAdapter writes to this table automatically on OAuth sign-in. You do not need to handle it manually.

### Session
Commented out — JWT strategy is stateless, no database sessions are written.

### VerificationToken
Reserved for future email verification (magic links).

## Authentication Flows

### Credentials (email/password)

```
Register → POST /api/auth/register → bcrypt hash → prisma.user.create
Login    → signIn("credentials") → NextAuth authorize() → bcrypt.compare → JWT cookie
```

Only the `User` table is written to. No `Account` row is created.

### Google OAuth

```
1. User clicks "Sign in with Google"
2. Browser redirects to Google — user authenticates on Google's servers
3. Google redirects to /api/auth/callback/google with an auth code
4. NextAuth exchanges the code for access_token + id_token (server-side)
5. PrismaAdapter creates or links User and Account rows automatically
6. jwt callback stamps token.id and updates primaryProvider + lastSignIn
7. Signed JWT cookie is set — no Session row is written
```

**Same email, two providers:** If a user registers with credentials first, then signs in with Google using the same email, the adapter links a new `Account` row to the existing `User` row. No duplicate user is created.

## Session Strategy

JWT sessions (`strategy: "jwt"`) are used. Sessions live in a signed HTTP-only cookie.

- No `Session` table needed
- No database hit to validate a session — the cookie is decoded on each request
- Sessions expire **12 hours after the original sign-in** (not after last activity)
- Token is not automatically refreshed — user must sign in again after expiry

## Route Protection

Enforced server-side in `src/middleware.ts` via NextAuth's `withAuth`:

| Route | Behaviour |
|---|---|
| `/dashboard/*` | Requires auth — redirects to `/auth/login` if unauthenticated |
| `/api/auth/me` | Requires auth — returns 401 if unauthenticated |
| `/`, `/auth/login`, `/auth/register` | Redirects to `/dashboard` if already authenticated |

## Environment Variables

```env
# .env.local

DATABASE_URL=          # PostgreSQL connection string (Neon or self-hosted)
NEXTAUTH_SECRET=       # Random secret for signing JWTs — required always
NEXTAUTH_URL=          # Base URL — see table below

GOOGLE_CLIENT_ID=      # From Google Cloud Console
GOOGLE_CLIENT_SECRET=  # From Google Cloud Console
```

### NEXTAUTH_URL

| Environment | Required? |
|---|---|
| `localhost` dev | No — inferred from request |
| Self-hosted server | Yes |
| Vercel | No — falls back to `VERCEL_URL` automatically |
| Custom domain on Vercel | Yes — set to your domain, not the `.vercel.app` URL |

### Google OAuth Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
3. Application type: **Web application**
4. Authorized redirect URIs — add exactly:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   For production, also add your production URL.
5. Copy the Client ID and Secret into `.env.local`

## Getting Started

```bash
# Install dependencies
npm install

# Push schema to database
npx prisma db push

# Start development server (also runs prisma generate)
npm run dev
```

## Available Scripts

```bash
npm run dev       # prisma generate + next dev
npm run build     # prisma generate + next build
npm run start     # prisma generate + next start
npm run lint      # ESLint
```

## Roadmap

- [x] Email/password authentication
- [x] Google OAuth
- [ ] Email verification on registration
- [ ] Password reset via email
- [ ] GitHub OAuth
