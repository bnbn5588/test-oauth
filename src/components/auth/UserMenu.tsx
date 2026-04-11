"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export function UserMenu() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) {
    return (
      <Link
        href="/auth/login"
        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        Sign In
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        <div className="h-6 w-6 rounded-full bg-blue-600"></div>
        <span className="hidden sm:inline">{session.user?.name || "User"}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-200 px-4 py-3">
            <p className="text-sm font-medium text-gray-900">
              {session.user?.name}
            </p>
            <p className="text-xs text-gray-500">{session.user?.email}</p>
          </div>

          <button
            onClick={async () => {
              setIsOpen(false);
              await signOut({ redirect: true, callbackUrl: "/" });
            }}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
