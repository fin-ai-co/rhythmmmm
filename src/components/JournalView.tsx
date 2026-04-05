import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";

interface JournalEntry {
  id: string;
  date: Date;
  text: string;
  mood: "peaceful" | "focused" | "struggling" | "energized";
}

const moodEmoji: Record<string, string> = {
  peaceful: "🪷",
  focused: "🎯",
  struggling: "🌊",
  energized: "⚡",
};

const moodColors: Record<string, string> = {
  peaceful: "bg-primary/20 text-primary",
  focused: "bg-accent/20 text-accent",
  struggling: "bg-destructive/20 text-destructive",
  energized: "bg-streak/20 text-streak",
};

const initialEntries: JournalEntry[] = [
  {
    id: "1",
    date: new Date(Date.now() - 86400000),
    text: "managed to meditate even when i didn't feel like it. the resistance was the teacher today.",
    mood: "focused",
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000 * 3),
    text: "broke my no-coffee streak. not mad — just noticing the pattern. stress triggers it every time.",
    mood: "struggling",
  },
  {
    id: "3",
    date: new Date(Date.now() - 86400000 * 5),
    text: "everything clicked today. all five habits done before noon. this is what momentum feels like.",
    mood: "energized",
  },
];

const stones = [
  { size: 48, x: 20, y: 15, opacity: 0.9, color: "hsl(213 94% 78%)" },
  { size: 32, x: 60, y: 25, opacity: 0.6, color: "hsl(213 80% 85%)" },
  { size: 40, x: 40, y: 55, opacity: 0.8, color: "hsl(213 94% 78%)" },
  { size: 24, x: 75, y: 60, opacity: 0.5, color: "hsl(213 70% 90%)" },
  { size: 36, x: 30, y: 80, opacity: 0.7, color: "hsl(213 84% 82%)" },
  { size: 28, x: 65, y: 85, opacity: 0.4, color: "hsl(213 60% 88%)" },
];

const JournalView = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [isWriting, setIsWriting] = useState(false);
  const [newText, setNewText] = useState("");
  const [selectedMood, setSelectedMood] = useState<JournalEntry["mood"]>("peaceful");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const saveEntry = () => {
    if (!newText.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date(),
      text: newText.trim(),
      mood: selectedMood,
    };
    setEntries((prev) => [entry, ...prev]);
    setNewText("");
    setIsWriting(false);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
    if (diff === 0) return "today";
    if (diff === 1) return "yesterday";
    return date.toLocaleDateString("en-us", { month: "short", day: "numeric" });
  };

  const formatFullDate = (date: Date) =>
    date.toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">zen garden</h2>
          <p className="text-xs text-muted-foreground">each stone reflects a day of discipline</p>
        </div>
        <button
          onClick={() => setIsWriting(!isWriting)}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90"
        >
          <Plus className={`w-4 h-4 transition-transform duration-300 ${isWriting ? "rotate-45" : ""}`} />
        </button>
      </div>

      {/* Zen Garden */}
      <div className="relative bg-card rounded-lg border border-border h-36 overflow-hidden">
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
              background: `radial-gradient(circle at 35% 35%, hsl(0 0% 100% / 0.15), ${stone.color})`,
              animationDelay: `${i * 0.7}s`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
        {/* Add stones for each entry */}
        {entries.slice(0, 4).map((entry, i) => (
          <div
            key={entry.id}
            className="absolute text-lg orb-pulse"
            style={{
              left: `${15 + i * 22}%`,
              top: `${45 + (i % 2) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              filter: "drop-shadow(0 0 8px hsl(213 94% 78% / 0.4))",
            }}
          >
            {moodEmoji[entry.mood]}
          </div>
        ))}
      </div>

      {/* New Entry Form */}
      {isWriting && (
        <div className="bg-card rounded-lg border border-border p-4 space-y-3 animate-fade-in">
          <p className="text-xs text-muted-foreground font-medium">new reflection</p>

          {/* Mood selector */}
          <div className="flex gap-2">
            {(Object.keys(moodEmoji) as JournalEntry["mood"][]).map((mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-300 ${
                  selectedMood === mood ? moodColors[mood] : "bg-muted text-muted-foreground"
                }`}
              >
                <span>{moodEmoji[mood]}</span>
                {mood}
              </button>
            ))}
          </div>

          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="how did today feel..."
            autoFocus
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 resize-none outline-none min-h-[80px] leading-relaxed"
          />
          <button
            onClick={saveEntry}
            disabled={!newText.trim()}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-30 transition-all duration-300"
          >
            save reflection
          </button>
        </div>
      )}

      {/* Past Entries */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground font-medium">past reflections</p>
        {entries.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
            className="w-full text-left bg-card rounded-lg border border-border p-4 transition-all duration-300 hover:border-primary/30"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span>{moodEmoji[entry.mood]}</span>
                <span className="text-xs text-muted-foreground">{formatDate(entry.date)}</span>
              </div>
              {expandedId === entry.id ? (
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>
            {expandedId === entry.id ? (
              <div className="animate-fade-in">
                <p className="text-[10px] text-muted-foreground mb-2">{formatFullDate(entry.date)}</p>
                <p className="text-sm text-foreground leading-relaxed">{entry.text}</p>
              </div>
            ) : (
              <p className="text-sm text-foreground/70 truncate">{entry.text}</p>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default JournalView;
