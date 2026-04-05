import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";

interface JournalEntry {
  id: string;
  date: Date;
  text: string;
  mood: "peaceful" | "focused" | "struggling" | "energized";
}

const moodConfig: Record<string, { icon: string; label: string; gradient: string; glow: string }> = {
  peaceful: {
    icon: "☽",
    label: "peaceful",
    gradient: "from-blue-400/20 to-indigo-500/20",
    glow: "shadow-[0_0_12px_hsl(213_94%_78%/0.3)]",
  },
  focused: {
    icon: "◎",
    label: "focused",
    gradient: "from-amber-400/20 to-orange-500/20",
    glow: "shadow-[0_0_12px_hsl(38_90%_60%/0.3)]",
  },
  struggling: {
    icon: "∿",
    label: "struggling",
    gradient: "from-rose-400/20 to-red-500/20",
    glow: "shadow-[0_0_12px_hsl(0_84%_60%/0.3)]",
  },
  energized: {
    icon: "✦",
    label: "energized",
    gradient: "from-emerald-400/20 to-teal-500/20",
    glow: "shadow-[0_0_12px_hsl(160_70%_50%/0.3)]",
  },
};

const moodColors: Record<string, string> = {
  peaceful: "bg-primary/20 text-primary",
  focused: "bg-amber-500/20 text-amber-400",
  struggling: "bg-destructive/20 text-destructive",
  energized: "bg-emerald-500/20 text-emerald-400",
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
          <h2 className="text-lg font-semibold text-foreground mb-1">journal</h2>
          <p className="text-xs text-muted-foreground">reflect on your rhythm</p>
        </div>
        <button
          onClick={() => setIsWriting(!isWriting)}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground transition-all duration-300 hover:bg-primary/90"
        >
          <Plus className={`w-4 h-4 transition-transform duration-300 ${isWriting ? "rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mood landscape — ambient visualization */}
      <div className="relative bg-card rounded-lg border border-border h-32 overflow-hidden">
        {/* Background grain */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />

        {/* Ambient ripples based on entries */}
        {entries.slice(0, 5).map((entry, i) => {
          const config = moodConfig[entry.mood];
          const x = 12 + i * 20;
          const y = 30 + (i % 3) * 20;
          return (
            <div
              key={entry.id}
              className="absolute flex items-center justify-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              {/* Outer glow ring */}
              <div
                className={`absolute w-14 h-14 rounded-full bg-gradient-to-br ${config.gradient} orb-pulse`}
                style={{ animationDelay: `${i * 0.8}s` }}
              />
              {/* Inner symbol */}
              <span
                className="relative text-xl font-light text-foreground/70 orb-pulse"
                style={{
                  animationDelay: `${i * 0.8 + 0.2}s`,
                  textShadow: "0 0 12px hsl(213 94% 78% / 0.4)",
                }}
              >
                {config.icon}
              </span>
            </div>
          );
        })}

        {/* No entries state */}
        {entries.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-xs text-muted-foreground/50">your reflections appear here</p>
          </div>
        )}
      </div>

      {/* New Entry Form */}
      {isWriting && (
        <div className="bg-card rounded-lg border border-border p-4 space-y-3 animate-fade-in">
          <p className="text-xs text-muted-foreground font-medium">new reflection</p>

          {/* Mood selector */}
          <div className="flex gap-2">
            {(Object.keys(moodConfig) as JournalEntry["mood"][]).map((mood) => {
              const config = moodConfig[mood];
              return (
                <button
                  key={mood}
                  onClick={() => setSelectedMood(mood)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all duration-300 ${
                    selectedMood === mood ? moodColors[mood] : "bg-muted text-muted-foreground"
                  }`}
                >
                  <span className="text-sm">{config.icon}</span>
                  {config.label}
                </button>
              );
            })}
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
        {entries.map((entry) => {
          const config = moodConfig[entry.mood];
          return (
            <button
              key={entry.id}
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              className="w-full text-left bg-card rounded-lg border border-border p-4 transition-all duration-300 hover:border-primary/30"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${moodColors[entry.mood]} ${config.glow}`}>
                    {config.icon}
                  </span>
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
          );
        })}
      </div>
    </div>
  );
};

export default JournalView;
