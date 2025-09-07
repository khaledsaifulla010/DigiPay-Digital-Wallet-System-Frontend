// src/sections/HowItWorks.tsx
import { ShieldCheck, Smartphone, Send, LineChart } from "lucide-react";
import useRoleColor from "@/hooks/useRoleColor";

const Step = ({
  icon,
  title,
  desc,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  index: number;
}) => {
  const { colors } = useRoleColor();
  return (
    <div className="relative rounded-2xl border border-neutral-200 bg-white/70 p-5 dark:border-neutral-800 dark:bg-neutral-900/70">
      <div
        className={`absolute -top-3 left-4 rounded-full ${colors.bg} px-2 py-0.5 text-xs font-semibold text-white`}
      >
        {index}
      </div>
      <div className={`mb-3 text-2xl ${colors.text}`}>{icon}</div>
      <h4 className="font-semibold">{title}</h4>
      <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        {desc}
      </p>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16">
      <h2 className="mb-6 text-2xl font-bold md:text-3xl">How it works</h2>
      <div className="grid gap-4 md:grid-cols-4">
        <Step
          index={1}
          icon={<Smartphone />}
          title="Create your wallet"
          desc="Register with your phone/email and verify in seconds."
        />
        <Step
          index={2}
          icon={<ShieldCheck />}
          title="Secure your account"
          desc="Strong auth, encryption, and role-based permissions."
        />
        <Step
          index={3}
          icon={<Send />}
          title="Send & Receive"
          desc="Instant transfers, cash-in/out, and bill payments."
        />
        <Step
          index={4}
          icon={<LineChart />}
          title="Track everything"
          desc="Powerful dashboards and filters for full visibility."
        />
      </div>
    </section>
  );
};

export default HowItWorks;
