const days = ["s", "m", "t", "w", "t", "f", "s"];

interface HabitAnalytics {
  name: string;
  friction: "low" | "medium" | "heavy";
  frictionScore: number;
  weekData: boolean[];
}

const sampleData: HabitAnalytics[] = [
  { name: "meditate", friction: "low", frictionScore: 20, weekData: [true, true, false, true, true, true, false] },
  { name: "exercise", friction: "heavy", frictionScore: 75, weekData: [false, true, false, false, true, false, false] },
  { name: "read 20 pages", friction: "medium", frictionScore: 45, weekData: [true, true, true, true, false, true, true] },
  { name: "no coffee", friction: "heavy", frictionScore: 85, weekData: [true, false, false, true, false, false, true] },
  { name: "journal", friction: "low", frictionScore: 15, weekData: [true, true, true, true, true, true, false] },
];

const AnalyticsView = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">insights</h2>
        <p className="text-xs text-muted-foreground">this week's completion grid</p>
      </div>

      {/* Completion Grid */}
      <div className="bg-card rounded-lg p-5 border border-border space-y-4">
        {/* Day headers */}
        <div className="grid grid-cols-[1fr_repeat(7,1.5rem)] gap-2 items-center">
          <div />
          {days.map((d, i) => (
            <span key={i} className="text-[10px] text-muted-foreground text-center font-medium">
              {d}
            </span>
          ))}
        </div>

        {sampleData.map((habit) => (
          <div key={habit.name} className="grid grid-cols-[1fr_repeat(7,1.5rem)] gap-2 items-center">
            <span className="text-xs text-foreground truncate">{habit.name}</span>
            {habit.weekData.map((done, i) => (
              <div key={i} className="flex items-center justify-center">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    done ? "bg-primary" : "bg-muted"
                  }`}
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Friction Scores */}
      <div className="bg-card rounded-lg p-5 border border-border space-y-4">
        <p className="text-xs text-muted-foreground font-medium">friction scores</p>
        {sampleData.map((habit) => (
          <div key={habit.name} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground">{habit.name}</span>
              <span className="text-[10px] text-muted-foreground">{habit.friction}</span>
            </div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/60 rounded-full transition-all duration-500"
                style={{ width: `${habit.frictionScore}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsView;
