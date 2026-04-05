import { useState, useRef, useCallback } from "react";
import { Flame, Check } from "lucide-react";

interface HabitRowProps {
  name: string;
  streak: number;
  friction: "low" | "medium" | "heavy";
  completed: boolean;
  onComplete: () => void;
}

const frictionColors: Record<string, string> = {
  low: "bg-primary/15 text-primary/70",
  medium: "bg-primary/25 text-primary/80",
  heavy: "bg-primary/35 text-primary/90",
};

const HabitRow = ({ name, streak, friction, completed, onComplete }: HabitRowProps) => {
  const [holding, setHolding] = useState(false);
  const [fillProgress, setFillProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  const startHold = useCallback(() => {
    if (completed) return;
    setHolding(true);
    setFillProgress(0);

    const startTime = Date.now();
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / 600, 1);
      setFillProgress(progress);
    }, 16);

    timerRef.current = window.setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setFillProgress(1);
      setHolding(false);
      onComplete();
    }, 600);
  }, [completed, onComplete]);

  const endHold = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setHolding(false);
    if (!completed) setFillProgress(0);
  }, [completed]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-4 select-none cursor-pointer transition-all duration-300 ${
        completed
          ? "bg-primary/8 border border-primary/20"
          : "bg-card border border-border/50 hover:border-primary/30 hover:shadow-[0_0_20px_hsl(213_94%_78%/0.08)]"
      }`}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
    >
      {/* Ripple fill */}
      {holding && !completed && (
        <div
          className="absolute inset-0 bg-primary/12 origin-left rounded-2xl"
          style={{
            transform: `scaleX(${fillProgress})`,
            transition: "transform 16ms linear",
          }}
        />
      )}

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-500 ${
              completed
                ? "bg-primary scale-100"
                : "border-2 border-muted-foreground/25"
            }`}
          >
            {completed && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
          </div>
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium transition-all duration-300 ${
                completed ? "text-primary/60 line-through" : "text-foreground"
              }`}
            >
              {name}
            </span>
            {!completed && (
              <span className="text-[10px] text-muted-foreground/50 mt-0.5">
                hold to complete
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${frictionColors[friction]}`}>
            {friction}
          </span>
          {streak > 0 && (
            <div className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-streak" />
              <span className="text-xs font-semibold text-streak">{streak}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitRow;
