const GoalCard = ({ title, progress }: { title: string; progress: number }) => {
  return (
    <div className="bg-card rounded-lg p-4 border border-border transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-[0_0_20px_hsl(213_94%_78%/0.12)]">
      <p className="text-xs text-muted-foreground mb-2">long-run goal</p>
      <p className="text-sm font-medium text-foreground mb-3">{title}</p>
      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-1.5">{progress}% complete</p>
    </div>
  );
};

export default GoalCard;
