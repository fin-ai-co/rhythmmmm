import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type SubscriptionStatus = "trial" | "active" | "expired" | "canceled";

export interface Subscription {
  status: string;
  expires_at: string | null;
}

export const useSubscription = () => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["subscription", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscriptions")
        .select("status, expires_at")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as Subscription | null;
    },
    enabled: !!user,
  });

  const sub = query.data;
  const now = new Date();
  const expiresAt = sub?.expires_at ? new Date(sub.expires_at) : null;

  // Trial is active if status is "trial" and not expired
  const isTrialActive = sub?.status === "trial" && expiresAt && expiresAt > now;
  // Paid subscription is active
  const isPaidActive = sub?.status === "active" && (!expiresAt || expiresAt > now);
  // User has access if trial or paid is active
  const hasAccess = isTrialActive || isPaidActive;
  // Trial has expired
  const isTrialExpired = sub?.status === "trial" && expiresAt && expiresAt <= now;
  // Any expiry
  const isExpired = isTrialExpired || (sub?.status === "expired") || (sub?.status === "canceled");

  // Days remaining in trial
  const trialDaysLeft = isTrialActive && expiresAt
    ? Math.max(0, Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return {
    hasAccess,
    isPremium: isPaidActive ?? false,
    isTrialActive: isTrialActive ?? false,
    isExpired: isExpired ?? false,
    isTrialExpired: isTrialExpired ?? false,
    trialDaysLeft,
    status: sub?.status ?? "trial",
    expiresAt,
    isLoading: query.isLoading,
  };
};
