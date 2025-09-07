// src/components/FeatureCard.tsx
import useRoleColor from "@/hooks/useRoleColor";
import { TOKEN_ACCENTS } from "@/styles/roleAccents";

type Props = {
  icon: React.ReactNode;
  title: string;
  desc: string;
};

const FeatureCard = ({ icon, title, desc }: Props) => {
  const { colors } = useRoleColor();
  const accent = TOKEN_ACCENTS[colors.token];

  return (
    <div className="group rounded-2xl border border-neutral-200 bg-white/70 p-5 transition-all hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900/70">
      <div
        className={`mb-3 text-2xl ${colors.text} transition-transform group-hover:scale-105`}
      >
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${accent.iconBgSoft}`}
        >
          {icon}
        </span>
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        {desc}
      </p>
    </div>
  );
};

export default FeatureCard;
