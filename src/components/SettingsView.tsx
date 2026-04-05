import { useState } from "react";
import SubscriptionPaywall from "@/components/SubscriptionPaywall";
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
  Send,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { useHabits } from "@/hooks/useHabits";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const SettingsView = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { isPremium, isTrialActive, trialDaysLeft, hasAccess } = useSubscription();
  const { habits } = useHabits();
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [holdDuration, setHoldDuration] = useState("600");
  const [resetConfirm, setResetConfirm] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

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
      a.download = `discipline-export-${new Date().toISOString().split("T")[0]}.json`;
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

  const handleSendSupport = () => {
    if (!supportMessage.trim()) return;
    const subject = encodeURIComponent(supportSubject.trim() || "discipline. — help request");
    const body = encodeURIComponent(
      `${supportMessage.trim()}\n\n---\nUser: ${user?.email ?? "unknown"}\nDate: ${new Date().toISOString()}`
    );
    window.open(`mailto:illuminova123@gmail.com?subject=${subject}&body=${body}`, "_blank");
    setSupportSubject("");
    setSupportMessage("");
    setShowSupport(false);
    toast({ title: "opening email", description: "your email client should open now" });
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
            ) : isTrialActive ? (
              <span className="text-xs text-primary font-medium">
                trial · {trialDaysLeft}d left
              </span>
            ) : (
              <span className="text-xs text-destructive font-medium">
                trial expired
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
            $4.99/mo or $49.99/yr — unlimited habits, ai guide, and more.
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
          <SettingLink
            icon={Shield}
            label="privacy policy"
            description="how we handle your data"
            onClick={() => navigate("/privacy")}
          />
          <SettingLink
            icon={HelpCircle}
            label="help & support"
            description="get in touch"
            onClick={() => setShowSupport(true)}
          />
          <SettingLink icon={LogOut} label="sign out" destructive onClick={signOut} />
          <SettingLink icon={Trash2} label="delete account" description="permanently remove all data" destructive onClick={handleDeleteAccount} />
        </div>
      </div>

      {/* Support Dialog */}
      {showSupport && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in">
          <div className="bg-card border border-border rounded-t-2xl w-full max-w-md p-5 space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">help & support</p>
                <p className="text-[10px] text-muted-foreground">we'll get back to you as soon as possible</p>
              </div>
              <button onClick={() => setShowSupport(false)} className="p-1.5 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              value={supportSubject}
              onChange={(e) => setSupportSubject(e.target.value)}
              placeholder="subject (optional)"
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
            />

            <textarea
              value={supportMessage}
              onChange={(e) => setSupportMessage(e.target.value)}
              placeholder="describe your issue or question..."
              autoFocus
              className="w-full bg-muted rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none resize-none min-h-[100px]"
            />

            <button
              onClick={handleSendSupport}
              disabled={!supportMessage.trim()}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-30 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              send message
            </button>
          </div>
        </div>
      )}

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
