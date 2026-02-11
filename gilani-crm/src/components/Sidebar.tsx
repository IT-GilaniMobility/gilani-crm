"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Users, BarChart3, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  role: string;
};

const NAV_ITEMS = [
  {
    label: "My Leads",
    href: "/dashboard",
    icon: LayoutGrid,
    roles: ["sales", "manager", "admin"],
  },
  {
    label: "My Team",
    href: "/team",
    icon: Users,
    roles: ["manager", "admin"],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["admin"],
  },
];

export function Sidebar({ collapsed, onToggle, role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-slate-200 bg-white transition-all",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
            G
          </div>
          {!collapsed && (
            <div>
              <p className="text-sm font-semibold">Gilani CRM</p>
              <p className="text-xs text-slate-500">Lead Management</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:inline-flex"
          onClick={onToggle}
        >
          <ChevronLeft
            className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")}
          />
        </Button>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV_ITEMS.filter((item) => item.roles.includes(role)).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 pb-6 text-xs text-slate-500">
        {!collapsed && <p>v1.0 Internal</p>}
      </div>
    </aside>
  );
}
