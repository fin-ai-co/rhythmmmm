import { useState } from "react";
import {
  User,
  Bell,
  Clock,
  Vibrate,
  RotateCcw,
  Crown,
  Shield,
  HelpCircle,
  LogOut,
  Trash2,
  Download,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useHabits } from "@/hooks/useHabits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SettingsView = () => {
  const { user, signOut } = useAuth();
  const { isPremium, status, FREE_HABIT_LIMIT } = useSubscription();
  const { habits } = useHabits();
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [holdDuration, setHoldDuration] = useState("600");
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleResetStreaks = async () => {
    if (!resetConfirm) {
      setResetConfirm(true);
      return;
    }
    try {
      const { error } = await supabase
        .from("habits")
        .update({ streak: 0 })
        .eq("user_id", user!.id);
      if (error) throw error;
      toast({ title: "done", description: "all streaks reset to zero" });
      setResetConfirm(false);
    } catch {
      toast({ title: "error", description: "couldn't reset streaks", variant: "destructive" });
    }
  };

  const handleExportData = async () => {
    try {
      const [habitsRes, completionsRes, journalRes] = await Promise.all([
        supabase.from("habits").select("*"),
        supabase.from("habit_completions").select("*"),
        supabase.from("journal_entries").select("*"),
      ]);

      const exportData = {
        exported_at: new Date().toISOString(),
        habits: habitsRes.data ?? [],
        completions: completionsRes.data ?? [],
        journal: journalRes.data ?? [],
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `rhythm-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "exported", description: "your data has been downloaded" });
    } catch {
      toast({ title: "error", description: "couldn't export data", variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    toast({
      title: "contact support",
      description: "email support to delete your account and all data",
    });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">settings</h2>
        <p className="text-xs text-muted-foreground">customize your experience</p>
      </div>

      {/* Profile + Plan */}
      <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{user?.email ?? "anonymous"}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {isPremium ? (
              <>
                <Crown className="w-3 h-3 text-amber-400" />
                <span className="text-xs text-amber-400 font-medium">premium</span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">
                free plan · {habits.length}/{FREE_HABIT_LIMIT} habits
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade banner for free users */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border border-primary/20 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-primary" />
            <p className="text-sm font-medium text-foreground">upgrade to premium</p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            unlimited habits, ai guide, and more. available as an in-app purchase.
          </p>
        </div>
      )}

      {/* Notifications & Haptics */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-medium px-1 mb-2">notifications</p>
        <div className="bg-card rounded-lg border border-border divide-y divide-border">
          <SettingToggle
            icon={Bell}
            label="daily reminders"
            description="push notification to complete habits"
            checked={notifications}
            onChange={setNotifications}
          />
          <SettingToggle
            icon={Vibrate}
            label="haptic feedback"
            description="vibrate on hold-to-complete"
            checked={haptics}
            onChange={setHaptics}
          />
        </div>
      </div>

      {/* Hold Duration */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-medium px-1 mb-2">hold to complete</p>
        <div className="bg-card rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">how long to hold before marking done</p>
          </div>
          <div className="flex gap-2">
            {[
              { value: "400", label: "quick", sub: "0.4s" },
              { value: "600", label: "normal", sub: "0.6s" },
              { value: "1000", label: "deliberate", sub: "1s" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setHoldDuration(opt.value)}
                className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all duration-300 ${
                  holdDuration === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <span className="text-xs font-medium block">{opt.label}</span>
                <span className="text-[10px] opacity-60 block mt-0.5">{opt.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data management */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-medium px-1 mb-2">your data</p>
        <div className="bg-card rounded-lg border border-border divide-y divide-border">
          <SettingLink icon={Download} label="export all data" description="download as JSON" onClick={handleExportData} />
          <SettingLink
            icon={RotateCcw}
            label={resetConfirm ? "tap again to confirm" : "reset all streaks"}
            description={resetConfirm ? "this can't be undone" : "set every habit streak to zero"}
            destructive={resetConfirm}
            onClick={handleResetStreaks}
          />
        </div>
      </div>

      {/* Account & Legal */}
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground font-medium px-1 mb-2">account</p>
        <div className="bg-card rounded-lg border border-border divide-y divide-border">
          <SettingLink icon={Shield} label="privacy policy" description="how we handle your data" />
          <SettingLink icon={HelpCircle} label="help & support" description="get in touch" />
          <SettingLink icon={LogOut} label="sign out" destructive onClick={signOut} />
          <SettingLink icon={Trash2} label="delete account" description="permanently remove all data" destructive onClick={handleDeleteAccount} />
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground text-center pt-2">
        rhythm. v1.0.0
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
  description,
  destructive,
  onClick,
}: {
  icon: typeof Shield;
  label: string;
  description?: string;
  destructive?: boolean;
  onClick?: () => void;
}) => (
  <button onClick={onClick} className="w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50">
    <Icon className={`w-4 h-4 ${destructive ? "text-destructive" : "text-muted-foreground"}`} />
    <div>
      <span className={`text-sm block ${destructive ? "text-destructive" : "text-foreground"}`}>
        {label}
      </span>
      {description && (
        <span className="text-[10px] text-muted-foreground block">{description}</span>
      )}
    </div>
  </button>
);

export default SettingsView;
