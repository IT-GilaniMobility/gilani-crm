"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile, type Profile } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabaseClient";

export default function TeamPage() {
  const { data: profile } = useProfile();

  const { data: team = [], isLoading } = useQuery<Profile[]>({
    queryKey: ["team"],
    queryFn: async (): Promise<Profile[]> => {
      let query = supabase.from("profiles").select("*");
      if (profile?.role === "manager") {
        query = query.eq("manager_id", profile.id);
      }
      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as Profile[];
    },
    enabled: Boolean(profile),
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["team-leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("assigned_to");
      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(profile),
  });

  const teamStats = useMemo(() => {
    return team.map((member) => {
      const count = leads.filter((lead) => lead.assigned_to === member.id).length;
      return {
        ...member,
        leadCount: count,
      };
    });
  }, [leads, team]);

  if (!profile || (profile.role !== "manager" && profile.role !== "admin")) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
        You do not have access to view team analytics.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">My Team</h2>
        <p className="text-sm text-slate-500">
          Overview of team members and active lead assignments.
        </p>
      </div>
      {isLoading ? (
        <p className="text-sm text-slate-500">Loading team data...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teamStats.map((member) => (
            <Card key={member.id}>
              <CardHeader>
                <CardTitle className="text-base">
                  {member.id.slice(0, 8)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">
                  Role: {member.role ?? "sales"}
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {member.leadCount} leads
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
