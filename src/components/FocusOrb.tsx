const FocusOrb = ({ progress }: { progress: number }) => {
  const scale = 0.8 + progress * 0.2;
  
  return (
    <div className="flex items-center justify-center py-8">
      <div className="relative">
        <div
          className="w-24 h-24 rounded-full orb-pulse"
          style={{
            background: `radial-gradient(circle at 40% 40%, hsl(213 94% 85%), hsl(213 94% 78%), hsl(213 80% 70%))`,
            transform: `scale(${scale})`,
            transition: "transform 0.5s ease-out",
            boxShadow: `0 0 ${40 + progress * 30}px hsl(213 94% 78% / 0.3)`,
          }}
        />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, hsl(0 0% 100% / 0.4), transparent 60%)`,
          }}
        />
      </div>
    </div>
  );
};

export default FocusOrb;
