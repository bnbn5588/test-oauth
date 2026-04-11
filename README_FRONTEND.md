# OAuth App - Frontend

A modern authentication application built with the latest Next.js, featuring login, registration, and Google OAuth integration.

## ✨ Features

- **Login Page** - Email/password authentication form
- **Register Page** - User registration with password confirmation
- **Google Sign In** - OAuth 2.0 integration with Google
- **Protected Dashboard** - User profile and account information
- **Beautiful UI** - Built with Tailwind CSS and responsive design

## 🚀 Getting Started

### Prerequisites

- Node.js 20.11.1 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

Development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── register/
│   │       └── page.tsx          # Registration page
│   ├── dashboard/
│   │   └── page.tsx              # Protected user dashboard
│   ├── layout.tsx                # Root layout with AuthProvider
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/
│   └── auth/
│       ├── LoginForm.tsx         # Login form component
│       ├── RegisterForm.tsx      # Register form component
│       ├── GoogleSignInButton.tsx # Google OAuth button
│       └── UserMenu.tsx          # User profile menu
└── context/
    └── AuthContext.tsx           # Authentication context & hooks
```

## 🔐 Authentication Flow

### Current Implementation (Frontend Mock)

Currently, the authentication is implemented with client-side mock handlers using React Context:

- **AuthContext** - Global authentication state management
- **useAuth Hook** - Access auth state and functions anywhere in the app
- **Local Storage** - Temporary user data storage (for demo purposes)

### Features:

1. **Login** - Email and password authentication
2. **Register** - New user account creation with validation
3. **Google Sign In** - OAuth button with mock handler
4. **Protected Routes** - Dashboard redirects to login if not authenticated
5. **Session Management** - User session persists during the session

## 🔄 Next Steps: Integrating NextAuth Backend

To complete the authentication system with a real backend, follow these steps:

### 1. Install NextAuth.js

```bash
npm install next-auth
```

### 2. Create NextAuth Configuration

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Call your backend API to verify credentials
        const res = await fetch("http://localhost:3001/api/login", {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        // Return user object if successful
        if (res.ok) return await res.json();
        return null;
      },
    }),
  ],
});

export const { GET, POST } = handlers;
```

### 3. Update Environment Variables

Create `.env.local`:

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_secret_key
```

### 4. Update AuthContext

Replace mock handlers in `src/context/AuthContext.tsx` with NextAuth session management:

```typescript
import { useSession, signIn, signOut } from "next-auth/react";

export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    // ... other handlers
  };
}
```

### 5. Set Up Backend Database

- Use Prisma with your preferred database (PostgreSQL, MySQL, SQLite)
- Create user and session tables
- Implement authentication API endpoints

### 6. Update Components

- Replace form submission handlers with NextAuth's `signIn()` function
- Use NextAuth's `useSession()` instead of custom context
- Update logout to use NextAuth's `signOut()`

## 🎨 UI Components

### Pages

- **Home** - Landing page with feature overview
- **Login** - Email/password authentication
- **Register** - User registration form
- **Dashboard** - Protected user dashboard

### Components

- **LoginForm** - Reusable login form
- **RegisterForm** - Reusable registration form
- **GoogleSignInButton** - OAuth provider button
- **UserMenu** - User profile dropdown menu

## 🛠️ Tech Stack

- **Framework**: Next.js 16+ (Latest)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Package Manager**: npm

## 📝 Environment Setup

No environment variables are required for the frontend-only mock version. When integrating NextAuth backend, you'll need:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXTAUTH_SECRET`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- AWS
- DigitalOcean
- Heroku
- etc.

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

## 📄 License

This project is open source and available under the MIT License.
