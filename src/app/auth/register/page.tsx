import { RegisterForm } from "@/components/auth/RegisterForm";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Join us today and get started</p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">
          <RegisterForm />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or sign up with
              </span>
            </div>
          </div>

          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
