
import { Scale, ShieldCheck, Bell } from "lucide-react";
import useRoleColor from "@/hooks/useRoleColor";
import { TOKEN_ACCENTS } from "@/styles/roleAccents";

const Terms = () => {
  const { colors } = useRoleColor();
  const accent = TOKEN_ACCENTS[colors.token];

  const terms = [
    {
      text: "Use the service lawfully and responsibly.",
      icon: <Scale size={18} />,
    },
    {
      text: "Respect role-based limits and fair usage policies.",
      icon: <ShieldCheck size={18} />,
    },
    {
      text: "We may update terms and notify users in-app.",
      icon: <Bell size={18} />,
    },
  ];

  return (
    <section className="relative">
      {/* background accents (role-based) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`absolute left-[8%] top-[-60px] h-64 w-64 rounded-full bg-gradient-to-tr ${accent.ambientBlob} blur-3xl`}
        />
        <div className="absolute right-[10%] bottom-[-60px] h-72 w-72 rounded-full bg-gradient-to-tr from-gray-900/10 to-gray-950/10 blur-2xl" />
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16">
        {/* Heading */}
        <h2 className="text-3xl font-extrabold md:text-4xl">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-gray-100 dark:via-gray-200 dark:to-white">
            Terms &amp; Conditions
          </span>
        </h2>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          By using DigiPay, you agree to the following terms.
        </p>

        {/* Terms list */}
        <ul className="mt-6 space-y-4 text-sm">
          {terms.map((t, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-neutral-200/70 bg-white/70 p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70"
            >
              <span
                className={`mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${accent.iconBgSoft} ${colors.text}`}
              >
                {t.icon}
              </span>
              <span className="text-neutral-700 dark:text-neutral-400">
                {t.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Extra notice */}
        <div className="mt-10 rounded-2xl border border-neutral-200/70 bg-gradient-to-tr from-gray-900 to-gray-950 p-6 text-white shadow-lg dark:border-neutral-800">
          <h3 className="text-lg font-semibold">Acceptance of Terms</h3>
          <p className="mt-2 text-sm text-white/90">
            By continuing to use DigiPay, you confirm that you have read,
            understood, and agree to be bound by these Terms &amp; Conditions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Terms;
