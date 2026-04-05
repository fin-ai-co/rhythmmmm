import { Lock } from "lucide-react";

const PremiumGate = ({ feature }: { feature: string }) => (
  <div className="animate-fade-in flex flex-col items-center justify-center py-20 space-y-4">
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
      <Lock className="w-7 h-7 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">{feature} is premium</h3>
    <p className="text-sm text-muted-foreground text-center max-w-xs leading-relaxed">
      upgrade to premium to unlock {feature}, unlimited habits, and more
    </p>
    <p className="text-xs text-muted-foreground">
      available via in-app purchase
    </p>
  </div>
);

export default PremiumGate;
