// src/sections/StatsCta.tsx
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import useRoleColor from "@/hooks/useRoleColor";

const StatsCta = () => {
  const { buttonSolid } = useRoleColor();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20">
      <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-tr from-gray-900 to-gray-950 p-6 text-white shadow-xl">
        <div className="grid items-center gap-6 md:grid-cols-2">
          {/* Text content */}
          <div>
            <h3 className="text-2xl font-bold md:text-3xl">
              Trusted. Fast. Built for scale.
            </h3>
            <p className="mt-2 text-gray-300">
              DigiPay delivers secure payments and real-time insights for users,
              agents, and admins.
            </p>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-2xl font-extrabold">99.95%</div>
                <div className="text-xs opacity-80">Uptime</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-2xl font-extrabold">0.8s</div>
                <div className="text-xs opacity-80">Avg Transfer</div>
              </div>
              <div className="rounded-xl bg-white/5 p-3">
                <div className="text-2xl font-extrabold">24/7</div>
                <div className="text-xs opacity-80">Monitoring</div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-start gap-3 md:justify-end">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-xl bg-white text-gray-900 hover:bg-gray-100"
            >
              <Link to="/pricing">See Pricing</Link>
            </Button>
            <Button asChild size="lg" className={buttonSolid + " rounded-xl"}>
              <Link to="/register">Create Free Account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsCta;
