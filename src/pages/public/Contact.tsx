// src/sections/Contact.tsx
import { useState } from "react";
import { Mail, MapPin, Clock } from "lucide-react";
import useRoleColor from "@/hooks/useRoleColor";
import { TOKEN_ACCENTS } from "@/styles/roleAccents";

const Contact = () => {
  const [status, setStatus] = useState<"idle" | "sent">("idle");
  const { colors, buttonSolid } = useRoleColor();
  const accent = TOKEN_ACCENTS[colors.token];

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setStatus("sent"); // simulated submit
  };

  return (
    <section className="relative">
      {/* background accents (role-based) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className={`absolute left-[5%] top-[-60px] h-64 w-64 rounded-full bg-gradient-to-tr ${accent.ambientBlob} blur-3xl`}
        />
        <div className="absolute right-[8%] bottom-[-60px] h-72 w-72 rounded-full bg-gradient-to-tr from-gray-900/10 to-gray-950/10 blur-2xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-3xl font-extrabold md:text-4xl">
          <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent dark:from-gray-100 dark:via-gray-200 dark:to-white">
            Contact Us
          </span>
        </h2>
        <p className="mt-2 text-center text-neutral-600 dark:text-neutral-300">
          Have questions? We’d love to hear from you.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {/* Contact form */}
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70"
          >
            <div className="grid gap-4">
              <input
                className={`rounded-xl border border-neutral-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-transparent focus:outline-none focus-visible:ring-2 ${colors.ring} dark:border-neutral-700`}
                placeholder="Your name"
                required
              />
              <input
                type="email"
                className={`rounded-xl border border-neutral-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-transparent focus:outline-none focus-visible:ring-2 ${colors.ring} dark:border-neutral-700`}
                placeholder="Your email"
                required
              />
              <textarea
                className={`min-h-[140px] rounded-xl border border-neutral-200 bg-transparent px-4 py-3 text-sm outline-none transition focus:border-transparent focus:outline-none focus-visible:ring-2 ${colors.ring} dark:border-neutral-700`}
                placeholder="How can we help?"
                required
              />
              <button className={`${buttonSolid} rounded-xl px-5 py-3`}>
                Send Message
              </button>
            </div>

            {status === "sent" && (
              <div className="mt-4 rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-300">
                ✅ Message sent! We’ll reply soon (simulated).
              </div>
            )}
          </form>

          {/* Contact info */}
          <div className="rounded-2xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900/70">
            <h3 className="text-lg font-semibold">Get in touch</h3>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              Reach us directly for support or partnership inquiries.
            </p>

            <ul className="mt-6 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent.iconBgSoft} ${colors.text}`}
                >
                  <Mail size={18} />
                </span>
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    support@digipay.com
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent.iconBgSoft} ${colors.text}`}
                >
                  <MapPin size={18} />
                </span>
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Dhaka, Bangladesh
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent.iconBgSoft} ${colors.text}`}
                >
                  <Clock size={18} />
                </span>
                <div>
                  <p className="font-medium">Support Hours</p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Sat–Thu: 9am – 8pm
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
