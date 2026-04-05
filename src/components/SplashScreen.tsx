import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [phase, setPhase] = useState<"orb" | "text" | "fade">("orb");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("text"), 600);
    const t2 = setTimeout(() => setPhase("fade"), 2000);
    const t3 = setTimeout(onFinish, 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {phase !== "fade" ? null : null}
      <motion.div
        className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center gap-6"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "fade" ? 0 : 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* Orb */}
        <motion.div
          className="relative"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="w-20 h-20 rounded-full"
            style={{
              background: "radial-gradient(circle at 40% 40%, hsl(213 94% 88%), hsl(213 94% 78%), hsl(213 80% 65%))",
              boxShadow: "0 0 60px hsl(213 94% 78% / 0.35), 0 0 120px hsl(213 94% 78% / 0.15)",
            }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 30% 30%, hsl(0 0% 100% / 0.35), transparent 55%)",
            }}
          />
        </motion.div>

        {/* App name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: phase === "text" || phase === "fade" ? 1 : 0, y: phase === "text" || phase === "fade" ? 0 : 12 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight">discipline.</h1>
          <p className="text-xs text-muted-foreground mt-1.5 tracking-widest">consistency compounds</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
