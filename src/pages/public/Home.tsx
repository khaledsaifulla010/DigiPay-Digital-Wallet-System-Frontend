import { useEffect, useState } from "react";
import Hero from "../../components/landing/Hero";
import FeatureCard from "../../components/landing/FeatureCard";
import HowItWorks from "../../components/landing/HowItWorks";
import StatsCta from "../../components/landing/StatsCta";
import Skeleton from "../../components/common/Skeleton";

const Home = () => {
  const [loading, setLoading] = useState(true);

  // Simulate data fetch for skeleton demo
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-6 text-2xl font-bold md:text-3xl">
          Why choose DigiPay?
        </h2>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-3">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              icon={<span>🔒</span>}
              title="Bank-grade Security"
              desc="JWT auth, bcrypt hashing, encrypt-at-rest, and strict RBAC."
            />
            <FeatureCard
              icon={<span>⚡</span>}
              title="Fast & Reliable"
              desc="Optimized APIs and responsive UI deliver instant actions."
            />
            <FeatureCard
              icon={<span>📊</span>}
              title="Insightful Dashboards"
              desc="Real-time charts, filters, and transaction histories."
            />
          </div>
        )}
      </section>

      <HowItWorks />
      <StatsCta />
    </>
  );
};

export default Home;
