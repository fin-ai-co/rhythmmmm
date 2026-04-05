import { useState } from "react";
import { ChevronRight, Target, Flame, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
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

const OnboardingView = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const current = steps[step];
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
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === step ? "bg-primary w-6" : i < step ? "bg-primary/50" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Button
          onClick={() => {
            if (step < steps.length - 1) {
              setStep(step + 1);
            } else {
              onComplete();
            }
          }}
          className="w-full h-12 text-sm font-medium"
        >
          {step < steps.length - 1 ? (
            <>
              next <ChevronRight className="w-4 h-4 ml-1" />
            </>
          ) : (
            "let's go"
          )}
        </Button>

        {step < steps.length - 1 && (
          <button
            onClick={onComplete}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            skip intro
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingView;
