import Link from "next/link";

interface Props {
  searchParams: Promise<{ success?: string; error?: string }>;
}

const errorMessages: Record<string, string> = {
  "missing-token": "No verification token was provided.",
  "invalid-token": "This verification link is invalid or has expired.",
  "server-error": "Something went wrong. Please try again.",
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { success, error } = await searchParams;

  const isSuccess = success === "true";
  const errorMessage = error ? (errorMessages[error] ?? errorMessages["server-error"]) : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md text-center space-y-4">
        {isSuccess ? (
          <>
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Email verified</h1>
            <p className="text-gray-600">Your email address has been verified. You can now sign in.</p>
            <Link
              href="/auth/login"
              className="inline-block mt-2 rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            <div className="flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Verification failed</h1>
            <p className="text-gray-600">{errorMessage ?? errorMessages["server-error"]}</p>
            <Link
              href="/auth/register"
              className="inline-block mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Register again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
