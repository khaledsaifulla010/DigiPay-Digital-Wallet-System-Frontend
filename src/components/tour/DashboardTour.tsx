/* eslint-disable @typescript-eslint/no-explicit-any */
import Joyride, { type CallBackProps, STATUS, type Step } from "react-joyride";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import useRoleColor from "@/hooks/useRoleColor";

const TOUR_KEY = "__digipay_tour_done__";

type Props = { role: "USER" | "AGENT" | "ADMIN" };

const targets = [
  "aside nav",
  "#tour-stats-card-1",
  "#tour-chart-1",
  "#tour-table-filters",
  "#tour-theme-toggle",
];

// Tailwind token → HEX (for Joyride inline styles)
const TOKEN_HEX = {
  "pink-600": { p600: "#db2777", p500: "#ec4899" },
  "purple-600": { p600: "#9333ea", p500: "#a855f7" },
  "green-600": { p600: "#16a34a", p500: "#22c55e" },
} as const;

const DashboardTour = ({ role }: Props) => {
  const { pathname } = useLocation();
  const [run, setRun] = useState(false);
  const [ready, setReady] = useState(false);
  const [forceKey, setForceKey] = useState(0);
  const storageKey = `${TOUR_KEY}_${role}`;

  // use role-based color
  const { colors } = useRoleColor();
  const hex = TOKEN_HEX[colors.token];

  const steps: Step[] = useMemo(
    () => [
      {
        target: "aside nav",
        content: `This is your ${role.toLowerCase()} navigation.`,
        disableBeacon: true,
        placement: "right",
      },
      { target: "#tour-stats-card-1", content: "Quick stats summary." },
      { target: "#tour-chart-1", content: "Visualize trends here." },
      { target: "#tour-table-filters", content: "Search and filter records." },
      { target: "#tour-theme-toggle", content: "Switch light/dark theme." },
    ],
    [role]
  );

  useEffect(() => {
    if (!(pathname === "/dashboard" || pathname === "/dashboard/")) {
      setRun(false);
      setReady(false);
      return;
    }
    let t: number | undefined;
    const wait = () => {
      const ok = targets.every((sel) => document.querySelector(sel));
      if (ok) {
        setReady(true);
        const done = localStorage.getItem(storageKey);
        setRun(!done);
      } else {
        t = window.setTimeout(wait, 150);
      }
    };
    wait();
    return () => {
      if (t) clearTimeout(t);
    };
  }, [pathname, storageKey]);

  useEffect(() => {
    const h = () => {
      const done = localStorage.getItem(storageKey);
      if (done) localStorage.removeItem(storageKey);
      setForceKey((x) => x + 1);
      setReady(false);
      const t = window.setTimeout(() => {
        const ok = targets.every((sel) => document.querySelector(sel));
        setReady(ok);
        setRun(true);
      }, 150);
      return () => clearTimeout(t);
    };
    window.addEventListener("digipay:restart-tour", h);
    return () => window.removeEventListener("digipay:restart-tour", h);
  }, [storageKey]);

  const onCb = (data: CallBackProps) => {
    const { status } = data;
    const finished = [STATUS.FINISHED, STATUS.SKIPPED].includes(status as any);
    if (finished) {
      setRun(false);
      localStorage.setItem(storageKey, "1");
    }
  };

  if (!ready) return null;

  return (
    <Joyride
      key={forceKey}
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      hideCloseButton
      scrollToFirstStep
      disableScrolling
      spotlightClicks
      floaterProps={{ offset: 10 }}
      spotlightPadding={10}
      callback={onCb}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: hex.p600, // role color
          backgroundColor: "var(--background)",
          textColor: "var(--foreground)",
          overlayColor: "rgba(0,0,0,0.55)",
        },
        tooltip: {
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.18), 0 8px 12px rgba(0,0,0,0.08)",
          borderRadius: 16,
          border: "1px solid hsl(var(--border))",
          padding: 16,
          maxWidth: 380,
        },
        tooltipContainer: {
          borderRadius: 16,
          fontSize: 14,
          lineHeight: 1.55,
        },
        buttonNext: {
          borderRadius: 10,
          fontWeight: 700,
          padding: "8px 14px",
          backgroundColor: hex.p600, // role color
        },
        buttonBack: {
          borderRadius: 10,
          padding: "8px 12px",
          color: "hsl(var(--muted-foreground))",
          background: "transparent",
        },
        buttonSkip: {
          borderRadius: 10,
          padding: "8px 12px",
          color: "hsl(var(--muted-foreground))",
          background: "transparent",
        },
        beaconInner: { backgroundColor: hex.p600 }, // role color
        beaconOuter: { borderColor: hex.p500 }, // lighter ring
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip",
      }}
    />
  );
};

export default DashboardTour;
