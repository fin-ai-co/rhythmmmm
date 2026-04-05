import { Sparkles } from "lucide-react";

const insights = [
  {
    time: "this morning",
    text: "your exercise habit has high friction. consider starting with a 10-minute walk instead of a full workout.",
  },
  {
    time: "yesterday",
    text: "you completed 5 out of 5 habits. your momentum is building — keep the streak alive.",
  },
  {
    time: "3 days ago",
    text: "no-coffee has been inconsistent. try replacing it with herbal tea to reduce friction.",
  },
  {
    time: "weekly",
    text: "your best performing habit is journaling at 86% completion. anchor other habits around it.",
  },
];

const GuideView = () => {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">the guide</h2>
      </div>
      <p className="text-xs text-muted-foreground">
        proactive advice based on your friction patterns
      </p>

      <div className="space-y-1">
        {insights.map((item, i) => (
          <div
            key={i}
            className="py-4 border-b border-border last:border-0 transition-all duration-300"
          >
            <p className="text-[10px] text-muted-foreground mb-1.5">{item.time}</p>
            <p className="text-sm text-foreground leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideView;
