import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/hooks/useHabits";

const days = ["s", "m", "t", "w", "t", "f", "s"];

const AnalyticsView = () => {
  const { user } = useAuth();
  const { habits, isLoading: habitsLoading } = useHabits();

  // Get the last 7 days as YYYY-MM-DD strings
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });

  // Day labels for the last 7 days
  const dayLabels = last7Days.map((dateStr) => {
    const d = new Date(dateStr + "T12:00:00");
    return days[d.getDay()];
  });

  // Fetch completions for the last 7 days
  const { data: completions, isLoading: completionsLoading } = useQuery({
    queryKey: ["analytics-completions", user?.id, last7Days[0]],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("habit_completions")
        .select("habit_id, completed_date")
        .eq("user_id", user!.id)
        .gte("completed_date", last7Days[0])
        .lte("completed_date", last7Days[6]);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const isLoading = habitsLoading || completionsLoading;

  // Build a set for quick lookup: "habitId:date"
  const completionSet = new Set(
    (completions ?? []).map((c) => `${c.habit_id}:${c.completed_date}`)
  );

  // Calculate completion rate per habit
  const habitStats = habits.map((habit) => {
    const completed = last7Days.filter(
      (d) => completionSet.has(`${habit.id}:${d}`)
    ).length;
    const rate = last7Days.length > 0 ? Math.round((completed / last7Days.length) * 100) : 0;
    return { ...habit, rate };
  });

  // Overall stats
  const totalPossible = habits.length * 7;
  const totalCompleted = habits.reduce(
    (sum, h) => sum + last7Days.filter((d) => completionSet.has(`${h.id}:${d}`)).length,
    0
  );
  const overallRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  if (isLoading) {
    return (
      <div className="animate-fade-in flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (habits.length === 0) {
    return (
      <div className="animate-fade-in space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">insights</h2>
          <p className="text-xs text-muted-foreground">add some habits first to see your data here</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-12 text-center">
          <p className="text-3xl mb-3">📊</p>
          <p className="text-sm text-muted-foreground">no habits tracked yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">insights</h2>
        <p className="text-xs text-muted-foreground">last 7 days</p>
      </div>

      {/* Overall Rate */}
      <div className="bg-card rounded-lg border border-border p-5 flex items-center gap-4">
        <div className="relative w-14 h-14">
          <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              className="stroke-muted"
              strokeWidth="3"
            />
            <circle
              cx="18" cy="18" r="15"
              fill="none"
              className="stroke-primary"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${overallRate * 0.9425} 94.25`}
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
            {overallRate}%
          </span>
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">overall completion</p>
          <p className="text-xs text-muted-foreground">
            {totalCompleted}/{totalPossible} check-ins this week
          </p>
        </div>
      </div>

      {/* Completion Grid */}
      <div className="bg-card rounded-lg p-5 border border-border space-y-4">
        <p className="text-xs text-muted-foreground font-medium">completion grid</p>

        {/* Day headers */}
        <div className="grid grid-cols-[1fr_repeat(7,1.5rem)] gap-2 items-center">
          <div />
          {dayLabels.map((d, i) => (
            <span key={i} className="text-[10px] text-muted-foreground text-center font-medium">
              {d}
            </span>
          ))}
        </div>

        {habits.map((habit) => (
          <div key={habit.id} className="grid grid-cols-[1fr_repeat(7,1.5rem)] gap-2 items-center">
            <span className="text-xs text-foreground truncate">{habit.name}</span>
            {last7Days.map((date, i) => {
              const done = completionSet.has(`${habit.id}:${date}`);
              const isToday = date === last7Days[6];
              return (
                <div key={i} className="flex items-center justify-center">
                  <div
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      done
                        ? "bg-primary"
                        : isToday
                        ? "bg-muted ring-1 ring-primary/30"
                        : "bg-muted"
                    }`}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Per-habit completion rates */}
      <div className="bg-card rounded-lg p-5 border border-border space-y-4">
        <p className="text-xs text-muted-foreground font-medium">habit strength</p>
        {habitStats.map((habit) => (
          <div key={habit.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground">{habit.name}</span>
              <span className="text-[10px] text-muted-foreground">{habit.rate}%</span>
            </div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  habit.rate >= 70
                    ? "bg-emerald-500"
                    : habit.rate >= 40
                    ? "bg-amber-500"
                    : "bg-destructive/60"
                }`}
                style={{ width: `${habit.rate}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Best streak */}
      {habits.some((h) => h.streak > 0) && (
        <div className="bg-card rounded-lg p-5 border border-border space-y-3">
          <p className="text-xs text-muted-foreground font-medium">current streaks</p>
          <div className="flex flex-wrap gap-2">
            {habits
              .filter((h) => h.streak > 0)
              .sort((a, b) => b.streak - a.streak)
              .map((h) => (
                <div
                  key={h.id}
                  className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-lg px-3 py-1.5"
                >
                  <span className="text-xs">🔥</span>
                  <span className="text-xs font-medium">{h.name}</span>
                  <span className="text-[10px] opacity-70">{h.streak}d</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsView;
