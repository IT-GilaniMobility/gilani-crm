"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";

import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useProfile } from "@/hooks/useProfile";
import type { ProfileWithEmail } from "@/hooks/useProfile";

type AppShellProps = {
  children: React.ReactNode;
};

export default function AppShell({ children }: AppShellProps) {

  const { data: profile } = useProfile();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Type guard for ProfileWithEmail
  function isProfileWithEmail(p: unknown): p is ProfileWithEmail {
    return !!p && typeof p === "object" && "role" in p && "email" in p;
  }

  const role = isProfileWithEmail(profile) && profile.role ? profile.role : "sales";
  const email = isProfileWithEmail(profile) ? profile.email : "";

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((value) => !value)}
            role={role}
          />
        </div>
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetContent side="left" className="p-0">
            <Sidebar
              collapsed={false}
              onToggle={() => setCollapsed((value) => !value)}
              role={role}
            />
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 flex-col">
          <Topbar
            email={email}
            title={contextLabel}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          />
          <main className="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
