import { useState, useEffect } from "react";
import { ChevronRight, Target, Flame, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const infoSteps = [
  {
    icon: Target,
    title: "build habits that stick",
    description:
      "add the habits you want to build. start small — even one habit is enough to begin your journey.",
  },
  {
    icon: Flame,
    title: "hold to complete",
    description:
      "press and hold a habit to mark it done. the intentional pause builds mindfulness into every completion.",
  },
  {
    icon: Zap,
    title: "track your streaks",
    description:
      "every day you show up, your streak grows. consistency compounds — watch your progress unfold.",
  },
];

const COMMON_TIMEZONES = [
  { label: "US East (New York)", value: "America/New_York" },
  { label: "US Central (Chicago)", value: "America/Chicago" },
  { label: "US Mountain (Denver)", value: "America/Denver" },
  { label: "US West (Los Angeles)", value: "America/Los_Angeles" },
  { label: "UK (London)", value: "Europe/London" },
  { label: "Central Europe (Berlin)", value: "Europe/Berlin" },
  { label: "India (Kolkata)", value: "Asia/Kolkata" },
  { label: "Japan (Tokyo)", value: "Asia/Tokyo" },
  { label: "Australia (Sydney)", value: "Australia/Sydney" },
  { label: "Brazil (São Paulo)", value: "America/Sao_Paulo" },
];

const OnboardingView = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [selectedTimezone, setSelectedTimezone] = useState(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "UTC";
    }
  });

  const totalSteps = infoSteps.length + 1; // info steps + timezone step
  const isTimezoneStep = step === infoSteps.length;

  const handleFinish = async () => {
    if (user) {
      // Upsert user_settings with timezone
      await supabase.from("user_settings").upsert({
        user_id: user.id,
        timezone: selectedTimezone,
      }, { onConflict: "user_id" });
    }
    onComplete();
  };

  if (isTimezoneStep) {
    const detectedTz = (() => {
      try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return ""; }
    })();

    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 animate-fade-in">
        <div className="w-full max-w-sm space-y-8 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
              <Globe className="w-9 h-9 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-bold text-foreground tracking-tight">your timezone</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              we use this to reset your habits at midnight in your local time.
            </p>
          </div>

          {/* Auto-detected */}
          {detectedTz && (
            <button
              onClick={() => setSelectedTimezone(detectedTz)}
              className={`w-full p-3 rounded-lg text-left transition-all border ${
                selectedTimezone === detectedTz
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50"
              }`}
            >
              <span className="text-xs font-medium block">auto-detected</span>
              <span className="text-sm block mt-0.5">{detectedTz}</span>
            </button>
          )}

          {/* Common timezones */}
          <div className="max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin">
            {COMMON_TIMEZONES.filter(tz => tz.value !== detectedTz).map((tz) => (
              <button
                key={tz.value}
                onClick={() => setSelectedTimezone(tz.value)}
                className={`w-full p-3 rounded-lg text-left transition-all border ${
                  selectedTimezone === tz.value
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50"
                }`}
              >
                <span className="text-sm">{tz.label}</span>
              </button>
            ))}
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === step ? "bg-primary w-6" : i < step ? "bg-primary/50" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <Button onClick={handleFinish} className="w-full h-12 text-sm font-medium">
            let's go
          </Button>
        </div>
      </div>
    );
  }

  const current = infoSteps[step];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 animate-fade-in">
      <div className="w-full max-w-sm space-y-10 text-center">
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary/15 flex items-center justify-center">
            <Icon className="w-9 h-9 text-primary" />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-foreground tracking-tight">{current.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step ? "bg-primary w-6" : i < step ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={() => setStep(step + 1)}
          className="w-full h-12 text-sm font-medium"
        >
          next <ChevronRight className="w-4 h-4 ml-1" />
        </Button>

        <button
          onClick={handleFinish}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          skip intro
        </button>
      </div>
    </div>
  );
};

export default OnboardingView;
