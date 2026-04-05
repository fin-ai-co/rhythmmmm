import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Plus, Trash2 } from "lucide-react";
import ShareStreak from "@/components/ShareStreak";
import FocusOrb from "@/components/FocusOrb";
import ProgressRing from "@/components/ProgressRing";
import HabitRow from "@/components/HabitRow";
import GoalCard from "@/components/GoalCard";
import BottomNav from "@/components/BottomNav";
import AnalyticsView from "@/components/AnalyticsView";
import GuideView from "@/components/GuideView";
import JournalView from "@/components/JournalView";
import SettingsView from "@/components/SettingsView";
import RitualsView from "@/components/RitualsView";
import OnboardingView from "@/components/OnboardingView";
import AddHabitDialog from "@/components/AddHabitDialog";
import { useHabits } from "@/hooks/useHabits";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import PremiumGate from "@/components/PremiumGate";

type Tab = "home" | "analytics" | "rituals" | "guide" | "journal" | "settings";

const Index = () => {
  const { user } = useAuth();
  const { habits, completedIds, isLoading, completeHabit, addHabit, deleteHabit } = useHabits();
  const { isPremium, canAddHabit, FREE_HABIT_LIMIT } = useSubscription();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showAddHabit, setShowAddHabit] = useState(false);

  // Detect first-time user (no habits yet, just signed up)
  useEffect(() => {
    if (!isLoading && habits.length === 0 && user) {
      // Check if user was created recently (within last 60 seconds)
      const createdAt = new Date(user.created_at).getTime();
      const now = Date.now();
      if (now - createdAt < 60_000) {
        setShowOnboarding(true);
      }
    }
  }, [isLoading, habits.length, user]);

  const completedCount = habits.filter((h) => completedIds.has(h.id)).length;
  const progress = habits.length > 0 ? completedCount / habits.length : 0;

  const today = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (showOnboarding) {
    return <OnboardingView onComplete={() => setShowOnboarding(false)} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 pt-12 pb-28">
        {/* Header */}
        <div className="mb-2 animate-fade-in flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">discipline.</h1>
            <p className="text-xs text-muted-foreground mt-1">{today}</p>
          </div>
          <button
            onClick={() => setActiveTab("settings")}
            className={`p-2 rounded-lg transition-all duration-300 ${
              activeTab === "settings" ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>

        {activeTab === "home" && (
          <div className="animate-fade-in space-y-5">
            <div className="flex items-center justify-between">
              <FocusOrb progress={progress} />
              <ProgressRing progress={progress} />
            </div>

            {habits.length > 0 && (
              <>
                <GoalCard
                  title={`${completedCount}/${habits.length} habits done today`}
                  progress={Math.round(progress * 100)}
                />
                <div className="flex justify-end">
                  <ShareStreak habits={habits} completedCount={completedCount} />
                </div>
              </>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground font-medium">today's habits</p>
                <div className="flex items-center gap-2">
                  {!isPremium && (
                    <span className="text-[10px] text-muted-foreground">
                      {habits.length}/{FREE_HABIT_LIMIT} free
                    </span>
                  )}
                  <button
                    onClick={() => {
                      if (!canAddHabit(habits.length)) {
                        toast({ title: "upgrade required", description: `free plan allows ${FREE_HABIT_LIMIT} habits. upgrade to premium for unlimited.`, variant: "destructive" });
                        return;
                      }
                      setShowAddHabit(true);
                    }}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {habits.length === 0 ? (
                <button
                  onClick={() => setShowAddHabit(true)}
                  className="w-full bg-card border border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors"
                >
                  <Plus className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">add your first habit</p>
                </button>
              ) : (
                <div className="space-y-2">
                  {habits.map((habit) => (
                    <div key={habit.id} className="group relative">
                      <HabitRow
                        name={habit.name}
                        streak={habit.streak}
                        friction={habit.friction}
                        completed={completedIds.has(habit.id)}
                        onComplete={() => completeHabit(habit.id)}
                      />
                      <button
                        onClick={() => deleteHabit(habit.id)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "analytics" && <AnalyticsView />}
        {activeTab === "rituals" && <RitualsView />}
        {activeTab === "guide" && (isPremium ? <GuideView /> : <PremiumGate feature="ai guide" />)}
        {activeTab === "journal" && <JournalView />}
        {activeTab === "settings" && <SettingsView />}
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} />
      <AddHabitDialog
        open={showAddHabit}
        onClose={() => setShowAddHabit(false)}
        onAdd={async (name, friction) => {
          await addHabit({ name, friction });
        }}
      />
    </div>
  );
};

export default Index;
