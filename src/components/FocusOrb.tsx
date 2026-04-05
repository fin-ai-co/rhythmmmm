const FocusOrb = ({ progress }: { progress: number }) => {
  const scale = 0.85 + progress * 0.15;
  const glowSize = 30 + progress * 40;
  
  return (
    <div className="flex items-center justify-center py-6">
      <div className="relative">
        <div
          className="w-20 h-20 rounded-full orb-pulse"
          style={{
            background: `radial-gradient(circle at 40% 40%, hsl(213 94% 88%), hsl(213 94% 78%), hsl(213 80% 65%))`,
            transform: `scale(${scale})`,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: `0 0 ${glowSize}px hsl(213 94% 78% / ${0.15 + progress * 0.2})`,
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, hsl(0 0% 100% / 0.35), transparent 55%)`,
          }}
        />
      </div>
    </div>
  );
};

export default FocusOrb;
