/* eslint-disable no-empty */
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import type { RootState } from "@/redux/store";
import { toast } from "react-toastify";
import { ModeToggle } from "../mode-toggle";
import { useLogoutMutation } from "@/redux/api/authApi";

type Role = "USER" | "AGENT" | "ADMIN" | undefined;

const getRoleStyles = (role: Role) => {
  if (role === "AGENT") {
    return {
      textHover: "hover:text-purple-600",
      bg: "bg-purple-600",
      bgHover: "hover:bg-purple-700",
      ring: "focus:ring-purple-600/30",
    };
  }
  if (role === "ADMIN") {
    return {
      textHover: "hover:text-green-600",
      bg: "bg-green-600",
      bgHover: "hover:bg-green-700",
      ring: "focus:ring-green-600/30",
    };
  }
  return {
    textHover: "hover:text-pink-600",
    bg: "bg-pink-600",
    bgHover: "hover:bg-pink-700",
    ring: "focus:ring-pink-600/30",
  };
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [apiLogout] = useLogoutMutation();

  const role = (user?.role as Role) ?? undefined;
  const roleStyle = getRoleStyles(role);

  const handleLogout = async () => {
    try {
      await apiLogout().unwrap();
    } catch {
    } finally {
      dispatch(logout());
      toast.success("You have been Logged Out!");
      navigate("/login");
    }
  };

  const navTextLink = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-lg px-3 py-2 transition",
      isActive
        ? `${roleStyle.bg} text-white`
        : `hover:bg-neutral-100 dark:hover:bg-neutral-900 ${roleStyle.textHover}`,
    ].join(" ");

  const borderBtn = "rounded-xl border px-3 py-1.5";

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur dark:bg-gray-950/70">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span
            className={[
              "inline-block rounded-xl px-2 py-1 text-xs font-semibold text-white",
              roleStyle.bg,
            ].join(" ")}
          >
            DigiPay
          </span>
          <span className="text-lg font-semibold">Digital Wallet</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/features" className={navTextLink}>
            Features
          </NavLink>

          <NavLink to="/about" className={navTextLink}>
            About
          </NavLink>
          <NavLink to="/pricing" className={navTextLink}>
            Pricing
          </NavLink>
          <NavLink to="/faq" className={navTextLink}>
            FAQ
          </NavLink>

          <NavLink to="/contact" className={navTextLink}>
            Contact
          </NavLink>

          <ModeToggle />
        </div>

        <div className="hidden md:block">
          {!user ? (
            <div className="flex items-center gap-3">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  [
                    borderBtn,
                    isActive ? `${roleStyle.bg} text-white` : "",
                  ].join(" ")
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  [
                    "rounded-xl px-3 py-1.5 text-white",
                    isActive
                      ? roleStyle.bg
                      : `${roleStyle.bg} ${roleStyle.bgHover}`,
                  ].join(" ")
                }
              >
                Get Started
              </NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  [
                    borderBtn,
                    isActive ? `${roleStyle.bg} text-white` : "",
                  ].join(" ")
                }
              >
                Dashboard
              </NavLink>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-3 py-1.5 text-white hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setOpen((p) => !p)}
          className="rounded-xl border px-3 py-2 md:hidden"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>

      {open && (
        <div className="border-t md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-3">
            <div className="grid gap-2">
              <NavLink to="/features" className={navTextLink}>
                Features
              </NavLink>
              <NavLink to="/about" className={navTextLink}>
                About
              </NavLink>
              <NavLink to="/pricing" className={navTextLink}>
                Pricing
              </NavLink>
              <NavLink to="/faq" className={navTextLink}>
                FAQ
              </NavLink>
              <NavLink to="/contact" className={navTextLink}>
                Contact
              </NavLink>

              {!user ? (
                <>
                  <NavLink to="/login" className={navTextLink}>
                    Login
                  </NavLink>
                  <NavLink to="/register" className={navTextLink}>
                    Register
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/dashboard" className={navTextLink}>
                    Dashboard
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="rounded-lg px-3 py-2 text-left text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
