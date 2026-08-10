import { useState } from "react";
import toast from "react-hot-toast";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore((s) => s.signup);
  const openAuthModal = useUIStore((s) => s.openAuthModal);
  const closeAuthModal = useUIStore((s) => s.closeAuthModal);

  function validate() {
    const next = {};
    if (name.trim().length < 2) next.name = "Enter your name";
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email";
    if (password.length < 8) next.password = "At least 8 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await signup(name, email, password);
      toast.success(`Welcome to MoodMate, ${user.name.split(" ")[0]}!`);
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
        label="Name"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        autoFocus
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Button type="submit" loading={loading} className="mt-1 w-full">
        Create account
      </Button>
      <p className="text-center text-xs text-slate-400">
        You can start using MoodMate right away - verifying your email is optional and
        can be done later from your profile.
      </p>
      <p className="text-center text-sm text-slate-500">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="font-medium text-brand-600 hover:underline"
        >
          Log in
        </button>
      </p>
    </form>
  );
}
