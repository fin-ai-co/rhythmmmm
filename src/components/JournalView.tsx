import { useState } from "react";

const stones = [
  { size: 48, x: 20, y: 15, opacity: 0.9, color: "hsl(213 94% 78%)" },
  { size: 32, x: 60, y: 25, opacity: 0.6, color: "hsl(213 80% 85%)" },
  { size: 40, x: 40, y: 55, opacity: 0.8, color: "hsl(213 94% 78%)" },
  { size: 24, x: 75, y: 60, opacity: 0.5, color: "hsl(213 70% 90%)" },
  { size: 36, x: 30, y: 80, opacity: 0.7, color: "hsl(213 84% 82%)" },
  { size: 28, x: 65, y: 85, opacity: 0.4, color: "hsl(213 60% 88%)" },
];

const JournalView = () => {
  const [entry, setEntry] = useState("");

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">zen garden</h2>
        <p className="text-xs text-muted-foreground">each stone reflects a day of discipline</p>
      </div>

      {/* Zen Garden */}
      <div className="relative bg-card rounded-lg border border-border h-48 overflow-hidden">
        {stones.map((stone, i) => (
          <div
            key={i}
            className="absolute rounded-full orb-pulse"
            style={{
              width: stone.size,
              height: stone.size,
              left: `${stone.x}%`,
              top: `${stone.y}%`,
              opacity: stone.opacity,
              background: `radial-gradient(circle at 35% 35%, hsl(0 0% 100% / 0.5), ${stone.color})`,
              animationDelay: `${i * 0.7}s`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>

      {/* Journal Entry */}
      <div className="bg-card rounded-lg border border-border p-4">
        <p className="text-xs text-muted-foreground mb-3">today's reflection</p>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="how did today feel..."
          className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 resize-none outline-none min-h-[100px] leading-relaxed"
        />
      </div>
    </div>
  );
};

export default JournalView;
