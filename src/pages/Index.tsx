import { useState, useCallback } from "react";
import FocusOrb from "@/components/FocusOrb";
import ProgressRing from "@/components/ProgressRing";
import HabitRow from "@/components/HabitRow";
import GoalCard from "@/components/GoalCard";
import BottomNav from "@/components/BottomNav";
import AnalyticsView from "@/components/AnalyticsView";
import GuideView from "@/components/GuideView";
import JournalView from "@/components/JournalView";
import SettingsView from "@/components/SettingsView";

type Tab = "home" | "analytics" | "guide" | "journal" | "settings";

interface Habit {
  id: string;
  name: string;
  streak: number;
  friction: "low" | "medium" | "heavy";
  completed: boolean;
}

const initialHabits: Habit[] = [
  { id: "1", name: "meditate 10 min", streak: 12, friction: "low", completed: false },
  { id: "2", name: "exercise", streak: 5, friction: "heavy", completed: false },
  { id: "3", name: "read 20 pages", streak: 8, friction: "medium", completed: false },
  { id: "4", name: "no coffee", streak: 26, friction: "heavy", completed: false },
  { id: "5", name: "journal", streak: 15, friction: "low", completed: false },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [habits, setHabits] = useState<Habit[]>(initialHabits);

  const completedCount = habits.filter((h) => h.completed).length;
  const progress = habits.length > 0 ? completedCount / habits.length : 0;

  const completeHabit = useCallback((id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, completed: true } : h))
    );
  }, []);

  const today = new Date().toLocaleDateString("en-us", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 pt-12 pb-28">
        {/* Header */}
        <div className="mb-2 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">discipline.</h1>
          <p className="text-xs text-muted-foreground mt-1">{today}</p>
        </div>

        {activeTab === "home" && (
          <div className="animate-fade-in space-y-5">
            <div className="flex items-center justify-between">
              <FocusOrb progress={progress} />
              <ProgressRing progress={progress} />
            </div>
            <GoalCard title="86% through no-coffee month" progress={86} />
            <div>
              <p className="text-xs text-muted-foreground mb-3 font-medium">today's habits</p>
              <div className="space-y-2">
                {habits.map((habit) => (
                  <HabitRow
                    key={habit.id}
                    name={habit.name}
                    streak={habit.streak}
                    friction={habit.friction}
                    completed={habit.completed}
                    onComplete={() => completeHabit(habit.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "analytics" && <AnalyticsView />}
        {activeTab === "guide" && <GuideView />}
        {activeTab === "journal" && <JournalView />}
        {activeTab === "settings" && <SettingsView />}
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
};

export default Index;
