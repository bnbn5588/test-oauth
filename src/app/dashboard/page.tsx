"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserMenu } from "@/components/auth/UserMenu";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full border-4 border-blue-500 border-t-transparent h-12 w-12"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const user = session?.user;

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-red-600">Unable to load user information</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <span className="text-lg font-bold text-white">O</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">OAuth App</h1>
          </div>
          <UserMenu />
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome, {user.name || "User"}!
            </h2>
            <p className="mt-2 text-gray-600">
              You&apos;re successfully logged in to your account.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* User Info Card */}
            <div className="rounded-lg border-2 border-blue-100 bg-blue-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Account Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="font-mono text-sm text-gray-900">
                    {user.id || "(Not available)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Getting Started Card */}
            <div className="rounded-lg border-2 border-green-100 bg-green-50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Status
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                    ✓
                  </span>
                  <span className="text-gray-700">Successfully logged in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                    ✓
                  </span>
                  <span className="text-gray-700">
                    JWT sessions configured
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                    ✓
                  </span>
                  <span className="text-gray-700">NextAuth.js active</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Debug Info */}
          <div className="mt-8 rounded-lg bg-gray-50 p-4 text-xs">
            <p className="text-gray-600">Debug Info:</p>
            <pre className="mt-2 overflow-auto bg-white p-2 rounded border">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
