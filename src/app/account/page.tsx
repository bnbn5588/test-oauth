import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { UserMenu } from "@/components/auth/UserMenu";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      emailVerified: true,
      primaryProvider: true,
      lastSignIn: true,
      createdAt: true,
      password: true,
      accounts: {
        select: { provider: true },
      },
    },
  });

  if (!user) redirect("/auth/login");

  const linkedProviders = user.accounts.map((a) => a.provider);
  const hasCredentials = !!user.password;
  const initial = (user.name || user.email || "U")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
                <span className="text-lg font-bold text-white">O</span>
              </div>
              <span className="text-2xl font-bold text-gray-900">OAuth App</span>
            </Link>
          </div>
          <UserMenu />
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Account</h1>

        {/* Profile */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>
          <div className="flex items-center gap-4">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Avatar"}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                {initial}
              </div>
            )}
            <div>
              <p className="text-xl font-semibold text-gray-900">{user.name || "—"}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Account Status */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email verification</span>
              {user.emailVerified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                  Pending verification
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Primary sign-in method</span>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 capitalize">
                {user.primaryProvider.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Sign-in Methods */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Sign-in Methods</h2>
          <div className="space-y-3">

            {/* Credentials */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Email / Password</span>
              </div>
              {hasCredentials ? (
                <span className="text-xs font-medium text-green-600">Connected</span>
              ) : (
                <span className="text-xs text-gray-400">Not set up</span>
              )}
            </div>

            {/* Google */}
            <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-900">Google</span>
              </div>
              {linkedProviders.includes("google") ? (
                <span className="text-xs font-medium text-green-600">Connected</span>
              ) : (
                <span className="text-xs text-gray-400">Not connected</span>
              )}
            </div>

          </div>
        </div>

        {/* Account Details */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">User ID</dt>
              <dd className="font-mono text-gray-900">{user.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Member since</dt>
              <dd className="text-gray-900">{user.createdAt.toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Last sign-in</dt>
              <dd className="text-gray-900">
                {user.lastSignIn ? user.lastSignIn.toLocaleString() : "—"}
              </dd>
            </div>
            {user.emailVerified && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Email verified</dt>
                <dd className="text-gray-900">{user.emailVerified.toLocaleDateString()}</dd>
              </div>
            )}
          </dl>
        </div>
      </main>
    </div>
  );
}
