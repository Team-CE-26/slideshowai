"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ACTIVATION_STEPS,
  dismissActivation,
  type ActivationStep,
} from "@/lib/mock-data";

// Step id → where clicking it takes you.
const STEP_HREF: Record<ActivationStep["id"], string> = {
  create: "/dashboard",
  connect: "/dashboard/schedule",
  schedule: "/dashboard/schedule",
};

export function ActivationChecklist() {
  const [steps] = useState(ACTIVATION_STEPS);
  const [dismissed, setDismissed] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  const done = steps.filter((s) => s.done).length;
  const allDone = done === steps.length;
  const progress = Math.round((done / steps.length) * 100);

  if (dismissed) return null;

  const dismiss = async () => {
    if (!allDone || dismissing) return;
    setDismissing(true);
    await dismissActivation();
    setDismissed(true);
  };

  // Compact card sized for the sidebar (sits above the plan card).
  return (
    <section
      aria-label="Get set up"
      className="rounded-xl border border-border bg-card p-3.5"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-white">Get set up</h2>
          <p className="mt-0.5 text-xs text-muted">
            {done} of {steps.length} complete
          </p>
        </div>
        <button
          type="button"
          onClick={() => void dismiss()}
          disabled={!allDone}
          aria-label={
            allDone ? "Dismiss checklist" : "Complete all steps to dismiss"
          }
          title={allDone ? "Dismiss" : "Complete all steps to dismiss"}
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* progress */}
      <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="mt-2 space-y-0.5">
        {steps.map((step) => (
          <li key={step.id}>
            <Link
              href={STEP_HREF[step.id]}
              className="group flex items-center gap-2.5 rounded-lg px-1.5 py-1.5 transition-colors hover:bg-white/[0.04]"
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full transition-colors ${
                  step.done
                    ? "bg-accent text-white"
                    : "ring-1 ring-white/[0.2] group-hover:ring-white/[0.4]"
                }`}
              >
                {step.done && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </span>
              <span
                className={`min-w-0 flex-1 truncate text-xs font-medium ${
                  step.done ? "text-white/35 line-through" : "text-white/75"
                }`}
              >
                {step.label}
              </span>
              {!step.done && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0 text-white/20 transition-all group-hover:translate-x-0.5 group-hover:text-white/50">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
