"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database";

export type Lead = Database["public"]["Tables"]["leads"]["Row"];
export type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
export type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"] & {
  id: string;
};

export function useLeads() {
  const queryClient = useQueryClient();

  const leadsQuery = useQuery({
    queryKey: ["leads"],
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return (data ?? []) as Lead[];
    },
    staleTime: 20_000,
  });

  const addLead = useMutation({
    mutationFn: async (payload: LeadInsert) => {
      const { data, error } = await supabase
        .from("leads")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return data as Lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const updateLead = useMutation({
    mutationFn: async (payload: LeadUpdate) => {
      const { id, ...updates } = payload;
      const { data, error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      return data as Lead;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  return {
    ...leadsQuery,
    addLead,
    updateLead,
  };
}
