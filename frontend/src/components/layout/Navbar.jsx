import { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Sparkles, ChevronDown, History, User, LogOut } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useUIStore } from "../../store/uiStore";
import { Button } from "../ui/Button";
import { Avatar } from "../ui/Avatar";
import { useClickOutside } from "../../hooks/useClickOutside";

const NAV_LINK_CLASS = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-brand-700" : "text-slate-600 hover:text-slate-900"
  }`;

function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  useClickOutside(ref, () => setOpen(false));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-slate-100"
      >
        <Avatar name={user?.name} src={user?.avatarUrl} size="sm" />
        <ChevronDown className="size-4 text-slate-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-brand-100 bg-white py-1.5 shadow-lg">
          <p className="truncate px-3 py-2 text-sm font-medium text-slate-900">{user?.name}</p>
          <div className="my-1 h-px bg-slate-100" />
          <Link
            to="/history"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-brand-50"
          >
            <History className="size-4" /> History
          </Link>
          <Link
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-brand-50"
          >
            <User className="size-4" /> Profile
          </Link>
          <div className="my-1 h-px bg-slate-100" />
          <button
            type="button"
            onClick={() => {
              logout();
              setOpen(false);
              navigate("/");
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="size-4" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const openAuthModal = useUIStore((s) => s.openAuthModal);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-brand-50/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-600 text-white">
            <Sparkles className="size-4" />
          </span>
          <span className="font-display text-lg font-semibold text-slate-900">MoodMate</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={NAV_LINK_CLASS}>
            Home
          </NavLink>
          <NavLink to="/mood" className={NAV_LINK_CLASS}>
            Check your mood
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/history" className={NAV_LINK_CLASS}>
              History
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => openAuthModal("login")}>
                Log in
              </Button>
              <Button variant="primary" size="sm" onClick={() => openAuthModal("signup")}>
                Sign up free
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="p-2 text-slate-600 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-brand-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Home
            </NavLink>
            <NavLink
              to="/mood"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Check your mood
            </NavLink>
            {isAuthenticated && (
              <>
                <NavLink
                  to="/history"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  History
                </NavLink>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Profile
                </NavLink>
              </>
            )}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3">
            {isAuthenticated ? (
              <Button
                variant="outline"
                onClick={() => {
                  useAuthStore.getState().logout();
                  setMobileOpen(false);
                }}
              >
                Log out
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    openAuthModal("login");
                    setMobileOpen(false);
                  }}
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    openAuthModal("signup");
                    setMobileOpen(false);
                  }}
                >
                  Sign up free
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
