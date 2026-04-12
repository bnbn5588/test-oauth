"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserMenu } from "@/components/auth/UserMenu";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function calculateTimeRemaining(expiresAt: string): TimeRemaining {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  return { days, hours, minutes, seconds, total: diff };
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Update remaining time every second
  useEffect(() => {
    if (!session?.expires) return;

    const updateTimer = () => {
      const remaining = calculateTimeRemaining(session.expires);
      setTimeRemaining(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [session?.expires]);

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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                  <span className="text-gray-700">JWT sessions configured</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500 text-white">
                    ✓
                  </span>
                  <span className="text-gray-700">NextAuth.js active</span>
                </li>
              </ul>
            </div>

            {/* Session Expiration Card */}
            <div
              className={`rounded-lg border-2 p-6 ${
                timeRemaining.total > 86400000 // More than 1 day
                  ? "border-blue-100 bg-blue-50"
                  : timeRemaining.total > 3600000 // More than 1 hour
                    ? "border-yellow-100 bg-yellow-50"
                    : "border-red-100 bg-red-50"
              }`}
            >
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Session Expiration
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Expires at</p>
                  <p className="font-medium text-gray-900">
                    {session?.expires
                      ? new Date(session.expires).toLocaleString()
                      : "Unknown"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Time remaining</p>
                  <p className="font-mono text-sm font-semibold text-gray-900">
                    {timeRemaining.days}d {timeRemaining.hours}h{" "}
                    {timeRemaining.minutes}m {timeRemaining.seconds}s
                  </p>
                </div>

                {timeRemaining.total <= 0 && (
                  <div className="rounded bg-red-100 p-2 text-sm text-red-800">
                    Your session has expired. Please log in again.
                  </div>
                )}

                {timeRemaining.total > 0 && timeRemaining.total <= 3600000 && (
                  <div className="rounded bg-yellow-100 p-2 text-sm text-yellow-800">
                    ⚠️ Your session is expiring soon!
                  </div>
                )}

                {timeRemaining.total > 3600000 && (
                  <div className="rounded bg-blue-100 p-2 text-sm text-blue-800">
                    ✓ Session active and valid
                  </div>
                )}
              </div>
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
