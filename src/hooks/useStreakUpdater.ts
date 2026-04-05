import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

/**
 * On app load, checks each habit to see if the user completed it yesterday.
 * - If yes and streak wasn't already incremented today → increment streak
 * - If no → reset streak to 0
 * Uses the user's stored timezone to determine "yesterday" and "today".
 */
export const useStreakUpdater = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!user || hasRun.current) return;
    hasRun.current = true;

    const updateStreaks = async () => {
      try {
        // Get user timezone
        const { data: settings } = await supabase
          .from("user_settings")
          .select("timezone")
          .eq("user_id", user.id)
          .maybeSingle();

        const tz = settings?.timezone || "UTC";

        // Calculate yesterday and today in user's timezone
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("en-CA", {
          timeZone: tz,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        const todayStr = formatter.format(now);
        const yesterday = new Date(now.getTime() - 86_400_000);
        const yesterdayStr = formatter.format(yesterday);

        // Get all habits
        const { data: habits, error: habitsErr } = await supabase
          .from("habits")
          .select("id, streak, updated_at")
          .eq("user_id", user.id);

        if (habitsErr || !habits || habits.length === 0) return;

        // Get yesterday's completions
        const { data: yesterdayCompletions } = await supabase
          .from("habit_completions")
          .select("habit_id")
          .eq("user_id", user.id)
          .eq("completed_date", yesterdayStr);

        const yesterdaySet = new Set(
          (yesterdayCompletions ?? []).map((c) => c.habit_id)
        );

        // Get today's completions (to know if streak was already bumped)
        const { data: todayCompletions } = await supabase
          .from("habit_completions")
          .select("habit_id")
          .eq("user_id", user.id)
          .eq("completed_date", todayStr);

        const todaySet = new Set(
          (todayCompletions ?? []).map((c) => c.habit_id)
        );

        // Check if we already processed today by looking at updated_at
        for (const habit of habits) {
          const updatedDate = formatter.format(new Date(habit.updated_at));
          const alreadyProcessedToday = updatedDate === todayStr;

          if (alreadyProcessedToday) continue; // Already handled

          if (yesterdaySet.has(habit.id)) {
            // Completed yesterday → increment streak
            await supabase
              .from("habits")
              .update({ streak: habit.streak + 1 })
              .eq("id", habit.id);
          } else {
            // Missed yesterday → reset streak
            if (habit.streak > 0) {
              await supabase
                .from("habits")
                .update({ streak: 0 })
                .eq("id", habit.id);
            }
          }
        }

        // Refresh habit data
        queryClient.invalidateQueries({ queryKey: ["habits"] });
      } catch (err) {
        console.error("Streak update failed:", err);
      }
    };

    updateStreaks();
  }, [user, queryClient]);
};
