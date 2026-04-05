import { Home, BarChart3, MessageCircle, Feather, Settings, Link2 } from "lucide-react";

type Tab = "home" | "analytics" | "rituals" | "guide" | "journal" | "settings";

const tabs: { id: Tab; icon: typeof Home; label: string }[] = [
  { id: "home", icon: Home, label: "home" },
  { id: "rituals", icon: Link2, label: "rituals" },
  { id: "analytics", icon: BarChart3, label: "insights" },
  { id: "guide", icon: MessageCircle, label: "guide" },
  { id: "journal", icon: Feather, label: "journal" },
];

const BottomNav = ({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-xl border-t border-border">
      <div className="max-w-md mx-auto flex items-center justify-around py-3 px-4">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all duration-300 ${
              active === id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={active === id ? 2.5 : 1.5} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
