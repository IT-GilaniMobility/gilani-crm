"use client";

import { useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLeads, type Lead } from "@/hooks/useLeads";

const updateSchema = z.object({
  status: z.string(),
  latest_update: z.string().optional(),
  notes: z.string().optional(),
  doc_no: z.string().optional(),
  amount: z
    .string()
    .optional()
    .refine((value) => !value || !Number.isNaN(Number(value)), {
      message: "Amount must be a number.",
    }),
  payment_done: z.boolean().optional(),
  lost_reason: z.string().optional(),
});

const STATUS_OPTIONS = ["New", "Negotiation", "Won", "Lost"]; 

type LeadDrawerProps = {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const getInitialValues = (lead: Lead | null) => ({
  status: lead?.status ?? "New",
  latest_update: lead?.latest_update ?? "",
  notes: lead?.notes ?? "",
  doc_no: lead?.doc_no ?? "",
  amount: lead?.amount ? String(lead.amount) : "",
  payment_done: lead?.payment_done ?? false,
  lost_reason: lead?.lost_reason ?? "",
});

export function LeadDrawer({ lead, open, onOpenChange }: LeadDrawerProps) {
  const { updateLead } = useLeads();
  const [values, setValues] = useState(() => getInitialValues(lead));
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    if (!lead) {
      return;
    }

    const parsed = updateSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid values.");
      return;
    }

    const status = parsed.data.status;
    if (status === "Negotiation" && !parsed.data.doc_no) {
      setError("Negotiation requires a document number.");
      return;
    }
    if (status === "Won") {
      if (!parsed.data.doc_no || !parsed.data.amount) {
        setError("Won requires a document number and amount.");
        return;
      }
    }
    if (status === "Lost" && !parsed.data.lost_reason) {
      setError("Lost requires a reason.");
      return;
    }

    try {
      await updateLead.mutateAsync({
        id: lead.id,
        status,
        latest_update: parsed.data.latest_update,
        notes: parsed.data.notes,
        doc_no: parsed.data.doc_no,
        amount: parsed.data.amount ? Number(parsed.data.amount) : null,
        payment_done: parsed.data.payment_done ?? false,
        lost_reason: parsed.data.lost_reason,
        last_status_change_at: new Date().toISOString(),
      });
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:max-w-[520px]">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-8 py-6">
            <SheetTitle className="text-lg font-semibold text-slate-900">
              Update Lead
            </SheetTitle>
          </div>
          {lead && (
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-6">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">
                    {lead.client_name ?? "Unnamed lead"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {lead.company_name ?? "No company"} · {lead.phone ?? "No phone"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={values.status}
                    onValueChange={(value) =>
                      setValues((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Latest update</Label>
                  <Textarea
                    value={values.latest_update}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        latest_update: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={values.notes}
                    onChange={(event) =>
                      setValues((prev) => ({
                        ...prev,
                        notes: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Document No.</Label>
                    <Input
                      value={values.doc_no}
                      onChange={(event) =>
                        setValues((prev) => ({
                          ...prev,
                          doc_no: event.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input
                      value={values.amount}
                      onChange={(event) =>
                        setValues((prev) => ({
                          ...prev,
                          amount: event.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="payment_done"
                    checked={values.payment_done}
                    onCheckedChange={(checked) =>
                      setValues((prev) => ({
                        ...prev,
                        payment_done: Boolean(checked),
                      }))
                    }
                  />
                  <Label htmlFor="payment_done">Payment received</Label>
                </div>
                {values.status === "Lost" && (
                  <div className="space-y-2">
                    <Label>Lost reason</Label>
                    <Textarea
                      value={values.lost_reason}
                      onChange={(event) =>
                        setValues((prev) => ({
                          ...prev,
                          lost_reason: event.target.value,
                        }))
                      }
                    />
                  </div>
                )}
                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-600">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="border-t border-slate-200 px-8 py-4">
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={updateLead.isPending}
            >
              {updateLead.isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
