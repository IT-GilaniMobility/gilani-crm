"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import type { Profile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabaseClient";
import type { Lead } from "@/hooks/useLeads";

export default function ReportsPage() {
  const { data: profile } = useProfile();

  const { data: leads = [] } = useQuery<Lead[]>({
    queryKey: ["reports-leads"],
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase.from("leads").select("*");
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
    enabled: Boolean(profile),
  });

  const { data: profiles = [] } = useQuery<Profile[]>({
    queryKey: ["reports-profiles"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
    enabled: Boolean(profile),
  });

  const summary = useMemo(() => {
    const total = leads.length;
    const byStatus = leads.reduce<Record<string, number>>((acc, lead) => {
      const status = lead.status ?? "New";
      acc[status] = (acc[status] ?? 0) + 1;
      return acc;
    }, {});
    const revenue = leads
      .filter((lead) => lead.status === "Won")
      .reduce((sum, lead) => sum + (lead.amount ?? 0), 0);
    const autoLost = leads.filter((lead) => lead.auto_lost).length;

    const bySales = profiles.map((profileRow) => {
      const count = leads.filter((lead) => lead.assigned_to === profileRow.id).length;
      return {
        id: profileRow.id,
        role: profileRow.role ?? "sales",
        count,
      };
    });

    return { total, byStatus, revenue, autoLost, bySales };
  }, [leads, profiles]);

  function isProfileWithRole(p: unknown): p is Profile {
    return !!p && typeof p === "object" && "role" in p && "id" in p;
  }

  if (!isProfileWithRole(profile) || profile.role !== "admin") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
        You do not have access to view reports.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Reports</h2>
        <p className="text-sm text-slate-500">
          Executive overview of lead volume, performance, and revenue.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">{summary.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Revenue (Won)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(summary.revenue as number)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Auto Lost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">
              {summary.autoLost}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-slate-500">Leads by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-slate-500">
            {Object.entries(summary.byStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span>{status}</span>
                <span className="font-semibold text-slate-900">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leads per Salesperson</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {summary.bySales.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {person.id.slice(0, 8)}
                </p>
                <p className="text-xs text-slate-500">{person.role}</p>
              </div>
              <p className="text-sm font-semibold text-slate-900">
                {person.count} leads
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
