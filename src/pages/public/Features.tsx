import {
  ShieldCheck,
  Wallet,
  Users,
  TrendingUp,
  LockKeyhole,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import useRoleColor from "@/hooks/useRoleColor";
import { TOKEN_ACCENTS } from "@/styles/roleAccents";

type Item = { t: string; d: string; icon: React.ReactNode; chip?: string };

const FEATURES: Item[] = [
  {
    t: "User Wallet",
    d: "Send money, cash-in/out, profile & limits.",
    icon: <Wallet size={22} />,
  },
  {
    t: "Agent Tools",
    d: "Cash-in to users, cash-out from users, commissions.",
    icon: <Users size={22} />,
  },
  {
    t: "Admin Panel",
    d: "Manage users/agents, approve KYC, monitor system.",
    icon: <TrendingUp size={22} />,
  },
  {
    t: "Security",
    d: "JWT + httpOnly cookies, RBAC, server-side checks.",
    icon: <ShieldCheck size={22} />,
  },
  {
    t: "Performance",
    d: "RTK Query cache, pagination, optimistic updates.",
    icon: <Zap size={22} />,
  },
  {
    t: "Compliance",
    d: "Audit logs, rate limiting, OTP-ready flows.",
    icon: <LockKeyhole size={22} />,
  },
];


const Features = () => {
  const { colors, buttonSolid, buttonOutline } = useRoleColor();
  const accent = TOKEN_ACCENTS[colors.token];

  return (
    <section className="relative">
      {/* ambient background accents (role-based) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`absolute left-[8%] top-[-80px] h-72 w-72 rounded-full bg-gradient-to-tr ${accent.ambientBlob} blur-2xl`}
        />
        <div className="absolute right-[-60px] bottom-[-60px] h-72 w-72 rounded-full bg-gradient-to-tr from-gray-900/10 to-gray-950/10 blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Heading */}
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-gray-100 dark:via-gray-200 dark:to-white">
              Features
            </span>
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            Carefully designed for <strong>Users</strong>,{" "}
            <strong>Agents</strong>, and <strong>Admins</strong>.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {FEATURES.map((it) => (
            <div
              key={it.t}
              className="group relative rounded-2xl border border-neutral-200/70 bg-white/70 p-5 shadow-sm transition-all hover:-translate-y-[2px] hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70"
            >
              {/* gradient ring on hover (role-based) */}
              <div
                className={`pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ${accent.ringHover} transition-opacity group-hover:opacity-100`}
              />
              <div className={`mb-3 flex items-center gap-2 ${colors.text}`}>
                <span
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${accent.iconBgSoft}`}
                >
                  {it.icon}
                </span>
                <h3 className="text-lg font-semibold">{it.t}</h3>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {it.d}
              </p>

              {/* bottom accent bar (role-based) */}
              <div
                className={`mt-4 h-1 w-16 rounded-full bg-gradient-to-r ${accent.gradBar} transition-all group-hover:w-24`}
              />
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button asChild size="lg" className={buttonSolid + " rounded-xl"}>
            <Link to="/register">Create Free Account</Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className={`rounded-xl ${buttonOutline} ${accent.outlineText} ${accent.outlineHover} ${accent.outlineBorder}`}
          >
            <Link to="/features">Explore Full Feature List</Link>
          </Button>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-auto max-w-7xl px-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-neutral-800" />
      </div>

      {/* Extra section: Role Highlights */}
      <RoleHighlights />
    </section>
  );
};

export default Features;

/* ---- Inline subcomponent (same file for simplicity) ---- */
const RoleHighlights = () => {
  const { colors } = useRoleColor();
  const accent = TOKEN_ACCENTS[colors.token];

  const roles = [
    {
      role: "User",
      points: [
        "Instant transfers",
        "Cash-in/out nearby agents",
        "Bill pay & history",
      ],
      tone: "from-pink-500/15 to-rose-500/15",
      chip: "Everyday Wallet",
    },
    {
      role: "Agent",
      points: [
        "Cash-in to users",
        "Cash-out from users",
        "Auto commission tracking",
      ],
      tone: "from-blue-500/10 to-cyan-500/10",
      chip: "Service Network",
    },
    {
      role: "Admin",
      points: [
        "User/Agent management",
        "KPI dashboards",
        "Audit & risk controls",
      ],
      tone: "from-gray-900/10 to-gray-950/10",
      chip: "Control Center",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h3 className="text-2xl font-bold md:text-3xl">Role Highlights</h3>
          <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
            What each role gets out of DigiPay.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {roles.map((r) => (
          <div
            key={r.role}
            className="relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/70 p-5 shadow-sm transition-all hover:-translate-y-[2px] hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70"
          >
            {/* soft background tone (kept per-card) */}
            <div
              className={`pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-gradient-to-tr ${r.tone} blur-2xl`}
            />
            <div className="relative z-10">
              <div className="mb-2 inline-flex items-center gap-2">
                <span className="rounded-full border border-neutral-200/70 bg-white px-2 py-0.5 text-xs text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
                  {r.chip}
                </span>
              </div>
              <h4 className="text-lg font-semibold">{r.role}</h4>
              <ul className="mt-2 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                {r.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${accent.bullet}`}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
