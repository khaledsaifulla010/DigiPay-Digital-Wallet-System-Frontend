// src/sections/About.tsx
import { Target, Eye, Users, ShieldCheck, Zap } from "lucide-react";
import useRoleColor from "@/hooks/useRoleColor";
import { TOKEN_ACCENTS } from "@/styles/roleAccents";

const About = () => {
  const { colors } = useRoleColor();
  const accent = TOKEN_ACCENTS[colors.token];

  const items = [
    {
      title: "Mission",
      desc: "Provide a reliable digital wallet experience for everyone.",
      icon: <Target size={22} />,
      color: "from-pink-500/15 to-rose-500/15",
    },
    {
      title: "Vision",
      desc: "Empower users with fast, transparent, and secure financial tools.",
      icon: <Eye size={22} />,
      color: "from-blue-500/15 to-cyan-500/15",
    },
    {
      title: "Team",
      desc: "Product engineers, designers, and security experts.",
      icon: <Users size={22} />,
      color: "from-purple-500/15 to-fuchsia-500/15",
    },
  ];

  const values = [
    { icon: <ShieldCheck size={18} />, text: "Bank-grade security" },
    { icon: <Zap size={18} />, text: "Fast performance" },
    { icon: <Users size={18} />, text: "Community-driven" },
  ];

  return (
    <section className="relative">
      {/* subtle background accents (role-based) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`absolute left-[10%] top-[-60px] h-56 w-56 rounded-full bg-gradient-to-tr ${accent.ambientBlob} blur-3xl`}
        />
        <div className="absolute right-[5%] bottom-[-80px] h-72 w-72 rounded-full bg-gradient-to-tr from-gray-900/10 to-gray-950/10 blur-2xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold tracking-tight md:text-4xl">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-gray-100 dark:via-gray-200 dark:to-white">
            Our Story
          </span>
        </h2>
        <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-300">
          DigiPay is built with a mission to make digital money management
          simple, secure, and accessible — tailored for Bangladesh and beyond.
        </p>

        {/* Mission / Vision / Team */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((it) => (
            <div
              key={it.title}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm transition-all hover:-translate-y-[2px] hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70"
            >
              {/* bg accent per-card (kept) */}
              <div
                className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-tr ${it.color} blur-2xl`}
              />
              <div className="relative z-10">
                {/* icon chip (role-based) */}
                <div
                  className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent.iconBgSoft} ${colors.text}`}
                >
                  {it.icon}
                </div>
                <h3 className="text-lg font-semibold">{it.title}</h3>
                <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                  {it.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Values strip */}
        <div className="mt-12 rounded-2xl border border-neutral-200/70 bg-gradient-to-tr from-gray-900 to-gray-950 p-6 text-white shadow-lg dark:border-neutral-800">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            {values.map((v) => (
              <div
                key={v.text}
                className="flex items-center gap-2 text-white/90"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full bg-white/10 ring-1 ${colors.ring.replace(
                    "focus-visible:",
                    ""
                  )}`}
                >
                  {v.icon}
                </span>
                {v.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
