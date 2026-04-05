import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm text-center space-y-8 animate-fade-in">
        {/* Orb */}
        <div className="flex justify-center">
          <div
            className="w-20 h-20 rounded-full relative"
            style={{
              background:
                "radial-gradient(circle at 40% 40%, hsl(213 94% 88%), hsl(213 94% 78%), hsl(213 80% 65%))",
              boxShadow:
                "0 0 60px hsl(213 94% 78% / 0.35), 0 0 120px hsl(213 94% 78% / 0.15)",
            }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, hsl(0 0% 100% / 0.35), transparent 55%)",
              }}
            />
          </div>
        </div>

        {/* App name & tagline */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            rhythm.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            a minimal habit tracker that helps you build consistency through
            daily streaks, rituals, journaling, and analytics.
          </p>
        </div>

        {/* CTA */}
        <Button asChild className="w-full h-12 text-sm font-medium">
          <Link to="/login">get started</Link>
        </Button>

        {/* Privacy link */}
        <p className="text-xs text-muted-foreground">
          by continuing you agree to our{" "}
          <Link
            to="/privacy"
            className="underline hover:text-foreground transition-colors"
          >
            privacy policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Landing;
