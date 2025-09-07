// src/sections/FAQ.tsx
import {
  ShieldCheck,
  Smartphone,
  Users,
  CreditCard,
  Globe,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useRoleColor from "@/hooks/useRoleColor";
import { TOKEN_ACCENTS } from "@/styles/roleAccents";

const FAQ = () => {
  const { colors, buttonSolid } = useRoleColor();
  const accent = TOKEN_ACCENTS[colors.token];

  const data = [
    {
      q: "Is DigiPay secure?",
      a: "Yes. We use JWT authentication, secure cookies, and server-side role checks to keep your data safe.",
      icon: <ShieldCheck size={20} />,
    },
    {
      q: "Can I use DigiPay on mobile?",
      a: "Absolutely. The UI is fully responsive and optimized for all modern smartphones and tablets.",
      icon: <Smartphone size={20} />,
    },
    {
      q: "What roles are supported?",
      a: "We currently support User, Agent, and Admin — each with their own dashboards and permissions.",
      icon: <Users size={20} />,
    },
    {
      q: "Are there any hidden fees?",
      a: "No. DigiPay pricing is fully transparent. You only pay the subscription fee for Pro or Business plans if you choose them.",
      icon: <CreditCard size={20} />,
    },
    {
      q: "Is DigiPay available outside Bangladesh?",
      a: "Our primary focus is Bangladesh, but global expansion is part of our vision. Stay tuned for upcoming regions!",
      icon: <Globe size={20} />,
    },
  ];

  return (
    <section className="relative">
      {/* background accents (role-based) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`absolute left-[10%] top-[-40px] h-56 w-56 rounded-full bg-gradient-to-tr ${accent.ambientBlob} blur-3xl`}
        />
        <div className="absolute right-[5%] bottom-[-60px] h-72 w-72 rounded-full bg-gradient-to-tr from-gray-900/10 to-gray-950/10 blur-2xl" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16">
        {/* Heading */}
        <h2 className="text-center text-3xl font-extrabold md:text-4xl">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-gray-100 dark:via-gray-200 dark:to-white">
            Frequently Asked Questions
          </span>
        </h2>

        {/* FAQ items */}
        <div className="mt-8 divide-y rounded-2xl border border-neutral-200/70 bg-white/70 shadow-sm dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900/70">
          {data.map((it) => (
            <details
              key={it.q}
              className={`group p-5 transition-all [&[open]]:ring-1 ${accent.ringHover} [&[open]]:${colors.softBg}`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className={colors.text}>{it.icon}</span>
                  <span
                    className={`font-medium transition-colors group-open:${colors.text}`}
                  >
                    {it.q}
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className="text-neutral-500 transition-transform duration-200 group-open:rotate-180"
                />
              </summary>
              <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                {it.a}
              </p>
            </details>
          ))}
        </div>

        {/* Extra CTA section */}
        <div className="mt-10 text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Still have questions? We’re here to help.
          </p>
          <Button
            asChild
            size="lg"
            className={buttonSolid + " mt-3 rounded-xl"}
          >
            <Link to="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
