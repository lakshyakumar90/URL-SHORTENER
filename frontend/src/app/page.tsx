"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="relative isolate overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspects-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
              Shorten Links, <br className="hidden sm:block" />
              <span className="text-gradient">Expand Your Reach</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-400 max-w-2xl mx-auto">
              Transform long, ugly links into smart, trackable short URLs.
              Perfect for social media, marketing campaigns, and personal use.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              {isLoading ? (
                <div className="h-10 w-32 bg-white/5 animate-pulse rounded-lg" />
              ) : isAuthenticated ? (
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-full px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/signup">
                    <Button size="lg" className="rounded-full px-8">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="rounded-full px-8"
                    >
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Glass Card Preview */}
          <div className="mt-16 sm:mt-24">
            <div className="relative rounded-2xl bg-gray-900/50 p-2 ring-1 ring-white/10 lg:rounded-3xl glass-panel glow">
              <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-violet-500/0 via-violet-500/70 to-violet-500/0"></div>
              <div className="rounded-xl bg-[#0F0920] px-6 py-12 sm:px-12 lg:px-20 ring-1 ring-white/5">
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5">
                  <div className="flex-1 truncate text-gray-400 font-mono text-sm">
                    https://super-long-url.com/marketing/campaign/2026/summer-sale?ref=twitter
                  </div>
                  <div className="hidden sm:block text-gray-600">→</div>
                  <div className="text-violet-400 font-mono font-bold">
                    short.link/summer26
                  </div>
                  <Button size="sm" variant="secondary" className="ml-auto">
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-violet-400">
              Everything you need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Powerful features for modern links
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: "Lightning Fast",
                  description:
                    "Generate links instantly with our high-performance infrastructure.",
                  icon: (
                    <svg
                      className="h-6 w-6 text-violet-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                      />
                    </svg>
                  ),
                },
                {
                  name: "Custom Custom Aliases",
                  description:
                    "Create branded links that people want to click with custom aliases.",
                  icon: (
                    <svg
                      className="h-6 w-6 text-violet-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  ),
                },
                {
                  name: "Secure & Reliable",
                  description:
                    "Enterprise-grade security ensuring your links are always safe and up.",
                  icon: (
                    <svg
                      className="h-6 w-6 text-violet-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                      />
                    </svg>
                  ),
                },
              ].map((feature) => (
                <div
                  key={feature.name}
                  className="flex flex-col glass-panel p-8 rounded-2xl hover:bg-white/5 transition-colors border border-white/5"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white mb-4">
                    <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-violet-500/10 ring-1 ring-violet-500/20">
                      {feature.icon}
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="flex flex-auto flex-col text-base leading-7 text-gray-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0F0920]/50 backdrop-blur-xl mt-auto">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Discord
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-400">
              &copy; 2026 ShortLink, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
