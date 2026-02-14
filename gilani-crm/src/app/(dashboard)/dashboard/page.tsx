"use client";

import { useEffect, useMemo, useState } from "react";

import { AddLeadModal } from "@/components/leads/AddLeadModal";
import { LeadDrawer } from "@/components/leads/LeadDrawer";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLeads, type Lead } from "@/hooks/useLeads";

const STATUS_FILTERS = ["All", "New", "Negotiation", "Won", "Lost"]; 

export default function DashboardPage() {
  const { data: leads = [], isLoading } = useLeads();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setNow(Date.now());
    }, 0);
    return () => clearTimeout(timeout);
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesStatus =
        statusFilter === "All" || lead.status === statusFilter;
      const matchesSearch =
        !search ||
        [lead.client_name, lead.company_name, lead.phone, lead.email]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          );
      return matchesStatus && matchesSearch;
    });
  }, [leads, search, statusFilter]);

  const kpis = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((lead) => lead.status === "New").length;
    const negotiation = leads.filter((lead) => lead.status === "Negotiation").length;
    const won = leads.filter((lead) => lead.status === "Won").length;
    const lost = leads.filter((lead) => lead.status === "Lost").length;
    const overdue = leads.filter((lead) => {
      if (!lead.deadline_at) return false;
      return new Date(lead.deadline_at).getTime() < now;
    }).length;

    return [
      { label: "Total", value: total },
      { label: "New", value: newCount },
      { label: "Negotiation", value: negotiation },
      { label: "Won", value: won },
      { label: "Lost", value: lost },
      { label: "Overdue", value: overdue },
    ];
  }, [leads, now]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">
            Lead Management
          </h2>
          <p className="text-sm text-muted-foreground">
            Track opportunities, SLA deadlines, and pipeline progress.
          </p>
        </div>
        <AddLeadModal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">
                {kpi.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTERS.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Search</Label>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, phone, or email"
            />
          </div>
        </div>
      </div>

      <LeadsTable
        leads={filteredLeads}
        isLoading={isLoading}
        onSelectLead={(lead) => setSelectedLead(lead)}
      />

      <LeadDrawer
        key={selectedLead?.id ?? "empty"}
        lead={selectedLead}
        open={Boolean(selectedLead)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLead(null);
          }
        }}
      />
    </div>
  );
}
