"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useProfile } from "@/hooks/useProfile";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const { data: profile } = useProfile();
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const role = profile?.role ?? "sales";
  const email = profile?.email ?? "";

  const contextLabel = useMemo(() => {
    if (pathname.startsWith("/team")) {
      return "My Team";
    }
    if (pathname.startsWith("/reports")) {
      return "Reports";
    }
    return "Dashboard";
  }, [pathname]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <div className="flex min-h-screen">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
          role={role}
        />
        <div className="flex flex-1 flex-col">
          <Topbar email={email} title={contextLabel} />
          <main className="flex-1 px-6 pb-10 pt-6 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
