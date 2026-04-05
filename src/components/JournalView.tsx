import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Sparkles, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useHabits } from "@/hooks/useHabits";

const moodOptions = [
  { value: "energized", label: "energized", dot: "bg-amber-400" },
  { value: "focused", label: "focused", dot: "bg-emerald-400" },
  { value: "peaceful", label: "peaceful", dot: "bg-blue-400" },
  { value: "struggling", label: "struggling", dot: "bg-rose-400" },
] as const;

type MoodValue = (typeof moodOptions)[number]["value"];

const moodColor: Record<string, string> = {
  on_fire: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  steady: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  meh: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  rough: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

/**
 * Generates a smart prompt based on today's habit performance.
 */
const getSmartPrompt = (
  completedCount: number,
  totalCount: number,
  habitNames: string[],
  missedNames: string[]
): { prompt: string; subtext: string } => {
  if (totalCount === 0) {
    return {
      prompt: "what's on your mind today?",
      subtext: "start journaling your journey",
    };
  }

  const ratio = completedCount / totalCount;

  if (ratio === 1) {
    return {
      prompt: "you nailed every habit today. what made it click?",
      subtext: "capture what works so you can repeat it",
    };
  }
  if (ratio >= 0.7) {
    return {
      prompt: `strong day — almost everything done. what would make tomorrow a perfect run?`,
      subtext: `missed: ${missedNames.join(", ")}`,
    };
  }
  if (ratio >= 0.4) {
    return {
      prompt: `you showed up for ${completedCount} habits. what got in the way of the rest?`,
      subtext: "no judgment — just patterns",
    };
  }
  if (completedCount > 0) {
    return {
      prompt: `you still got ${habitNames.slice(0, completedCount).join(" & ")} done. what's one thing you'd change about today?`,
      subtext: "progress over perfection",
    };
  }
  return {
    prompt: "tough day — zero habits checked off. what happened?",
    subtext: "writing it down is a habit too",
  };
};

const JournalView = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { habits, completedIds } = useHabits();
  const [isWriting, setIsWriting] = useState(false);
  const [newText, setNewText] = useState("");
  const [selectedMood, setSelectedMood] = useState<MoodValue>("steady");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  // Fetch journal entries from DB
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["journal", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const addEntry = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("journal_entries").insert({
        user_id: user!.id,
        content: newText.trim(),
        mood: selectedMood,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal", user?.id] });
      setNewText("");
      setIsWriting(false);
    },
    onError: (error) => {
      console.error("Journal save error:", error);
      toast({
        title: "couldn't save entry",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteEntry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal", user?.id] });
    },
  });

  // Smart prompt based on today's habits
  const completedHabits = habits.filter((h) => completedIds.has(h.id));
  const missedHabits = habits.filter((h) => !completedIds.has(h.id));
  const smartPrompt = getSmartPrompt(
    completedHabits.length,
    habits.length,
    completedHabits.map((h) => h.name),
    missedHabits.map((h) => h.name)
  );

  // Already journaled today?
  const journaledToday = entries.some(
    (e) => e.created_at.split("T")[0] === today
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor(
      (now.getTime() - date.getTime()) / 86400000
    );
    if (diff === 0) return "today";
    if (diff === 1) return "yesterday";
    return date.toLocaleDateString("en-us", { month: "short", day: "numeric" });
  };

  const getMoodConfig = (mood: string) =>
    moodOptions.find((m) => m.value === mood) ?? moodOptions[1];

  const moodDotMap: Record<string, string> = {
    on_fire: "bg-amber-400",
    steady: "bg-emerald-400",
    meh: "bg-blue-400",
    rough: "bg-rose-400",
  };

  // Mood timeline — last 7 entries
  const moodTimeline = entries.slice(0, 7).reverse();

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">journal</h2>
          <p className="text-xs text-muted-foreground">powered by your habits</p>
        </div>
        {!isWriting && (
          <button
            onClick={() => setIsWriting(true)}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Smart Prompt Card */}
      {!isWriting && !journaledToday && habits.length > 0 && (
        <button
          onClick={() => setIsWriting(true)}
          className="w-full text-left bg-gradient-to-br from-primary/10 via-card to-primary/5 rounded-lg border border-primary/20 p-5 space-y-2 transition-all hover:border-primary/40"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] text-primary font-medium uppercase tracking-wider">
              today's prompt
            </span>
          </div>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {smartPrompt.prompt}
          </p>
          <p className="text-[10px] text-muted-foreground">{smartPrompt.subtext}</p>
        </button>
      )}

      {/* Already journaled badge */}
      {!isWriting && journaledToday && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 flex items-center gap-2">
          <span className="text-sm">✓</span>
          <p className="text-xs text-emerald-400 font-medium">you've journaled today — nice.</p>
        </div>
      )}

      {/* Write Entry */}
      {isWriting && (
        <div className="bg-card rounded-lg border border-border p-4 space-y-4 animate-fade-in">
          {/* Smart prompt hint */}
          {habits.length > 0 && (
            <div className="flex items-start gap-2 bg-primary/5 rounded-lg p-3">
              <Sparkles className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                {smartPrompt.prompt}
              </p>
            </div>
          )}

          {/* Mood selector */}
          <div className="flex gap-2">
            {moodOptions.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all duration-300 border ${
                  selectedMood === mood.value
                    ? moodColor[mood.value]
                    : "border-transparent bg-muted text-muted-foreground"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${mood.dot}`} />
                {mood.label}
              </button>
            ))}
          </div>

          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="write freely..."
            autoFocus
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 resize-none outline-none min-h-[100px] leading-relaxed"
          />

          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsWriting(false);
                setNewText("");
              }}
              className="flex-1 py-2.5 rounded-lg bg-muted text-muted-foreground text-sm font-medium transition-all"
            >
              cancel
            </button>
            <button
              onClick={() => addEntry.mutate()}
              disabled={!newText.trim() || addEntry.isPending}
              className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-30 transition-all duration-300"
            >
              {addEntry.isPending ? "saving..." : "save"}
            </button>
          </div>
        </div>
      )}

      {/* Mood Timeline */}
      {moodTimeline.length > 1 && (
        <div className="bg-card rounded-lg border border-border p-4 space-y-3">
          <p className="text-xs text-muted-foreground font-medium">mood flow</p>
          <div className="flex items-end justify-between gap-1 h-12">
            {moodTimeline.map((entry, i) => {
              const config = getMoodConfig(entry.mood);
              const heights: Record<string, string> = {
                on_fire: "h-12",
                steady: "h-9",
                meh: "h-6",
                rough: "h-3",
              };
              return (
                <div key={entry.id} className="flex-1 flex flex-col items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${moodDotMap[entry.mood] ?? "bg-muted"}`} />
                  <div
                    className={`w-full rounded-t-sm ${heights[entry.mood] ?? "h-6"} transition-all duration-500`}
                    style={{
                      background: `hsl(var(--primary) / ${0.15 + i * 0.1})`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Entries */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">no entries yet. tap + to start.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground font-medium">entries</p>
          {entries.map((entry) => {
            const config = getMoodConfig(entry.mood);
            const isExpanded = expandedId === entry.id;
            return (
              <div
                key={entry.id}
                className="group relative bg-card rounded-lg border border-border transition-all duration-300 hover:border-primary/30"
              >
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : entry.id)
                  }
                  className="w-full text-left p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${moodDotMap[entry.mood] ?? "bg-muted"}`} />
                      <span className="text-xs text-muted-foreground">
                        {formatDate(entry.created_at)}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  {isExpanded ? (
                    <p className="text-sm text-foreground leading-relaxed animate-fade-in">
                      {entry.content}
                    </p>
                  ) : (
                    <p className="text-sm text-foreground/70 truncate">
                      {entry.content}
                    </p>
                  )}
                </button>
                {/* Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEntry.mutate(entry.id);
                  }}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JournalView;
