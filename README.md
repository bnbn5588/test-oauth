# OAuth App - Secure Authentication

A modern authentication application built with Next.js 16, NextAuth.js, and Prisma for secure user login, registration, and OAuth integration.

## Features

✅ **Email/Password Authentication**

- User registration with email and password
- Secure login with bcrypt password hashing
- Form validation and error handling

✅ **JWT Session Management**

- Stateless session tokens stored in secure HTTP-only cookies
- 30-day session expiration
- Automatic session refresh

✅ **Database Integration**

- PostgreSQL database via Neon
- Prisma ORM for type-safe database queries
- User model with email, name, and profile image

✅ **Google OAuth (Configured)**

- OAuth provider setup ready for integration
- Seamless social login flow
- Account linking capabilities

✅ **Dashboard & User Menu**

- Protected dashboard page requiring authentication
- User profile information display
- Sign-out functionality

## Tech Stack

- **Framework:** Next.js 16.2.3 with Turbopack
- **Authentication:** NextAuth.js 4.24.13
- **Database:** PostgreSQL (Neon cloud)
- **ORM:** Prisma 5.x
- **Styling:** Tailwind CSS 4
- **Password Hashing:** bcrypt
- **Language:** TypeScript 5

## Getting Started

### Prerequisites

- Node.js 20.11.1+
- PostgreSQL database (or Neon account)
- Environment variables configured

### Environment Variables

Create a `.env.local` file with the following:

```env
# Database
DATABASE_URL="postgresql://user:password@host/database"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Installation

```bash
# Install dependencies
npm install

# Setup database migrations
npm run migrate

# Build the project (optional)
npm run build

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── [...nextauth]/route.ts       # NextAuth configuration
│   │   ├── login/route.ts               # Login API endpoint
│   │   ├── register/route.ts            # Registration API endpoint
│   │   └── me/route.ts                  # Current user endpoint
│   ├── auth/
│   │   ├── login/page.tsx               # Login page
│   │   └── register/page.tsx            # Registration page
│   ├── dashboard/page.tsx               # Protected dashboard
│   └── layout.tsx                       # Root layout
├── components/
│   └── auth/
│       ├── LoginForm.tsx                # Login form component
│       ├── RegisterForm.tsx             # Registration form component
│       ├── GoogleSignInButton.tsx       # Google OAuth button
│       └── UserMenu.tsx                 # User dropdown menu
├── context/
│   └── AuthContext.tsx                  # Authentication context
├── lib/
│   ├── auth.ts                          # Auth utilities
│   └── prisma.ts                        # Prisma client
├── middleware.ts                        # Route protection middleware
└── prisma/
    └── schema.prisma                    # Database schema
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (credentials validation)
- `POST /api/auth/callback/credentials` - NextAuth credentials callback
- `GET /api/auth/session` - Get current session

### User

- `GET /api/auth/me` - Get current user info

## Authentication Flow

1. **Registration**: User creates account at `/auth/register`
   - Email validation
   - Password hashing with bcrypt
   - User stored in database

2. **Login**: User signs in at `/auth/login`
   - Credentials validated via CredentialsProvider
   - JWT token created with user ID and email
   - Secure HTTP-only cookie set
   - Redirected to dashboard

3. **Session Management**
   - JWT token verified on each request
   - Session callbacks populate user data
   - Automatic refresh on 30-day expiration

4. **Route Protection**
   - **Middleware (Server-side)**:
     - Unauthenticated users accessing `/dashboard` → Redirected to `/auth/login`
     - Authenticated users accessing `/auth/login`, `/auth/register`, or `/` → Redirected to `/dashboard`
   - **Client-side (Fallback)**:
     - Dashboard component redirects unauthenticated users to login
     - User menu provides logout option

## Database Schema

### User Table

```prisma
model User {
  id                String    @id @default(cuid())
  email             String    @unique
  password          String?   // Only for credentials provider
  name              String?
  image             String?
  provider          String?   // "credentials" or "google"
  emailVerified     DateTime?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  accounts          Account[]
  sessions          Session[]
}
```

### Account & Session Tables

- `Account`: OAuth provider accounts linked to users
- `Session`: JWT and database session information
- `VerificationToken`: Email verification tokens

## Key Configuration

### NextAuth Configuration (`src/app/api/auth/[...nextauth]/route.ts`)

```typescript
- Session Strategy: JWT (stateless, stored in cookies)
- Providers: Credentials, Google
- Session Max Age: 30 days
- Callbacks: JWT and Session hooks configured
```

### Route Protection Middleware (`src/middleware.ts`)

Server-side protection using NextAuth middleware:

```typescript
Protected Routes:
  - /dashboard/*          → Requires authentication
  - /api/auth/me          → Requires authentication

Public Routes:
  - /                     → Redirects authenticated users to /dashboard
  - /auth/login           → Redirects authenticated users to /dashboard
  - /auth/register        → Redirects authenticated users to /dashboard

Behavior:
  - Unauthenticated users accessing protected routes → Redirected to /auth/login
  - Authenticated users accessing auth pages → Redirected to /dashboard
  - Token validation on every request
  - Automatic session verification
```

The middleware ensures:

- Protected routes cannot be accessed without valid authentication
- Authenticated users cannot go back to login/register pages
- Root page is smart - logged-in users go to dashboard

### Password Security

- Salt rounds: 10
- Algorithm: bcrypt
- Minimum length: 6 characters

## Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build production bundle
npm run start      # Start production server
npm run lint       # Run ESLint
npm run migrate    # Run database migrations
```

## Security Features

✅ **Password Security**

- Bcrypt hashing with salt rounds
- Secure password verification

✅ **Session Security**

- JWT tokens in HTTP-only cookies
- CSRF protection via NextAuth
- Secure credential transmission

✅ **Database Security**

- Connection pooling
- Environment variable secrets
- SQL injection prevention via Prisma

## Next Steps

1. **Connect Google OAuth**
   - Get Google OAuth credentials
   - Update `.env.local` with client ID and secret
   - Test social login

2. **Email Verification**
   - Implement email verification flow
   - Add `VerificationToken` logic
   - Email confirmation required for account

3. **Advanced Features**
   - Password reset functionality
   - Email notifications
   - User profile management
   - Two-factor authentication

4. **Production Deployment**
   - Configure NEXTAUTH_URL for production domain
   - Set up HTTPS
   - Configure production database
   - Deploy to Vercel or similar platform

## Troubleshooting

### "Invalid email or password"

- Check credentials in database
- Verify password was hashed correctly during registration
- Ensure email matches registered account

### Session not persisting

- Verify `NEXTAUTH_SECRET` is set
- Check browser cookies are enabled
- Confirm JWT session strategy is configured

### Database connection errors

- Verify `DATABASE_URL` in `.env.local`
- Check network connection to database host
- Ensure Prisma migrations have been run

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT
