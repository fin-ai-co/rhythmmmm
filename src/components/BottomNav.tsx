import { Home, BarChart3, MessageCircle, Feather } from "lucide-react";

type Tab = "home" | "analytics" | "guide" | "journal";

const tabs: { id: Tab; icon: typeof Home; label: string }[] = [
  { id: "home", icon: Home, label: "home" },
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
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              active === id ? "text-primary" : "text-muted-foreground"
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
