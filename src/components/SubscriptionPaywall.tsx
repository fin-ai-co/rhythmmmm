import { useState, useEffect } from "react";
import { Crown, X, Check, RotateCcw } from "lucide-react";
import { purchasePlan, getLocalizedPrice, restorePurchases } from "@/services/purchases";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionPaywallProps {
  trialDaysLeft?: number;
  isTrialExpired?: boolean;
  onDismiss?: () => void;
  forceLock?: boolean;
}

const planDefaults = [
  {
    id: "monthly" as const,
    name: "monthly",
    fallbackPrice: "$4.99",
    period: "/mo",
    description: "billed monthly, cancel anytime",
  },
  {
    id: "yearly" as const,
    name: "yearly",
    fallbackPrice: "$49.99",
    period: "/yr",
    badge: "save 17%",
    description: "billed annually",
  },
];

const features = [
  "unlimited habits",
  "ai guide & coaching",
  "advanced analytics",
  "ritual chains",
  "journal insights",
  "priority support",
];

const SubscriptionPaywall = ({ trialDaysLeft = 0, isTrialExpired = false, onDismiss, forceLock = false }: SubscriptionPaywallProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Build plans with localized prices from Apple (falls back to hardcoded)
  const plans = planDefaults.map((p) => ({
    ...p,
    price: getLocalizedPrice(p.id) ?? p.fallbackPrice,
  }));

  const handleSubscribe = async (planId: "monthly" | "yearly") => {
    setLoading(planId);
    try {
      await purchasePlan(planId);
      // After successful purchase + receipt validation, refresh subscription
      await queryClient.invalidateQueries({ queryKey: ["subscription", user?.id] });
      toast({ title: "welcome to premium!", description: "your subscription is now active." });
      onDismiss?.();
    } catch (err: any) {
      toast({
        title: "purchase failed",
        description: err.message || "something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await restorePurchases();
      await queryClient.invalidateQueries({ queryKey: ["subscription", user?.id] });
      toast({ title: "purchases restored", description: "checking your subscription status..." });
    } catch (err: any) {
      toast({
        title: "restore failed",
        description: err.message || "could not restore purchases",
        variant: "destructive",
      });
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
      <div className="max-w-sm w-full mx-5 space-y-6">
        {/* Close button - only if not force locked */}
        {!forceLock && onDismiss && (
          <div className="flex justify-end">
            <button onClick={onDismiss} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
            <Crown className="w-8 h-8 text-primary" />
          </div>
          {isTrialExpired ? (
            <>
              <h2 className="text-xl font-bold text-foreground">your free trial has ended</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                subscribe to continue building your habits
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-foreground">upgrade to premium</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {trialDaysLeft > 0
                  ? `${trialDaysLeft} day${trialDaysLeft !== 1 ? "s" : ""} left in your free trial`
                  : "unlock the full experience"}
              </p>
            </>
          )}
        </div>

        {/* Features */}
        <div className="bg-card rounded-lg border border-border p-4 space-y-2.5">
          {features.map((f) => (
            <div key={f} className="flex items-center gap-2.5">
              <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>

        {/* Plans */}
        <div className="space-y-2.5">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handleSubscribe(plan.id)}
              disabled={loading !== null}
              className="w-full bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-all duration-300 group disabled:opacity-50"
            >
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">{plan.name}</span>
                  {plan.badge && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground">{plan.description}</span>
              </div>
              <div className="text-right">
                {loading === plan.id ? (
                  <span className="text-sm text-muted-foreground">loading...</span>
                ) : (
                  <>
                    <span className="text-lg font-bold text-foreground">{plan.price}</span>
                    <span className="text-xs text-muted-foreground">{plan.period}</span>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Restore purchases */}
        <button
          onClick={handleRestore}
          disabled={restoring}
          className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-2 disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {restoring ? "restoring..." : "restore purchases"}
        </button>

        {isTrialExpired && (
          <p className="text-[10px] text-muted-foreground text-center">
            your data is safe — subscribe to pick up where you left off
          </p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPaywall;
