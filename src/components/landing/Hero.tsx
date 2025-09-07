// src/sections/Hero.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useRoleColor from "@/hooks/useRoleColor";
import { TOKEN_ACCENTS } from "@/styles/roleAccents";

const Hero = () => {
  const { colors, buttonSolid, buttonOutline } = useRoleColor();
  const accent = TOKEN_ACCENTS[colors.token];

  return (
    <section className="relative overflow-hidden">
      {/* ambient gradient + blobs (role-based) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`absolute left-1/2 top-[-120px] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-tr ${accent.ambientBlob} blur-3xl`}
        />
        <div
          className={`absolute right-[-120px] bottom-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-tr ${accent.ambientBlob2} blur-3xl`}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-16 md:grid md:grid-cols-2 md:gap-10 md:pb-28 md:pt-24">
        {/* copy */}
        <div className="relative z-10 space-y-6">
          <div
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs
                           ${colors.text
                             .replace("text-", "border-")
                             .replace("600", "200")}
                           ${colors.softBg} ${colors.softText}`}
          >
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                TOKEN_ACCENTS[colors.token].bullet
              } dark:${colors.text.replace("text-", "bg-")}`}
            />
            PCI-aware • Bank-grade security
          </div>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            The secure, smart digital wallet for everyone
          </h1>

          <p className="max-w-xl text-neutral-600 dark:text-neutral-300">
            Send money, cash-in/out, and manage wallets with role-based controls
            for Users, Agents, and Admins—built for performance and trust.
          </p>

          {/* actions */}
          <div className="flex flex-wrap gap-3">
            {/* Primary: role solid */}
            <Button asChild size="lg" className={buttonSolid + " rounded-xl"}>
              <Link to="/login">Login</Link>
            </Button>

            {/* Outline: role outline */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className={`rounded-xl ${buttonOutline} ${accent.outlineText} ${accent.outlineHover} ${accent.outlineBorder}`}
            >
              <Link to="/register">Register</Link>
            </Button>

            {/* Secondary: soft role surface */}
            <Button
              asChild
              size="lg"
              variant="secondary"
              className={`rounded-xl ${colors.softBg} ${colors.softText} ${colors.outline} hover:bg-black/5 dark:hover:bg-white/10`}
            >
              <Link to="/features">Explore Features</Link>
            </Button>
          </div>

          {/* trust bullets */}
          <ul className="mt-4 grid gap-2 text-sm text-neutral-600 dark:text-neutral-400 md:grid-cols-2">
            <li>✔️ Real-time transactions</li>
            <li>✔️ Role-based dashboards</li>
            <li>✔️ Fraud & risk checks</li>
            <li>✔️ Fully responsive UI</li>
          </ul>

          {/* mini badges */}
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="rounded-lg border border-neutral-200/60 bg-white px-2 py-1 dark:border-neutral-800 dark:bg-neutral-900">
              256-bit TLS
            </span>
            <span className="rounded-lg border border-neutral-200/60 bg-white px-2 py-1 dark:border-neutral-800 dark:bg-neutral-900">
              JWT + RBAC
            </span>
            <span className="rounded-lg border border-neutral-200/60 bg-white px-2 py-1 dark:border-neutral-800 dark:bg-neutral-900">
              Uptime 99.95%
            </span>
          </div>
        </div>

        {/* visual */}
        <div className="relative mt-10 md:mt-0">
          {/* glow (role-based) */}
          <div
            className={`absolute inset-0 -z-10 bg-gradient-to-tr ${accent.glow} blur-2xl`}
          />
          <div className="relative rounded-2xl border border-neutral-200/60 bg-white/70 p-2 shadow-xl backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1600&auto=format&fit=crop"
              alt="Pay with phone—modern digital wallet experience"
              className="h-[360px] w-full rounded-xl object-cover md:h-[420px]"
              loading="lazy"
            />
            {/* subtle shine */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl [mask-image:radial-gradient(ellipse_at_top,white,transparent_65%)]">
              <div className="absolute -top-12 left-1/4 h-28 w-1/2 rotate-6 rounded-full bg-white/20 blur-2xl" />
            </div>
          </div>

          {/* floating card with role gradient bar */}
          <div className="absolute -bottom-6 left-6 right-6 mx-auto w-[92%] rounded-xl border border-neutral-200/60 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">Instant Transfer</span>
              <span className="text-neutral-500 dark:text-neutral-400">
                ~0.8s avg
              </span>
            </div>
            <div
              className={`mt-2 h-2 w-full rounded-full bg-gradient-to-r ${accent.gradBar}`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
