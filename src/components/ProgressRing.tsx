const ProgressRing = ({ progress }: { progress: number }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - progress * circumference;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-18 h-18" style={{ width: 72, height: 72 }}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="5"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="progress-ring-animate"
            style={{
              transition: "stroke-dashoffset 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
              filter: progress > 0 ? "drop-shadow(0 0 4px hsl(213 94% 78% / 0.4))" : "none",
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-base font-bold text-foreground tabular-nums">
            {Math.round(progress * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressRing;
