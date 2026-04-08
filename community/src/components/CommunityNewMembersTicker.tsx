"use client";

import { useEffect, useState } from "react";

type Props = {
  names: string[];
};

/**
 * Vertical rolling list (duplicated for seamless loop). Expects ≤5 names from server.
 */
export function CommunityNewMembersTicker({ names }: Props) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (!names.length) {
    return (
      <p className="text-sm text-community-muted py-2">
        New joiners will appear here after onboarding — open the dashboard once so
        your username syncs.
      </p>
    );
  }

  if (reduceMotion) {
    return (
      <ul className="divide-y divide-community-border rounded-lg border border-community-border bg-community-surface/60">
        {names.map((name, i) => (
          <li
            key={`${i}-${name}`}
            className="flex h-9 items-center px-3 text-sm font-medium text-community-text"
          >
            <span className="text-community-muted mr-2 text-xs uppercase tracking-wide">
              New
            </span>
            <span className="truncate">{name}</span>
          </li>
        ))}
      </ul>
    );
  }

  const doubled = [...names, ...names];
  const durationSec = Math.max(10, names.length * 2.8);

  return (
    <div
      className="overflow-hidden rounded-lg border border-community-border bg-community-surface/60"
      style={{ height: "2.25rem" }}
      aria-label="Recently joined members"
    >
      <ul
        className="community-ticker-track"
        style={{
          animationDuration: `${durationSec}s`,
        }}
      >
        {doubled.map((name, i) => (
          <li
            key={`${i}-${name}`}
            className="flex h-9 items-center px-3 text-sm font-medium text-community-text"
          >
            <span className="text-community-muted mr-2 text-xs uppercase tracking-wide">
              New
            </span>
            <span className="truncate">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
