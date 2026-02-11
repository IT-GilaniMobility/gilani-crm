"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type SLATimerChipProps = {
  deadlineAt: string | null;
};

function formatRemaining(ms: number) {
  const totalMinutes = Math.max(Math.floor(ms / 60000), 0);
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function SLATimerChip({ deadlineAt }: SLATimerChipProps) {
  const [now, setNow] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNow(Date.now());
    }, 0);
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 60_000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  const { label, status } = useMemo(() => {
    if (!deadlineAt) {
      return { label: "—", status: "neutral" };
    }

    const diff = new Date(deadlineAt).getTime() - now;

    if (Number.isNaN(diff)) {
      return { label: "—", status: "neutral" };
    }

    if (diff <= 0) {
      return { label: "Overdue", status: "overdue" };
    }

    if (diff <= 86_400_000) {
      return { label: formatRemaining(diff), status: "warning" };
    }

    return { label: formatRemaining(diff), status: "ok" };
  }, [deadlineAt, now]);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        status === "ok" && "bg-emerald-50 text-emerald-700",
        status === "warning" && "bg-amber-50 text-amber-700",
        status === "overdue" && "bg-rose-50 text-rose-600",
        status === "neutral" && "bg-slate-100 text-slate-500"
      )}
    >
      {label}
    </span>
  );
}
