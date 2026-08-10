import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const openAuthModal = useUIStore((s) => s.openAuthModal);
  const closeAuthModal = useUIStore((s) => s.closeAuthModal);

  function validate() {
    const next = {};
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      closeAuthModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        autoFocus
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <button
        type="button"
        onClick={() => openAuthModal("forgot-password")}
        className="-mt-2 self-end text-xs font-medium text-brand-600 hover:underline"
      >
        Forgot password?
      </button>
      <Button type="submit" loading={loading} className="w-full">
        Log in
      </Button>
      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={() => openAuthModal("signup")}
          className="font-medium text-brand-600 hover:underline"
        >
          Sign up
        </button>
      </p>
    </form>
  );
}
