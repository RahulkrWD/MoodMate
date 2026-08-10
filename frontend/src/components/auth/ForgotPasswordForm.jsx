import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useUIStore } from "../../store/uiStore";
import * as authApi from "../../api/auth";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const openAuthModal = useUIStore((s) => s.openAuthModal);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email");
      return;
    }
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch {
      // Backend never reveals whether the email exists - show the same
      // success state either way to avoid leaking that + avoid confusing
      // the user over a transient network error on a non-critical flow.
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <CheckCircle2 className="size-10 text-emerald-500" />
        <p className="text-sm text-slate-600">
          If an account exists for <span className="font-medium">{email}</span>, a reset
          link is on its way. It expires in 1 hour.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="mt-1 text-sm font-medium text-brand-600 hover:underline"
        >
          Back to login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <p className="-mt-2 text-sm text-slate-500">
        Enter the email on your account and we&apos;ll send a link to reset your
        password.
      </p>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        autoFocus
      />
      <Button type="submit" loading={loading} className="w-full">
        Send reset link
      </Button>
      <button
        type="button"
        onClick={() => openAuthModal("login")}
        className="text-center text-sm font-medium text-brand-600 hover:underline"
      >
        Back to login
      </button>
    </form>
  );
}
