"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    router.push("/dashboard");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signup(formData);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-md">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border-white/10 shadow-2xl shadow-black/50">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-400">Join thousands of users today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="firstname"
                name="firstname"
                type="text"
                label="First Name"
                placeholder="John"
                value={formData.firstname}
                onChange={handleChange}
                required
              />

              <Input
                id="lastname"
                name="lastname"
                type="text"
                label="Last Name"
                placeholder="Doe"
                value={formData.lastname}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              id="password"
              name="password"
              type="password"
              label="Password"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
            />

            <Button
              type="submit"
              className="w-full text-lg mt-2"
              size="lg"
              isLoading={isLoading}
            >
              Get Started
            </Button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-white/10">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-violet-400 hover:text-violet-300 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
