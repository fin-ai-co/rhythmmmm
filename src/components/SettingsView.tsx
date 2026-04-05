import { useState } from "react";
import { User, Bell, Moon, Shield, HelpCircle, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const SettingsView = () => {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [holdDuration, setHoldDuration] = useState("600");

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">settings</h2>
        <p className="text-xs text-muted-foreground">customize your experience</p>
      </div>

      {/* Profile */}
      <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{user?.email ?? "anonymous"}</p>
          <p className="text-xs text-muted-foreground">free plan</p>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-card rounded-lg border border-border divide-y divide-border">
        <SettingToggle
          icon={Bell}
          label="daily reminders"
          description="get notified to complete habits"
          checked={notifications}
          onChange={setNotifications}
        />
        <SettingToggle
          icon={Moon}
          label="haptic feedback"
          description="vibrate on hold-to-complete"
          checked={haptics}
          onChange={setHaptics}
        />
      </div>

      {/* Hold Duration */}
      <div className="bg-card rounded-lg border border-border p-4 space-y-3">
        <p className="text-xs text-muted-foreground font-medium">hold duration</p>
        <div className="flex gap-2">
          {[
            { value: "400", label: "quick" },
            { value: "600", label: "normal" },
            { value: "1000", label: "deliberate" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setHoldDuration(opt.value)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-300 ${
                holdDuration === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Links */}
      <div className="bg-card rounded-lg border border-border divide-y divide-border">
        <SettingLink icon={Shield} label="privacy policy" />
        <SettingLink icon={HelpCircle} label="help & support" />
        <SettingLink icon={LogOut} label="sign out" destructive />
      </div>

      <p className="text-[10px] text-muted-foreground text-center pt-2">
        discipline. v1.0.0
      </p>
    </div>
  );
};

const SettingToggle = ({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: typeof Bell;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center justify-between p-4">
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-muted-foreground" />
      <div>
        <p className="text-sm text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{description}</p>
      </div>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full transition-all duration-300 relative ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-background shadow transition-transform duration-300 ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

const SettingLink = ({
  icon: Icon,
  label,
  destructive,
}: {
  icon: typeof Shield;
  label: string;
  destructive?: boolean;
}) => (
  <button className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50">
    <Icon className={`w-4 h-4 ${destructive ? "text-destructive" : "text-muted-foreground"}`} />
    <span className={`text-sm ${destructive ? "text-destructive" : "text-foreground"}`}>
      {label}
    </span>
  </button>
);

export default SettingsView;
