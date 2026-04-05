import { useState, useRef, useCallback } from "react";
import { Flame } from "lucide-react";

interface HabitRowProps {
  name: string;
  streak: number;
  friction: "low" | "medium" | "heavy";
  completed: boolean;
  onComplete: () => void;
}

const frictionColors: Record<string, string> = {
  low: "bg-primary/20",
  medium: "bg-primary/40",
  heavy: "bg-primary/60",
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
      className={`relative overflow-hidden rounded-lg p-4 select-none cursor-pointer transition-all duration-300 border border-transparent hover:border-primary/20 hover:bg-card/80 hover:shadow-[0_0_16px_hsl(213_94%_78%/0.06)] ${
        completed ? "bg-primary/10" : "bg-card"
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
          className="absolute inset-0 bg-primary/15 origin-center rounded-lg"
          style={{
            transform: `scaleX(${fillProgress})`,
            transition: "transform 16ms linear",
          }}
        />
      )}

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              completed ? "bg-primary scale-150" : "bg-muted-foreground/30"
            }`}
          />
          <span
            className={`text-sm font-medium transition-all duration-300 ${
              completed ? "text-primary line-through opacity-60" : "text-foreground"
            }`}
          >
            {name}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full ${frictionColors[friction]} text-primary-foreground/70`}>
            {friction}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {streak > 0 && (
            <>
              <Flame className="w-3.5 h-3.5 text-streak" />
              <span className="text-xs font-medium text-streak">{streak}</span>
            </>
          )}
        </div>
      </div>

      {!completed && (
        <p className="text-[10px] text-muted-foreground mt-1 ml-5 opacity-50">
          hold to complete
        </p>
      )}
    </div>
  );
};

export default HabitRow;
