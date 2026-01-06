"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { urlApi } from "@/lib/api";
import { Url } from "@/types";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [urls, setUrls] = useState<Url[]>([]);
  const [isLoadingUrls, setIsLoadingUrls] = useState(true);
  const [urlInput, setUrlInput] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [isShortening, setIsShortening] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch URLs
  useEffect(() => {
    const fetchUrls = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await urlApi.getAll();
        setUrls(response.urls);
      } catch (err) {
        console.error("Failed to fetch URLs:", err);
      } finally {
        setIsLoadingUrls(false);
      }
    };

    if (isAuthenticated) {
      fetchUrls();
    }
  }, [isAuthenticated]);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsShortening(true);

    try {
      const response = await urlApi.shorten({
        url: urlInput,
        code: customCode || undefined,
      });

      setUrls((prev) => [
        {
          id: response.id,
          shortCode: response.shortCode,
          targetUrl: response.targetUrl,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);

      setUrlInput("");
      setCustomCode("");
      setSuccess("URL shortened successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to shorten URL");
    } finally {
      setIsShortening(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await urlApi.delete(id);
      setUrls((prev) => prev.filter((url) => url.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete URL");
    }
  };

  const handleCopy = async (shortCode: string, id: string) => {
    const shortUrl = getShortUrl(shortCode);
    await navigator.clipboard.writeText(shortUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getShortUrl = (shortCode: string) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
    return `${baseUrl}/${shortCode}`;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Create and manage your shortened links.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm text-gray-300">System Operational</span>
          </div>
        </div>

        {/* URL Shortener Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl glow border-violet-500/20">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-violet-500/10 rounded-lg">
              <svg
                className="w-6 h-6 text-violet-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white">
              Create New Short Link
            </h2>
          </div>

          <form onSubmit={handleShorten} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <Input
                  id="url"
                  type="url"
                  placeholder="Paste your long URL here (e.g. https://website.com/page)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  required
                  className="bg-black/20"
                />
              </div>
              <div>
                <Input
                  id="customCode"
                  type="text"
                  placeholder="Alias (Optional)"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  className="bg-black/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {error && <span className="text-red-400">{error}</span>}
                {success && <span className="text-green-400">{success}</span>}
              </div>
              <Button
                type="submit"
                isLoading={isShortening}
                size="lg"
                className="px-8 shadow-violet-500/20"
              >
                Shorten URL
              </Button>
            </div>
          </form>
        </div>

        {/* URLs List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-300 px-1">
            Your Active Links ({urls.length})
          </h3>

          {isLoadingUrls ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : urls.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/5 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-1">
                No links yet
              </h3>
              <p className="text-gray-400">
                Paste a URL above to create your first short link.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 w-full">
              {urls.map((url) => (
                <div
                  key={url.id}
                  className="group relative bg-[#0F0920] border border-white/5 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 hover:-translate-y-0.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-xs ring-1 ring-violet-500/20">
                          /{url.shortCode.substring(0, 2)}
                        </div>
                        <a
                          href={getShortUrl(url.shortCode)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-semibold text-white hover:text-violet-400 transition-colors break-all"
                        >
                          {getShortUrl(url.shortCode)}
                        </a>
                      </div>
                      <p className="text-gray-500 text-sm break-all pl-11 flex items-center gap-2">
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        {url.targetUrl}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(url.shortCode, url.id)}
                        className="bg-white/5 hover:bg-white/10 text-gray-300"
                      >
                        {copiedId === url.id ? (
                          <span className="text-green-400 flex items-center gap-1">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Copied
                          </span>
                        ) : (
                          "Copy"
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(url.id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>

                  {/* Decorative background blur on hover */}
                  <div className="absolute inset-0 bg-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
