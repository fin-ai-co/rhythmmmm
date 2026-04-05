import { Crown, X, Check } from "lucide-react";

interface SubscriptionPaywallProps {
  trialDaysLeft?: number;
  isTrialExpired?: boolean;
  onDismiss?: () => void;
  forceLock?: boolean;
}

const plans = [
  {
    id: "monthly",
    name: "monthly",
    price: "$4.99",
    period: "/mo",
    description: "billed monthly, cancel anytime",
  },
  {
    id: "yearly",
    name: "yearly",
    price: "$49.99",
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
  const handleSubscribe = (planId: string) => {
    // In a real app this would open Stripe/IAP
    // For now show a message
    alert(`Subscription to ${planId} plan — payment integration coming soon`);
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
              className="w-full bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:border-primary/50 transition-all duration-300 group"
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
                <span className="text-lg font-bold text-foreground">{plan.price}</span>
                <span className="text-xs text-muted-foreground">{plan.period}</span>
              </div>
            </button>
          ))}
        </div>

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
