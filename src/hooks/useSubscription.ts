import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type SubscriptionStatus = "free" | "active" | "expired" | "canceled";

export interface Subscription {
  status: SubscriptionStatus;
  expires_at: string | null;
}

const FREE_HABIT_LIMIT = 3;

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

  const isPremium = query.data?.status === "active";

  return {
    isPremium,
    status: (query.data?.status ?? "free") as SubscriptionStatus,
    isLoading: query.isLoading,
    canAddHabit: (currentCount: number) => isPremium || currentCount < FREE_HABIT_LIMIT,
    FREE_HABIT_LIMIT,
  };
};
