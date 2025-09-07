// src/sections/Pricing.tsx
import { Check, Wallet, Zap, Briefcase } from "lucide-react";
import useRoleColor from "@/hooks/useRoleColor";
import { TOKEN_ACCENTS } from "@/styles/roleAccents";

const Pricing = () => {
  const { colors, buttonSolid, buttonOutline } = useRoleColor();
  const accent = TOKEN_ACCENTS[colors.token];

  const plans = [
    {
      name: "Basic",
      price: "BDT 0/mo",
      perks: ["Send money", "Wallet balance", "Support"],
      icon: <Wallet size={28} />,
      highlight: false,
    },
    {
      name: "Pro",
      price: "BDT 199/mo",
      perks: ["All Basic", "Advanced filters", "Priority support"],
      icon: <Zap size={28} />,
      highlight: true, // most popular
    },
    {
      name: "Business",
      price: "BDT 499/mo",
      perks: ["All Pro", "Team dashboards", "Custom limits"],
      icon: <Briefcase size={28} />,
      highlight: false,
    },
  ];

  return (
    <section className="relative">
      {/* soft bg accents (role-based) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`absolute left-[8%] top-[-60px] h-64 w-64 rounded-full bg-gradient-to-tr ${accent.ambientBlob} blur-3xl`}
        />
        <div className="absolute right-[10%] bottom-[-60px] h-72 w-72 rounded-full bg-gradient-to-tr from-gray-900/10 to-gray-950/10 blur-2xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16">
        {/* Heading */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold md:text-4xl">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-gray-100 dark:via-gray-200 dark:to-white">
              Pricing
            </span>
          </h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            Transparent fees with optional subscriptions.
          </p>
        </div>

        {/* Plans */}
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-[2px] hover:shadow-lg dark:border-neutral-800 ${
                p.highlight
                  ? // role-based highlight card
                    `border-transparent bg-gradient-to-b ${accent.glow} ring-1 ${accent.ringHover} dark:from-10% dark:to-90%`
                  : // neutral card
                    "bg-white/70 dark:bg-neutral-900/70"
              }`}
            >
              {p.highlight && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full ${colors.bg} px-3 py-1 text-xs font-semibold text-white`}
                >
                  Most Popular
                </div>
              )}

              {/* Icon + Name */}
              <div className={`mb-3 flex items-center gap-2 ${colors.text}`}>
                <span
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${accent.iconBgSoft}`}
                >
                  {p.icon}
                </span>
                <span className="text-xl font-semibold text-gray-900 dark:text-white">
                  {p.name}
                </span>
              </div>

              {/* Price */}
              <div className="mt-1 text-3xl font-extrabold">{p.price}</div>

              {/* Perks */}
              <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-center gap-2">
                    <Check size={16} className={colors.text} />
                    {perk}
                  </li>
                ))}
              </ul>

              {/* Button (role-based): solid for highlight, outline for others */}
              {p.highlight ? (
                <button
                  className={`mt-6 w-full rounded-xl px-4 py-2 font-medium transition ${buttonSolid}`}
                >
                  Choose {p.name}
                </button>
              ) : (
                <button
                  className={`mt-6 w-full rounded-xl px-4 py-2 font-medium transition ${buttonOutline} ${accent.outlineText} ${accent.outlineHover} ${accent.outlineBorder}`}
                >
                  Choose {p.name}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
