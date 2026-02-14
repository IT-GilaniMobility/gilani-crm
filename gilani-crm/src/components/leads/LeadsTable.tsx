"use client";

import { useMemo, useState } from "react";
import { ChevronDown, MoreVertical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Lead } from "@/hooks/useLeads";
import { SLATimerChip } from "@/components/leads/SLATimerChip";

type LeadsTableProps = {
  leads: Lead[];
  isLoading: boolean;
  onSelectLead: (lead: Lead) => void;
};

type SortKey = "client_name" | "status" | "amount" | "deadline_at";

type SortState = {
  key: SortKey;
  direction: "asc" | "desc";
};

const PAGE_SIZE = 10;

function formatAmount(value: number | null) {
  if (!value) {
    return "—";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusVariant(status: string | null) {
  switch (status) {
    case "Won":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200";
    case "Negotiation":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200";
    case "Lost":
      return "bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-200";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function LeadsTable({ leads, isLoading, onSelectLead }: LeadsTableProps) {
  const [sort, setSort] = useState<SortState>({
    key: "client_name",
    direction: "asc",
  });
  const [page, setPage] = useState(1);

  const sortedLeads = useMemo(() => {
    const sorted = [...leads].sort((a, b) => {
      const key = sort.key;
      const valueA = a[key] ?? "";
      const valueB = b[key] ?? "";

      if (typeof valueA === "number" && typeof valueB === "number") {
        return sort.direction === "asc" ? valueA - valueB : valueB - valueA;
      }

      const compare = String(valueA).localeCompare(String(valueB));
      return sort.direction === "asc" ? compare : -compare;
    });

    return sorted;
  }, [leads, sort]);

  const totalPages = Math.max(Math.ceil(sortedLeads.length / PAGE_SIZE), 1);

  const pagedLeads = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedLeads.slice(start, start + PAGE_SIZE);
  }, [page, sortedLeads]);

  const handleSort = (key: SortKey) => {
    setPage(1);
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-sm text-muted-foreground">
        No leads yet. Create your first lead to get started.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="hidden sm:block">
        <div className="rounded-2xl border border-border bg-card shadow-sm">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-card/95 shadow-sm backdrop-blur">
              <TableRow>
                <TableHead>
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => handleSort("client_name")}
                  >
                    Client Name
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => handleSort("deadline_at")}
                  >
                    Deadline
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="inline-flex items-center gap-1"
                    onClick={() => handleSort("amount")}
                  >
                    Amount
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="cursor-pointer"
                  onClick={() => onSelectLead(lead)}
                >
                  <TableCell className="font-medium">
                    {lead.client_name ?? "—"}
                  </TableCell>
                  <TableCell>{lead.phone ?? "—"}</TableCell>
                  <TableCell>
                    <Badge className={cn("border-0", statusVariant(lead.status))}>
                      {lead.status ?? "New"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lead.assigned_to ? lead.assigned_to.slice(0, 8) : "—"}
                  </TableCell>
                  <TableCell>
                    <SLATimerChip deadlineAt={lead.deadline_at} />
                  </TableCell>
                  <TableCell>{formatAmount(lead.amount)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onSelectLead(lead)}>
                          View details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="grid gap-4 sm:hidden">
        {pagedLeads.map((lead) => (
          <button
            key={lead.id}
            onClick={() => onSelectLead(lead)}
            className="rounded-2xl border border-border bg-card p-4 text-left shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                {lead.client_name ?? "—"}
              </p>
              <Badge className={cn("border-0", statusVariant(lead.status))}>
                {lead.status ?? "New"}
              </Badge>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {lead.phone ?? "No phone"}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {lead.assigned_to ? lead.assigned_to.slice(0, 8) : "—"}
              </span>
              <SLATimerChip deadlineAt={lead.deadline_at} />
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Page {page} of {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
