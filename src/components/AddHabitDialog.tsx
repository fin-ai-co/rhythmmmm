import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddHabitDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (name: string, friction: "low" | "medium" | "heavy") => Promise<void>;
}

const AddHabitDialog = ({ open, onClose, onAdd }: AddHabitDialogProps) => {
  const [name, setName] = useState("");
  const [friction, setFriction] = useState<"low" | "medium" | "heavy">("low");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await onAdd(name.trim().toLowerCase(), friction);
    setName("");
    setFriction("low");
    setLoading(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-background/60 glass" />
      <div className="relative w-full max-w-md bg-card border-t border-border/50 rounded-t-3xl p-6 space-y-5 animate-slide-up safe-bottom">
        <div className="w-10 h-1 bg-muted-foreground/20 rounded-full mx-auto -mt-1 mb-2" />
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">new habit</h3>
          <button onClick={onClose} className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all touch-active">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="e.g. meditate 10 min"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 bg-muted border-border/50 rounded-xl"
            autoFocus
          />

          <div>
            <p className="text-xs text-muted-foreground mb-2">friction level</p>
            <div className="flex gap-2">
              {(["low", "medium", "heavy"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFriction(f)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-medium transition-all duration-300 touch-active ${
                    friction === f
                      ? "bg-primary text-primary-foreground shadow-[0_0_16px_hsl(213_94%_78%/0.2)]"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading || !name.trim()} className="w-full h-12 rounded-xl text-sm font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            add habit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddHabitDialog;
