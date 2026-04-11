# NextAuth Setup Guide

This guide covers Steps 1-2 of integrating NextAuth.js into your Next.js OAuth application.

## ✅ Completed Steps

### Step 1: Install NextAuth.js ✓

```bash
npm install next-auth
```

NextAuth.js is now installed and ready to use.

### Step 2: Create NextAuth Configuration ✓

The NextAuth configuration has been created at:

- **Route Handler**: `src/app/api/auth/[...nextauth]/route.ts`
- **Type Definitions**: `src/types/next-auth.d.ts`
- **Session Provider**: `src/components/providers/NextAuthSessionProvider.tsx`

## 📋 What's Been Set Up

### 1. NextAuth Route Handler

Located at `src/app/api/auth/[...nextauth]/route.ts`, this file:

- ✅ Configures Google OAuth Provider
- ✅ Configures Credentials Provider (Email/Password)
- ✅ Sets up JWT callbacks
- ✅ Sets up Session callbacks
- ✅ Redirects to `/auth/login` on sign-in and error pages

### 2. Environment Variables

Created `.env.local` with placeholders for:

- `NEXTAUTH_URL` (set to `http://localhost:3000`)
- `NEXTAUTH_SECRET` (needs to be generated)
- `GOOGLE_CLIENT_ID` (needs Google OAuth credentials)
- `GOOGLE_CLIENT_SECRET` (needs Google OAuth credentials)

### 3. Type Definitions

Extended NextAuth types in `src/types/next-auth.d.ts` to include the `id` field on user sessions.

### 4. Session Provider

Created `NextAuthSessionProvider` component to wrap the application with NextAuth's session context.

### 5. Layout Integration

Updated `src/app/layout.tsx` to include the `NextAuthSessionProvider`.

## 🔐 Step 3: Configure Environment Variables

### Generate NEXTAUTH_SECRET

```bash
# On macOS/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Minimum 0 -Maximum 256) }))
```

Update `.env.local`:

```
NEXTAUTH_SECRET=<generated_secret_here>
```

### Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** > **Create Credentials** > **OAuth 2.0 Client IDs**
5. Select **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for local development)
   - `https://yourdomain.com/api/auth/callback/google` (for production)
7. Copy the **Client ID** and **Client Secret**

Update `.env.local`:

```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
```

## 📝 Current Authentication Providers

### 1. Google Provider

- ✅ Configured
- Requires: `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
- Callback: `/api/auth/callback/google`

### 2. Credentials Provider

- ✅ Configured
- Currently uses mock authentication (returns any user)
- **TODO**: Connect to your backend API for real credential verification

## 🔗 Connecting to Your Backend

The Credentials provider in `src/app/api/auth/[...nextauth]/route.ts` has a placeholder for backend API integration:

```typescript
async authorize(credentials) {
  // Replace this with your actual backend call
  const res = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: credentials?.email,
      password: credentials?.password,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) return null;
  return await res.json();
}
```

Expected response format:

```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name"
}
```

## 🧪 Testing NextAuth

1. Start the development server:

```bash
npm run dev
```

2. Visit `http://localhost:3000`

3. Click "Sign In" and test:
   - **Google Sign In**: Click the Google button
   - **Credentials Login**: Use any email/password (currently accepts all)

## 📚 Next Steps (After Backend Setup)

1. **Implement Backend API** for user registration and login
2. **Connect Credentials Provider** to your backend
3. **Set up Database** for user persistence
4. **Update Components** to use NextAuth hooks instead of custom context
5. **Add Protected Routes** middleware

## 🔧 Available NextAuth Functions

In your components, you can now use:

```typescript
import { useSession, signIn, signOut } from "next-auth/react";

// Get current session
const { data: session, status } = useSession();

// Sign in
await signIn("google"); // Google OAuth
await signIn("credentials", {
  email: "user@example.com",
  password: "password",
});

// Sign out
await signOut();
```

## 🐛 Troubleshooting

### "Invalid NEXTAUTH_SECRET"

- Make sure you've set `NEXTAUTH_SECRET` in `.env.local`
- It must be at least 32 characters long

### "Google callback failed"

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check that redirect URIs match in Google Console
- Ensure `.env.local` variables are loaded (restart dev server)

### Session not persisting

- Check that `NextAuthSessionProvider` is wrapping your app
- Verify `NEXTAUTH_SECRET` is set

## 📖 Official Documentation

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Google OAuth Provider](https://next-auth.js.org/providers/google)
- [Credentials Provider](https://next-auth.js.org/providers/credentials)
- [Session Callbacks](https://next-auth.js.org/configuration/callbacks)
