
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Label, Radio, RadioGroup } from "@heroui/react";
import GoogleMark from "@/components/GoogleMark";
import { signUp, signIn } from "@/lib/auth-client";
import { showAuthSuccess } from "@/lib/auth-toast";

const inputClass =
  "mt-2 min-h-12 w-full rounded-xl border border-[var(--c-espresso)]/15 bg-white px-4 text-sm text-[var(--c-espresso)] outline-none transition placeholder:text-[var(--c-teal)]/45 hover:border-[var(--c-caramel)]/60 focus:border-[var(--c-caramel)] focus:ring-4 focus:ring-[var(--c-caramel)]/10";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("user");

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name"));
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const result = await signUp.email({
        name,
        email,
        password,
        role,
        callbackURL: role === "admin" ? "/dashboard" : "/",
      });

      if (result?.error) {
        setMessage(
          result.error.message || "Registration failed. Please try again.",
        );
        return;
      }

      const registeredUser = result?.data?.user;
      if (!registeredUser) {
        setMessage("Registration could not be confirmed. Please try again.");
        return;
      }

      if (role === "admin" && registeredUser.role !== "admin") {
        setMessage(
          "The server created this account without the Admin role. Please try again or contact support.",
        );
        return;
      }

      const displayName = registeredUser.name || name;
      showAuthSuccess(
        `Your account is ready, ${displayName}! Welcome to School Canteen.`,
      );
      router.replace(registeredUser.role === "admin" ? "/dashboard" : "/");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignUp() {
    setMessage("");
    if (role === "admin") {
      setMessage(
        "Use the email and password form to create an authorized admin account.",
      );
      return;
    }

    setLoading(true);

    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/?auth=google-register",
      });
    } catch {
      setMessage("Google sign-up failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="text-sm font-semibold text-[var(--c-espresso)]"
          >
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
            className={inputClass}
          />
        </div>

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
          <label
            htmlFor="password"
            className="text-sm font-semibold text-[var(--c-espresso)]"
          >
            Password
          </label>

          <div className="relative mt-2">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              required
              minLength={8}
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

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-semibold text-[var(--c-espresso)]">
            Your role
          </legend>
          <RadioGroup
            value={role}
            onChange={setRole}
            name="role"
            orientation="horizontal"
            aria-label="Your role"
            className="flex gap-5"
          >
            <Radio value="user">
              <Radio.Content className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--c-espresso)]">
                <Radio.Control className="grid size-5 place-items-center rounded-full border border-[var(--c-espresso)]/40">
                  <Radio.Indicator className="size-2.5 rounded-full bg-[var(--c-teal)]" />
                </Radio.Control>
                <Label>User</Label>
              </Radio.Content>
            </Radio>
            <Radio value="admin">
              <Radio.Content className="flex cursor-pointer items-center gap-2 text-sm font-medium text-[var(--c-espresso)]">
                <Radio.Control className="grid size-5 place-items-center rounded-full border border-[var(--c-espresso)]/40">
                  <Radio.Indicator className="size-2.5 rounded-full bg-[var(--c-teal)]" />
                </Radio.Control>
                <Label>Admin</Label>
              </Radio.Content>
            </Radio>
          </RadioGroup>
          <p className="text-xs leading-5 text-[var(--c-teal)]/70">
            Admin registration is limited to emails approved by the system
            administrator.
          </p>
        </fieldset>


        <button
          type="submit"
          disabled={loading}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[var(--c-teal)] px-5 font-bold text-[var(--c-paper)] shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--c-espresso)] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)] focus-visible:ring-offset-2"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4" aria-hidden="true">
        <span className="h-px flex-1 bg-[var(--c-espresso)]/10" />
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--c-teal)]/55">
          Or sign up with
        </span>
        <span className="h-px flex-1 bg-[var(--c-espresso)]/10" />
      </div>

      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-[var(--c-espresso)]/15 bg-white px-5 font-bold text-[var(--c-espresso)] shadow-sm transition hover:border-[var(--c-caramel)]/60 hover:bg-[var(--c-cream)]/30 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)] focus-visible:ring-offset-2"
      >
        <GoogleMark />
        Continue with Google
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`mt-4 text-center text-sm leading-6 text-[var(--c-caramel)] ${
          message ? "" : "sr-only"
        }`}
      >
        {message || " "}
      </p>

      <p className="mt-6 text-center text-sm text-[var(--c-teal)]/75">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-[var(--c-espresso)] underline decoration-[var(--c-caramel)] decoration-2 underline-offset-4 transition-colors hover:text-[var(--c-caramel)] focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-caramel)]"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
