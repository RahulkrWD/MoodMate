import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import * as authApi from "../api/auth";
import { useUIStore } from "../store/uiStore";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("form"); // form | success | invalid
  const navigate = useNavigate();
  const openAuthModal = useUIStore((s) => s.openAuthModal);

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) {
      setError("At least 8 characters");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("invalid");
    } finally {
      setLoading(false);
    }
  }

  if (!token || status === "invalid") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <XCircle className="size-12 text-red-500" />
        <h1 className="mt-4 font-display text-xl font-semibold text-slate-900">
          Link invalid or expired
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {error || "This reset link is missing or no longer valid."}
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link to="/">Back to MoodMate</Link>
        </Button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <CheckCircle2 className="size-12 text-emerald-500" />
        <h1 className="mt-4 font-display text-xl font-semibold text-slate-900">
          Password updated
        </h1>
        <p className="mt-2 text-sm text-slate-500">You can now log in with your new password.</p>
        <Button
          className="mt-6"
          onClick={() => {
            navigate("/");
            openAuthModal("login");
          }}
        >
          Log in
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4">
      <h1 className="mb-2 font-display text-2xl font-semibold text-slate-900">
        Choose a new password
      </h1>
      <p className="mb-6 text-sm text-slate-500">Make it something you'll remember.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error}
          autoFocus
        />
        <Button type="submit" loading={loading} className="w-full">
          Update password
        </Button>
      </form>
    </div>
  );
}
