const GoalCard = ({ title, progress }: { title: string; progress: number }) => {
  return (
    <div className="bg-card rounded-2xl p-4 border border-border/50 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_24px_hsl(213_94%_78%/0.08)]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground font-medium">daily goal</p>
        <span className="text-xs font-semibold text-primary">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm font-medium text-foreground mt-2.5">{title}</p>
    </div>
  );
};

export default GoalCard;
