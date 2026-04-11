# PostgreSQL + Prisma Backend Setup Guide

## 📋 Overview

This guide walks you through setting up a PostgreSQL database with Prisma ORM for your OAuth app. The backend includes:

- **User registration endpoint** - `/api/auth/register`
- **User login endpoint** - `/api/auth/login`
- **Get current user** - `/api/auth/me`
- **Password hashing** - Secure password storage with bcrypt
- **Token management** - NextAuth session management

## 🔧 Prerequisites

- PostgreSQL installed and running
- Node.js 20.11.1+
- npm

## Step 1: Install PostgreSQL

### Windows

Download and install from: https://www.postgresql.org/download/windows/

**Installation options:**

- Choose default port: `5432`
- Set PostgreSQL password (remember this!)
- Keep "Stack Builder" optional

### macOS

```bash
brew install postgresql
brew services start postgresql
```

### Linux (Ubuntu)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo service postgresql start
```

## Step 2: Create Database

### Via Command Line

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE oauth_db;

# List databases
\l

# Exit
\q
```

### Via pgAdmin (GUI)

1. Open pgAdmin
2. Right-click "Databases" → Create → Database
3. Name: `oauth_db`
4. Click Save

## Step 3: Configure Database Connection

Update `.env.local` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/oauth_db"
```

**Format breakdown:**

- `postgresql://` - Protocol
- `postgres` - Default username
- `YOUR_PASSWORD` - PostgreSQL password (set during installation)
- `localhost` - Database host
- `5432` - Default PostgreSQL port
- `oauth_db` - Database name

### Example:

```env
DATABASE_URL="postgresql://postgres:mypassword123@localhost:5432/oauth_db"
```

## Step 4: Run Prisma Migrations

```bash
# Create initial migration
npx prisma migrate dev --name init

# This will:
# 1. Create the User and Account tables
# 2. Generate Prisma Client
# 3. Update schema files
```

Expected output:

```
✓ Created migration - 20240411_init
✓ Generated Prisma Client
```

## Step 5: Verify Database Setup

```bash
# Open Prisma Studio (GUI for database)
npx prisma studio

# This opens http://localhost:5555 in your browser
# You can see/manage Users, Accounts, and Sessions tables
```

## Step 6: Update Your Frontend Components

The API routes are ready! Update your authentication forms to use them:

### Update RegisterForm.tsx

The forms already work with the API routes. They'll:

1. Call `/api/auth/register` when registering
2. Call `/api/auth/login` (via NextAuth) when logging in
3. Create users in the database

## API Endpoints

### 1. Register User

```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response (201):
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "image": null
}

Errors:
- 400: Missing fields or password < 6 chars
- 409: User already exists
```

### 2. Login User (via NextAuth)

NextAuth calls this internally via CredentialsProvider

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "image": null
}

Errors:
- 401: Invalid email or password
```

### 3. Get Current User

```
GET /api/auth/me
Authorization: Bearer <session_token>

Response (200):
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "John Doe",
  "image": null
}

Errors:
- 401: Not authenticated
- 404: User not found
```

## Testing the Backend

### 1. Start Development Server

```bash
npm run dev
```

### 2. Test Register Endpoint

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### 3. Test Login via UI

1. Go to http://localhost:3000/auth/register
2. Create an account
3. You'll be redirected to /dashboard if successful
4. Go to http://localhost:3000/auth/login
5. Login with your credentials

### 4. View Database

```bash
npx prisma studio
```

- Create users
- View all users
- Delete test users

## Database Schema

### User Table

```prisma
model User {
  id        String     @id @default(cuid())  # Unique ID
  email     String     @unique                # Email (unique)
  password  String?                           # Hashed password
  name      String                            # User name
  image     String?                           # Profile image URL
  provider  String?    @default("credentials")  # Auth provider
  createdAt DateTime   @default(now())       # Created timestamp
  updatedAt DateTime   @updatedAt            # Updated timestamp
}
```

## Troubleshooting

### 1. Database Connection Error

```
error: could not translate host name "localhost" to address
```

**Solution:** PostgreSQL is not running

```bash
# Mac
brew services start postgresql

# Windows: Start PostgreSQL service from Services or
pg_ctl -D "C:\Program Files\PostgreSQL\15\data" start

# Linux
sudo service postgresql start
```

### 2. Authentication Failed

```
role "postgres" does not exist
```

**Solution:** Use correct PostgreSQL user. Common users:

- `postgres` (default)
- `$USER` (your system username on Linux/Mac)

### 3. Database Does Not Exist

```
createdb: error: could not translate host name
```

**Solution:** Create the database first

```bash
psql -U postgres
CREATE DATABASE oauth_db;
```

### 4. Prisma Migration Error

```
Migration failed
```

**Solution:** Reset the database

```bash
# ⚠️ WARNING: This deletes all data
npx prisma migrate reset
```

## Environment Variables Reference

```env
# Required
DATABASE_URL="postgresql://user:password@localhost:5432/oauth_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Optional (for Google OAuth)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Next Steps

1. ✅ PostgreSQL setup complete
2. ✅ Prisma migrations done
3. ✅ API routes ready
4. **Next:**
   - Add Google OAuth database support
   - Implement email verification
   - Add password reset functionality
   - Set up refresh tokens

## Useful Commands

```bash
# View database in GUI
npx prisma studio

# Check migration status
npx prisma migrate status

# Create new migration after schema changes
npx prisma migrate dev --name add_feature

# Reset database (deletes all data)
npx prisma migrate reset

# Generate Prisma Client
npx prisma generate

# View database schema
npx prisma db push
```

## Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [NextAuth Docs](https://next-auth.js.org/)
- [bcrypt Docs](https://www.npmjs.com/package/bcrypt)
