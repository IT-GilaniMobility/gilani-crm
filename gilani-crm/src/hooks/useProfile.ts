"use client";

import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabaseClient";
import type { Database, ProfileRole } from "@/types/database";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
  email?: string | null;
  role: ProfileRole | string | null;
};

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async (): Promise<Profile | null> => {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (!sessionData.session) {
        return null;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", sessionData.session.user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        return {
          ...data,
          email: sessionData.session.user.email,
        };
      } else {
        return {
          id: sessionData.session.user.id,
          role: null,
          manager_id: null,
          created_at: null,
          email: sessionData.session.user.email,
        };
      }
    },
    staleTime: 30_000,
  });
}
