"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useLeads } from "@/hooks/useLeads";
import { useProfile } from "@/hooks/useProfile";
import type { ProfileWithEmail } from "@/hooks/useProfile";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database";

const leadSchema = z.object({
  inquiry_date: z.string().min(1, "Inquiry date is required."),
  client_name: z.string().min(1, "Client name is required."),
  company_name: z.string().optional(),
  phone: z.string().min(7, "Phone number is required."),
  email: z.string().email("Enter a valid email.").optional().or(z.literal("")),
  source: z.string().min(1, "Source is required."),
  channel: z.string().min(1, "Channel is required."),
  product_category: z.string().min(1, "Product category is required."),
  enquiring_about: z.string().min(1, "Enquiry detail is required."),
  status: z.string().default("New"),
  notes: z.string().optional(),
  assigned_to: z.string().optional(),
});

const STATUS_OPTIONS = ["New", "Negotiation", "Won", "Lost"]; 

type LeadFormValues = z.infer<typeof leadSchema>;

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];


export function AddLeadModal() {
  const { data: profile } = useProfile();
  const { addLead } = useLeads();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Partial<LeadFormValues>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [teamOptions, setTeamOptions] = useState<ProfileRow[]>([]);
  const [values, setValues] = useState<LeadFormValues>({
    inquiry_date: "",
    client_name: "",
    company_name: "",
    phone: "",
    email: "",
    source: "",
    channel: "",
    product_category: "",
    enquiring_about: "",
    status: "New",
    notes: "",
    assigned_to: "",
  });

  // Type guard: profile is ProfileWithEmail if it has a role and id property
  function isProfileWithEmail(p: unknown): p is ProfileWithEmail {
    return !!p && typeof p === "object" && "role" in p && "id" in p;
  }

  const isManager = isProfileWithEmail(profile) && (profile.role === "manager" || profile.role === "admin");

  useEffect(() => {
    const fetchTeam = async () => {
      if (!isManager || !profile) {
        return;
      }

      let query = supabase.from("profiles").select("*");
      if (profile.role === "manager") {
        query = query.eq("manager_id", profile.id);
      }

      const { data, error } = await query;
      if (!error && data) {
        setTeamOptions(data as ProfileRow[]);
      }
    };

    fetchTeam();
  }, [isManager, profile]);

  const assignableOptions = useMemo<ProfileRow[]>(() => {
    if (!isManager || !isProfileWithEmail(profile)) {
      return [];
    }
    const merged = [...teamOptions];
    if (
      typeof profile.id === "string" &&
      !merged.some((member) => member.id === profile.id)
    ) {
      merged.unshift({
        id: profile.id,
        role: profile.role ?? null,
        manager_id: profile.manager_id ?? null,
        created_at: profile.created_at ?? null,
      });
    }
    return merged;
  }, [isManager, profile, teamOptions]);

  const handleChange = (field: keyof LeadFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setFormError(null);
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Partial<LeadFormValues> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LeadFormValues;
        nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      return;
    }

    setErrors({});

    // Only allow submit if profile is present and has id
    if (!isProfileWithEmail(profile) || typeof profile.id !== "string") {
      setFormError("Unable to determine lead owner.");
      return;
    }

    const assignedTo = isManager
      ? values.assigned_to || profile.id
      : profile.id;

    if (!assignedTo) {
      setFormError("Unable to determine lead owner.");
      return;
    }

    try {
      await addLead.mutateAsync({
        ...parsed.data,
        assigned_to: assignedTo,
        status: parsed.data.status || "New",
      });
      setOpen(false);
      setValues({
        inquiry_date: "",
        client_name: "",
        company_name: "",
        phone: "",
        email: "",
        source: "",
        channel: "",
        product_category: "",
        enquiring_about: "",
        status: "New",
        notes: "",
        assigned_to: "",
      });
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Unable to add lead."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto">+ Add Lead</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Lead</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label>Inquiry Date</Label>
            <Input
              type="date"
              value={values.inquiry_date}
              onChange={(event) => handleChange("inquiry_date", event.target.value)}
            />
            {errors.inquiry_date && (
              <p className="text-xs text-rose-500">{errors.inquiry_date}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Client Name</Label>
            <Input
              value={values.client_name}
              onChange={(event) => handleChange("client_name", event.target.value)}
            />
            {errors.client_name && (
              <p className="text-xs text-rose-500">{errors.client_name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Company Name</Label>
            <Input
              value={values.company_name}
              onChange={(event) => handleChange("company_name", event.target.value)}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={values.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
              />
              {errors.phone && (
                <p className="text-xs text-rose-500">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={values.email}
                onChange={(event) => handleChange("email", event.target.value)}
              />
              {errors.email && (
                <p className="text-xs text-rose-500">{errors.email}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Source</Label>
              <Input
                value={values.source}
                onChange={(event) => handleChange("source", event.target.value)}
              />
              {errors.source && (
                <p className="text-xs text-rose-500">{errors.source}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Channel</Label>
              <Input
                value={values.channel}
                onChange={(event) => handleChange("channel", event.target.value)}
              />
              {errors.channel && (
                <p className="text-xs text-rose-500">{errors.channel}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Product Category</Label>
              <Input
                value={values.product_category}
                onChange={(event) =>
                  handleChange("product_category", event.target.value)
                }
              />
              {errors.product_category && (
                <p className="text-xs text-rose-500">{errors.product_category}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Enquiring About</Label>
              <Input
                value={values.enquiring_about}
                onChange={(event) =>
                  handleChange("enquiring_about", event.target.value)
                }
              />
              {errors.enquiring_about && (
                <p className="text-xs text-rose-500">{errors.enquiring_about}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={values.status}
                onValueChange={(value) => handleChange("status", value)}
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
            {isManager && (
              <div className="space-y-2">
                <Label>Assign To</Label>
                <Select
                  value={values.assigned_to}
                  onValueChange={(value) => handleChange("assigned_to", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select teammate" />
                  </SelectTrigger>
                  <SelectContent>
                    {assignableOptions.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {typeof member.id === "string" ? member.id.slice(0, 8) : "-"} · {member.role ?? "sales"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={values.notes}
              onChange={(event) => handleChange("notes", event.target.value)}
            />
          </div>
          {formError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-600">
              {formError}
            </div>
          )}
          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={addLead.isPending}>
              {addLead.isPending ? "Saving..." : "Create lead"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
