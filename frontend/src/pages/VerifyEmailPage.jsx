import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle } from "lucide-react";
import * as authApi from "../api/auth";
import { useAuthStore } from "../store/authStore";
import { Spinner } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [error, setError] = useState("");
  const updateUser = useAuthStore((s) => s.updateUser);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("This link is missing a verification token.");
      return;
    }
    authApi
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
        updateUser({ isVerified: true });
      })
      .catch((err) => {
        setStatus("error");
        setError(err.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      {status === "loading" && (
        <>
          <Spinner size={36} />
          <p className="mt-4 text-sm text-slate-500">Verifying your email...</p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 className="size-12 text-emerald-500" />
          <h1 className="mt-4 font-display text-xl font-semibold text-slate-900">
            Email verified
          </h1>
          <p className="mt-2 text-sm text-slate-500">Thanks for confirming it's you.</p>
          <Button asChild className="mt-6">
            <Link to="/">Back to MoodMate</Link>
          </Button>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="size-12 text-red-500" />
          <h1 className="mt-4 font-display text-xl font-semibold text-slate-900">
            Couldn't verify email
          </h1>
          <p className="mt-2 text-sm text-slate-500">{error}</p>
          <p className="mt-1 text-xs text-slate-400">
            You can request a new link from your profile page.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link to="/">Back to MoodMate</Link>
          </Button>
        </>
      )}
    </div>
  );
}
