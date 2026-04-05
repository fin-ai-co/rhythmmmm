import { Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Habit } from "@/hooks/useHabits";
import { useRef, useState } from "react";

interface ShareStreakProps {
  habits: Habit[];
  completedCount: number;
}

const ShareStreak = ({ habits, completedCount }: ShareStreakProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [sharing, setSharing] = useState(false);

  const topStreak = habits.length > 0
    ? habits.reduce((best, h) => (h.streak > best.streak ? h : best), habits[0])
    : null;

  const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);

  const generateImage = (): Promise<Blob> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const w = 600;
      const h = 400;
      canvas.width = w;
      canvas.height = h;

      const bg = ctx.createLinearGradient(0, 0, w, h);
      bg.addColorStop(0, "#0f1724");
      bg.addColorStop(1, "#131d2e");
      ctx.fillStyle = bg;
      ctx.roundRect(0, 0, w, h, 24);
      ctx.fill();

      ctx.fillStyle = "rgba(139, 192, 255, 0.05)";
      for (let x = 30; x < w; x += 30) {
        for (let y = 30; y < h; y += 30) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = "rgba(139, 192, 255, 0.4)";
      ctx.font = "600 14px system-ui, -apple-system, sans-serif";
      ctx.fillText("rhythm.", 40, 50);

      ctx.fillStyle = "#8bc0ff";
      ctx.font = "700 72px system-ui, -apple-system, sans-serif";
      ctx.fillText(`${totalStreak}`, 40, 140);

      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "400 16px system-ui, -apple-system, sans-serif";
      ctx.fillText("total streak days", 40, 170);

      const statsY = 220;
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "400 12px system-ui, -apple-system, sans-serif";
      ctx.fillText("TODAY", 40, statsY);
      ctx.fillStyle = "#ffffff";
      ctx.font = "600 28px system-ui, -apple-system, sans-serif";
      ctx.fillText(`${completedCount}/${habits.length}`, 40, statsY + 35);

      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "400 12px system-ui, -apple-system, sans-serif";
      ctx.fillText("BEST STREAK", 200, statsY);
      ctx.fillStyle = "#ffffff";
      ctx.font = "600 28px system-ui, -apple-system, sans-serif";
      if (topStreak) {
        ctx.fillText(`${topStreak.streak}d`, 200, statsY + 35);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "400 14px system-ui, -apple-system, sans-serif";
        ctx.fillText(topStreak.name, 200, statsY + 58);
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "400 12px system-ui, -apple-system, sans-serif";
      ctx.fillText("TRACKING", 400, statsY);
      ctx.fillStyle = "#ffffff";
      ctx.font = "600 28px system-ui, -apple-system, sans-serif";
      ctx.fillText(`${habits.length}`, 400, statsY + 35);
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "400 14px system-ui, -apple-system, sans-serif";
      ctx.fillText("habits", 400, statsY + 58);

      const glow = ctx.createRadialGradient(w - 80, 80, 10, w - 80, 80, 100);
      glow.addColorStop(0, "rgba(255, 149, 0, 0.15)");
      glow.addColorStop(1, "rgba(255, 149, 0, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(w - 80, 80, 100, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
      ctx.font = "400 12px system-ui, -apple-system, sans-serif";
      ctx.fillText("consistency compounds.", 40, h - 30);

      canvas.toBlob((blob) => resolve(blob!), "image/png");
    });
  };

  const handleShare = async () => {
    if (habits.length === 0) {
      toast({ title: "nothing to share yet", description: "add some habits first" });
      return;
    }

    setSharing(true);
    try {
      const blob = await generateImage();
      const file = new File([blob], "rhythm-streak.png", { type: "image/png" });
      const shareText = `${totalStreak} total streak days across ${habits.length} habits. consistency compounds.`;

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ text: shareText, files: [file] });
      } else if (navigator.share) {
        await navigator.share({ text: shareText });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "discipline-streak.png";
        a.click();
        URL.revokeObjectURL(url);
        toast({ title: "image downloaded", description: "share it wherever you like" });
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        toast({ title: "couldn't share", description: "try downloading instead", variant: "destructive" });
      }
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />
      <button
        onClick={handleShare}
        disabled={sharing}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300 disabled:opacity-50 touch-active"
      >
        <Share2 className="w-3.5 h-3.5" />
        share streak
      </button>
    </>
  );
};

export default ShareStreak;
