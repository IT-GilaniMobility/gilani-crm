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
  type Profile = {
    id: string;
    role: string | null;
    manager_id: string | null;
    created_at: string | null;
  };
      if (sessionError) {
  type ProfileWithEmail = Profile & { email: string };

  export function useProfile() {
    return useQuery<ProfileWithEmail, Error>({
      queryKey: ["profile"],
      queryFn: async (): Promise<ProfileWithEmail> => {
        // 1. Get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

          throw new Error(`Supabase session error: ${sessionError.message}`);
        .from("profiles")
        .select("*")
        .eq("id", sessionData.session.user.id)
          throw new Error("No active session found.");

      if (error) {
        throw error;
      }
          .select("id, role, manager_id, created_at")
      if (data) {
        return {
          ...data,
          email: sessionData.session.user.email,
          throw new Error(`Profile fetch error: ${error.message}`);
      } else {
        return {
          id: sessionData.session.user.id,
          // 4. Return strictly typed object
          return {
            id: data.id,
            role: data.role,
            manager_id: data.manager_id,
            created_at: data.created_at,
            email: sessionData.session.user.email,
          };
        } else {
          throw new Error("Profile not found for authenticated user.");
        }
      },
      "use client";

      import { useQuery } from "@tanstack/react-query";
      import { supabase } from "@/lib/supabaseClient";

      // Type declarations at module scope
      type Profile = {
        id: string;
        role: string | null;
        manager_id: string | null;
        created_at: string | null;
      };

      type ProfileWithEmail = Profile & { email: string };

      export function useProfile() {
        return useQuery<ProfileWithEmail, Error>({
          queryKey: ["profile"],
          queryFn: async (): Promise<ProfileWithEmail> => {
            const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) throw new Error(`Supabase session error: ${sessionError.message}`);
            const session = sessionData.session;
            if (!session) throw new Error("No active session found.");

            const email = typeof session.user?.email === "string" ? session.user.email : "";
            if (!email) throw new Error("Authenticated user has no email.");

            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("id, role, manager_id, created_at")
              .eq("id", session.user.id)
              .single();

            if (profileError) throw new Error(`Profile fetch error: ${profileError.message}`);
            if (!profile) throw new Error("Profile not found for authenticated user.");

            return {
              id: profile.id,
              role: profile.role,
              manager_id: profile.manager_id,
              created_at: profile.created_at,
              email,
            };
          },
          staleTime: 30_000,
        });
      }
