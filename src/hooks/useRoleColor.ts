/* src/hooks/useRoleColor.ts */
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

type Role = "USER" | "AGENT" | "ADMIN";

type ShadePack = {
  // raw color token for your logic/debugging
  token: "pink-600" | "purple-600" | "green-600";
  // common, ready-to-use classes
  text: string;
  bg: string;
  hoverBg: string;
  border: string;
  ring: string;
  // subtle/soft surfaces (light & dark friendly)
  softBg: string;
  softText: string;
  // outlines / chips
  outline: string;
};

const ROLE_MAP: Record<Role, ShadePack> = {
  USER: {
    token: "pink-600",
    text: "text-pink-600",
    bg: "bg-pink-600",
    hoverBg: "hover:bg-pink-700",
    border: "border-pink-600",
    ring: "focus-visible:ring-pink-500",
    softBg: "bg-pink-50 dark:bg-pink-950/30",
    softText: "text-pink-700 dark:text-pink-300",
    outline: "ring-1 ring-inset ring-pink-200 dark:ring-pink-900/60",
  },
  AGENT: {
    token: "purple-600",
    text: "text-purple-600",
    bg: "bg-purple-600",
    hoverBg: "hover:bg-purple-700",
    border: "border-purple-600",
    ring: "focus-visible:ring-purple-500",
    softBg: "bg-purple-50 dark:bg-purple-950/30",
    softText: "text-purple-700 dark:text-purple-300",
    outline: "ring-1 ring-inset ring-purple-200 dark:ring-purple-900/60",
  },
  ADMIN: {
    token: "green-600",
    text: "text-green-600",
    bg: "bg-green-600",
    hoverBg: "hover:bg-green-700",
    border: "border-green-600",
    ring: "focus-visible:ring-green-500",
    softBg: "bg-green-50 dark:bg-green-950/30",
    softText: "text-green-700 dark:text-green-300",
    outline: "ring-1 ring-inset ring-green-200 dark:ring-green-900/60",
  },
};

/**
 * Get shade pack for a given role (handy when rendering other users).
 */
export const getRoleColors = (role: Role): ShadePack => ROLE_MAP[role];

/**
 * Hook: returns the current user's role colors and helpers.
 */
export default function useRoleColor() {
  const role = useSelector((s: RootState) => s.auth.user?.role) as
    | Role
    | undefined;

  // Fallback to USER palette if not logged in yet
  const current: ShadePack = role ? ROLE_MAP[role] : ROLE_MAP.USER;

  return {
    role: role ?? "USER",
    colors: current,
    byRole: getRoleColors,
    // quick helpers for common patterns
    buttonSolid: `inline-flex items-center justify-center rounded-xl px-4 py-2 text-white ${current.bg} ${current.hoverBg} ${current.ring} transition`,
    buttonOutline: `inline-flex items-center justify-center rounded-xl px-4 py-2 ${current.text} border ${current.border} ${current.ring} bg-transparent hover:bg-black/5 dark:hover:bg-white/5 transition`,
    badgeSoft: `inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm ${current.softBg} ${current.softText} ${current.outline}`,
  };
}
