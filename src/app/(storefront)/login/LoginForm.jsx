
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import GoogleMark from "@/components/GoogleMark";
import { signIn } from "@/lib/auth-client";
import { showAuthSuccess } from "@/lib/auth-toast";

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-[var(--c-espresso)]/15 bg-white px-4 text-sm text-[var(--c-espresso)] outline-none transition placeholder:text-[var(--c-teal)]/45 hover:border-[var(--c-caramel)]/60 focus:border-[var(--c-caramel)] focus:ring-4 focus:ring-[var(--c-caramel)]/10";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await signIn.email({
        email: formData.get("email"),
        password: formData.get("password"),
        callbackURL: "/",
      });

      if (result?.error) {
        setMessage(result.error.message || "Login failed. Please try again.");
        return;
      }

      const name = result?.data?.user?.name;
      showAuthSuccess(name ? `Welcome back, ${name}!` : "Welcome back!");
      router.replace("/");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setMessage("");
    setLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/?auth=google-login",
      });
    } catch {
      setMessage("Google sign-in failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="text-sm font-semibold text-[var(--c-espresso)]"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@school.com"
            required
            className={inputClass}
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-[var(--c-espresso)]"
            >
              Password
            </label>
          </div>

          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              className={`${inputClass} mt-0 pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-[var(--c-teal)]/70 transition hover:text-[var(--c-espresso)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--c-caramel)]"
            >
              {showPassword ? (
                <EyeOff size={18} aria-hidden="true" />
              ) : (
                <Eye size={18} aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--c-teal)] px-5 font-bold text-[var(--c-paper)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--c-espresso)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)] focus-visible:ring-offset-2"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p
          role="status"
          aria-live="polite"
          className={`text-sm leading-6 text-[var(--c-caramel)] ${
            message ? "" : "sr-only"
          }`}
        >
          {message || " "}
        </p>
      </form>

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-[var(--c-espresso)]/10" />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--c-teal)]/55">
          Or continue with
        </span>
        <span className="h-px flex-1 bg-[var(--c-espresso)]/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--c-espresso)]/15 bg-white px-5 font-bold text-[var(--c-espresso)] shadow-sm transition hover:border-[var(--c-caramel)]/60 hover:bg-[var(--c-cream)]/30 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)] focus-visible:ring-offset-2"
      >
        <GoogleMark />
        Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-[var(--c-teal)]/75">
        New to School Canteen?{" "}
        <Link
          href="/register"
          className="font-bold text-[var(--c-espresso)] underline decoration-[var(--c-caramel)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--c-caramel)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)]"
        >
          Create an account
        </Link>
      </p>
    </>
  );
}
