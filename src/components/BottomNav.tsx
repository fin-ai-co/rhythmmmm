import { Home, BarChart3, MessageCircle, Feather, Link2 } from "lucide-react";

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass bg-card/70 border-t border-border/50 safe-bottom">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-2">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-2xl transition-all duration-300 touch-active ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 rounded-2xl" />
              )}
              <Icon className="w-5 h-5 relative z-10 transition-transform duration-300" strokeWidth={isActive ? 2.5 : 1.5} />
              <span className={`text-[10px] relative z-10 transition-all duration-300 ${isActive ? "font-semibold" : "font-medium"}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
