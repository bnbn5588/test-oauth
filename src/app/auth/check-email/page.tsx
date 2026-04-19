import Link from "next/link";

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export default async function CheckEmailPage({ searchParams }: Props) {
  const { email } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md text-center space-y-4">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900">Check your email</h1>

        <p className="text-gray-600">
          We sent a verification link to{" "}
          {email ? (
            <span className="font-medium text-gray-900">{email}</span>
          ) : (
            "your email address"
          )}
          .
        </p>

        <p className="text-sm text-gray-500">
          Click the link in the email to verify your account. The link expires in 24 hours.
        </p>

        <div className="pt-2">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
