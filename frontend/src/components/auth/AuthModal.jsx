import { Modal } from "../ui/Modal";
import { useUIStore } from "../../store/uiStore";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

const TITLES = {
  login: "Welcome back",
  signup: "Create your account",
  "forgot-password": "Reset your password",
};

export function AuthModal() {
  const authModal = useUIStore((s) => s.authModal);
  const closeAuthModal = useUIStore((s) => s.closeAuthModal);

  return (
    <Modal open={!!authModal} onClose={closeAuthModal} title={TITLES[authModal]}>
      {authModal === "login" && <LoginForm />}
      {authModal === "signup" && <SignupForm />}
      {authModal === "forgot-password" && <ForgotPasswordForm />}
    </Modal>
  );
}
