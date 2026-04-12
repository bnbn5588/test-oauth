import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { AuthProvider } from "@prisma/client";

const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Fetch user directly from database
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password || "",
          );

          if (!passwordMatch) {
            return null;
          }

          // Return user object with all required fields as non-null
          return {
            id: user.id,
            email: user.email || credentials.email,
            name: user.name || "User",
            image: user.image || undefined,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 hours
    updateAge: 0, // Disable automatic token refresh
  },
  callbacks: {
    async signIn({ user, account }) {
      // Track OAuth provider and last sign-in
      if (user.email) {
        // Map NextAuth provider names to our AuthProvider enum
        const providerMap: Record<string, AuthProvider> = {
          google: AuthProvider.GOOGLE,
          github: AuthProvider.GITHUB,
          credentials: AuthProvider.CREDENTIALS,
        };

        const provider =
          (account && providerMap[account.provider]) ||
          AuthProvider.CREDENTIALS;

        // Update user's primary provider and last sign-in
        await prisma.user.update({
          where: { email: user.email },
          data: {
            primaryProvider: provider,
            lastSignIn: new Date(),
          },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Set issued at timestamp on first login (don't refresh it)
        token.id = user.id;
        token.iat = token.iat || Math.floor(Date.now() / 1000);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      // Calculate expiration based on original issue time, not current access
      const now = Math.floor(Date.now() / 1000);
      const maxAge = 12 * 60 * 60; // 12 hours in seconds
      session.expires = new Date(
        ((token.iat as number) || now) * 1000 + maxAge * 1000,
      ).toISOString();
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { authOptions };
