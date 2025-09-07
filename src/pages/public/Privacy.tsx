
import { ShieldCheck, Lock, Trash2 } from "lucide-react";
import useRoleColor from "@/hooks/useRoleColor";
import { TOKEN_ACCENTS } from "@/styles/roleAccents";

const Privacy = () => {
  const { colors } = useRoleColor();
  const accent = TOKEN_ACCENTS[colors.token];

  const policies = [
    {
      text: "We store only necessary information for account usage.",
      icon: <Lock size={18} />,
    },
    {
      text: "We never sell your data to third parties.",
      icon: <ShieldCheck size={18} />,
    },
    {
      text: "You can request data deletion at any time.",
      icon: <Trash2 size={18} />,
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
        <h2 className="text-3xl font-extrabold md:text-4xl">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-gray-100 dark:via-gray-200 dark:to-white">
            Privacy Policy
          </span>
        </h2>
        <p className="mt-3 text-neutral-600 dark:text-neutral-300">
          We value your privacy and follow strict policies to protect your data.
        </p>

        {/* Policies list */}
        <ul className="mt-6 space-y-4 text-sm">
          {policies.map((p, idx) => (
            <li
              key={idx}
              className={`flex items-start gap-3 rounded-xl border border-neutral-200/70 bg-white/70 p-4 shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900/70`}
            >
              <span
                className={`mt-1 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${accent.iconBgSoft} ${colors.text}`}
              >
                {p.icon}
              </span>
              <span className="text-neutral-700 dark:text-neutral-400">
                {p.text}
              </span>
            </li>
          ))}
        </ul>

        {/* Extra section */}
        <div className="mt-10 rounded-2xl border border-neutral-200/70 bg-gradient-to-tr from-gray-900 to-gray-950 p-6 text-white shadow-lg dark:border-neutral-800">
          <h3 className="text-lg font-semibold">Your Rights</h3>
          <p className="mt-2 text-sm text-white/90">
            You have the right to access, correct, or delete your personal data.
            Please contact our support team for any privacy-related requests.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
