"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <span className="text-lg font-bold text-white">O</span>
            </div>
            <span className="text-xl font-bold text-gray-900">OAuth App</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/auth/login"
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-lg border-2 border-blue-600 px-6 py-2 font-medium text-blue-600 hover:bg-blue-50"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 sm:text-6xl">
            Secure Authentication
            <span className="block bg-linear-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-600">
            Experience seamless login, registration, and social authentication
            with Google. Your data is secure and your account is always
            protected.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/auth/register"
              className="rounded-lg bg-blue-600 px-8 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg border-2 border-blue-600 px-8 py-3 font-medium text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid gap-8 md:grid-cols-3">
          {/* Feature 1 */}
          <div className="rounded-lg bg-white p-8 shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Secure Login
            </h3>
            <p className="mt-2 text-gray-600">
              Industry-standard encryption and security practices to protect
              your account.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-lg bg-white p-8 shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Easy Registration
            </h3>
            <p className="mt-2 text-gray-600">
              Quick and simple sign-up process with email verification and
              validation.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-lg bg-white p-8 shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Google Sign In
            </h3>
            <p className="mt-2 text-gray-600">
              Sign in with your Google account for faster and more convenient
              access.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 text-center text-gray-600 sm:px-6 lg:px-8">
          <p>&copy; 2024 OAuth App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
