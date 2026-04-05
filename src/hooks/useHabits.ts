import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Habit {
  id: string;
  name: string;
  streak: number;
  friction: "low" | "medium" | "heavy";
  sort_order: number;
}

export const useHabits = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

  const habitsQuery = useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as Habit[];
    },
    enabled: !!user,
  });

  const completionsQuery = useQuery({
    queryKey: ["completions", user?.id, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habit_completions")
        .select("habit_id")
        .eq("completed_date", today);
      if (error) throw error;
      return new Set(data.map((c) => c.habit_id));
    },
    enabled: !!user,
  });

  const completeHabit = useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await supabase.from("habit_completions").insert({
        habit_id: habitId,
        user_id: user!.id,
        completed_date: today,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["completions"] });
    },
  });

  const addHabit = useMutation({
    mutationFn: async ({
      name,
      friction,
    }: {
      name: string;
      friction: "low" | "medium" | "heavy";
    }) => {
      const sortOrder = (habitsQuery.data?.length ?? 0) + 1;
      const { error } = await supabase.from("habits").insert({
        name,
        friction,
        user_id: user!.id,
        sort_order: sortOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  const deleteHabit = useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await supabase.from("habits").delete().eq("id", habitId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  return {
    habits: habitsQuery.data ?? [],
    completedIds: completionsQuery.data ?? new Set<string>(),
    isLoading: habitsQuery.isLoading || completionsQuery.isLoading,
    completeHabit: completeHabit.mutate,
    addHabit: addHabit.mutateAsync,
    deleteHabit: deleteHabit.mutate,
  };
};
