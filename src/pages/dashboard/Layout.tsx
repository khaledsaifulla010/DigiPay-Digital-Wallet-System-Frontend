/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/redux/store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Upload,
  Receipt,
  User as UserIcon,
  CreditCard,
  LayoutDashboard,
  Shield,
  Mail,
  Phone,
  LogOut,
  RefreshCcw,
} from "lucide-react";
import { logout } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import DashboardTour from "@/components/tour/DashboardTour";
import { useLogoutMutation } from "@/redux/api/authApi";

type Props = { role: "USER" | "AGENT" | "ADMIN"; children: React.ReactNode };
type NavItem = {
  to: string;
  label: string;
  end?: boolean;
  icon: React.ElementType;
};
type NavSection = {
  title: "Profile" | "Manage" | "Activity" | "System";
  items: NavItem[];
};

const TOUR_KEY = "__digipay_tour_done__";

const DashboardLayout = ({ role, children }: Props) => {
  const { user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
   const [apiLogout] = useLogoutMutation();

  const getInitials = (name?: string, email?: string, phone?: string) => {
    const n = (name ?? "").trim();
    if (n) {
      const parts = n.split(/\s+/).filter(Boolean);
      if (parts.length >= 2)
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      const letters = parts[0].replace(/[^A-Za-z]/g, "");
      return (
        letters.slice(0, 2).toUpperCase() || (parts[0][0] || "U").toUpperCase()
      );
    }
    const local = (email ?? "").split("@")[0];
    if (local) {
      const letters = local.replace(/[^A-Za-z]/g, "");
      return (
        letters.slice(0, 2).toUpperCase() || local.slice(0, 2).toUpperCase()
      );
    }
    if (phone) return phone.slice(-2).toUpperCase();
    return "U";
  };
  const initial = getInitials(user?.name, user?.email, user?.phone);
  const currentRole = (user?.role || role) as "USER" | "AGENT" | "ADMIN";

  const roleStyles = {
    USER: {
      border: "border-pink-600",
      badge: "bg-pink-600",
      active: "bg-pink-600 text-white font-bold",
    },
    AGENT: {
      border: "border-purple-600",
      badge: "bg-purple-600",
      active: "bg-purple-600 text-white font-bold",
    },
    ADMIN: {
      border: "border-green-600",
      badge: "bg-green-600",
      active: "bg-green-600 text-white font-bold",
    },
  }[currentRole];

  const sectionsByRole: Record<"USER" | "AGENT" | "ADMIN", NavSection[]> = {
    USER: [
      {
        title: "System",
        items: [
          {
            to: "/dashboard",
            label: "Overview",
            end: true,
            icon: LayoutDashboard,
          },
        ],
      },
      {
        title: "Manage",
        items: [
          { to: "/dashboard/send", label: "Send Money", icon: Send },
          { to: "/dashboard/withdraw", label: "Withdraw", icon: Upload },
        ],
      },
      {
        title: "Activity",
        items: [
          {
            to: "/dashboard/transactions",
            label: "Transactions",
            icon: Receipt,
          },
        ],
      },
      {
        title: "Profile",
        items: [{ to: "/dashboard/profile", label: "Profile", icon: UserIcon }],
      },
    ],
    AGENT: [
      {
        title: "System",
        items: [
          {
            to: "/dashboard",
            label: "Overview",
            end: true,
            icon: LayoutDashboard,
          },
        ],
      },
      {
        title: "Manage",
        items: [
          {
            to: "/dashboard/cash-in",
            label: "Cash-In to User",
            icon: CreditCard,
          },
        ],
      },
      {
        title: "Activity",
        items: [
          {
            to: "/dashboard/transactions",
            label: "All Transactions",
            icon: Receipt,
          },
        ],
      },
      {
        title: "Profile",
        items: [{ to: "/dashboard/profile", label: "Profile", icon: UserIcon }],
      },
    ],
    ADMIN: [
      {
        title: "System",
        items: [
          {
            to: "/dashboard",
            label: "Overview",
            end: true,
            icon: LayoutDashboard,
          },
        ],
      },
      {
        title: "Manage",
        items: [
          { to: "/dashboard/agents", label: "Manage Agents", icon: Shield },
          { to: "/dashboard/users", label: "Manage Users", icon: UserIcon },
        ],
      },
      {
        title: "Activity",
        items: [
          {
            to: "/dashboard/transactions",
            label: "All Transactions",
            icon: Receipt,
          },
        ],
      },
      {
        title: "Profile",
        items: [{ to: "/dashboard/profile", label: "Profile", icon: UserIcon }],
      },
    ],
  };
  const sections = sectionsByRole[currentRole];

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

  const handleRestartTour = () => {
    const k = `${TOUR_KEY}_${currentRole}`;
    localStorage.removeItem(k);
    window.dispatchEvent(new Event("digipay:restart-tour"));
  };

  const toggleTheme = () => {
    const root = document.documentElement;
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  return (
    <div className="w-[1230px]">
      <DashboardTour role={currentRole} />
      <aside
        className="
          fixed z-30 left-[10px] top-16 bottom-[10px]
          w-64 overflow-y-auto rounded-xl border shadow-sm
          dark:bg-gray-900 dark:text-neutral-100
          hidden md:block
        "
      >
        <div className="p-2 mt-2 mb-4 ">
          <div
            className={`flex items-center gap-3 px-4 py-4 border-2 rounded-md ${roleStyles.border}`}
          >
            <Avatar
              className={`h-10 w-10 border-2 border-dashed ${roleStyles.border}`}
            >
              <AvatarFallback className="font-black">{initial}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate font-black">{user?.name || "User"}</div>
              <div className="truncate text-sm text-muted-foreground flex items-center gap-1">
                <Mail className="w-4 h-4 mt-0.5" />{" "}
                {user?.email || user?.phone || "—"}
              </div>
              <div className="truncate text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="w-4 h-4 mt-0.5" /> {user?.phone || "—"}
              </div>
              <Badge
                className={`${roleStyles.badge} text-white font-bold mt-2`}
              >
                <Shield className="mr-1 h-4 w-4" /> {user?.role || role}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />
        <nav className="px-3 py-3 mt-2 space-y-2 font-bold">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-2 text-xs tracking-wider uppercase text-muted-foreground/80">
                {section.title}
              </div>
              <div className="space-y-2">
                {section.items.map(({ to, label, end, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end as any}
                    className={({ isActive }) =>
                      [
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                        isActive
                          ? roleStyles.active
                          : "hover:bg-muted text-foreground",
                      ].join(" ")
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
          <div className="pt-4 -mt-6">
            <Separator className="my-3" />
            <div className="px-1 grid gap-2">
              <Button
                onClick={handleLogout}
                className="text-white bg-red-600 w-full"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleRestartTour}
                className="w-full"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Restart Tour
              </Button>
            </div>
          </div>
        </nav>
      </aside>

      <section className="w-full md:ml-[276px] md:pr-[10px]">
        <div className="flex items-center gap-2 border-b px-4 py-3 md:hidden rounded-xl">
          <Shield className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">Role:</span>
          <Badge variant="secondary">{user?.role || role}</Badge>

          <button
            id="tour-theme-toggle"
            onClick={toggleTheme}
            className="ml-2 px-2 py-1 border rounded-md text-xs"
            type="button"
          >
            Theme
          </button>

          <Link
            to="/"
            className="ml-auto text-sm text-primary underline-offset-4 hover:underline"
          >
            Home
          </Link>
        </div>
        <div className="mt-3 md:mt-0 rounded-xl border bg-background shadow-sm px-4 py-4 md:px-6 md:py-6">
          {children}
        </div>
      </section>
    </div>
  );
};

export default DashboardLayout;
