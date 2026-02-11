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
      staleTime: 30_000,
    });
