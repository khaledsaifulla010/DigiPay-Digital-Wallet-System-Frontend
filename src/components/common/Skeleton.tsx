import React from "react";

const Skeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60 ${
        className || "h-6 w-24"
      }`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Skeleton;
