import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";

export function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useUIStore((s) => s.openAuthModal);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) openAuthModal("login");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />;
  return children;
}
