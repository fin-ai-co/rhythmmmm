import { useState } from "react";
import { Link2, Sunrise, Moon, Zap, ChevronRight, Plus, X, Trash2 } from "lucide-react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

interface Ritual {
  id: string;
  name: string;
  icon: "sunrise" | "moon" | "zap";
  steps: RitualStep[];
  activeStep: number;
}

interface RitualStep {
  id: string;
  habit: string;
  duration: string;
  completed: boolean;
}

const iconMap = {
  sunrise: Sunrise,
  moon: Moon,
  zap: Zap,
};

const initialRituals: Ritual[] = [
  {
    id: "1",
    name: "morning flow",
    icon: "sunrise",
    steps: [
      { id: "s1", habit: "drink water", duration: "1 min", completed: false },
      { id: "s2", habit: "meditate", duration: "10 min", completed: false },
      { id: "s3", habit: "journal", duration: "5 min", completed: false },
      { id: "s4", habit: "exercise", duration: "20 min", completed: false },
    ],
    activeStep: 0,
  },
  {
    id: "2",
    name: "wind down",
    icon: "moon",
    steps: [
      { id: "s5", habit: "no screens", duration: "30 min", completed: false },
      { id: "s6", habit: "read", duration: "20 min", completed: false },
      { id: "s7", habit: "reflect", duration: "5 min", completed: false },
    ],
    activeStep: 0,
  },
];

const RitualsView = () => {
  const [rituals, setRituals] = useState<Ritual[]>(initialRituals);
  const [expandedId, setExpandedId] = useState<string | null>("1");
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState<"sunrise" | "moon" | "zap">("zap");
  const [newSteps, setNewSteps] = useState<string[]>([""]);

  const advanceStep = (ritualId: string) => {
    setRituals((prev) =>
      prev.map((r) => {
        if (r.id !== ritualId) return r;
        const next = r.steps.map((s, i) =>
          i === r.activeStep ? { ...s, completed: true } : s
        );
        return {
          ...r,
          steps: next,
          activeStep: Math.min(r.activeStep + 1, r.steps.length),
        };
      })
    );
  };

  const resetRitual = (ritualId: string) => {
    setRituals((prev) =>
      prev.map((r) =>
        r.id === ritualId
          ? { ...r, activeStep: 0, steps: r.steps.map((s) => ({ ...s, completed: false })) }
          : r
      )
    );
  };

  const deleteRitual = (ritualId: string) => {
    setRituals((prev) => prev.filter((r) => r.id !== ritualId));
    if (expandedId === ritualId) setExpandedId(null);
  };

  const createRitual = () => {
    if (!newName.trim() || newSteps.every((s) => !s.trim())) return;
    const ritual: Ritual = {
      id: Date.now().toString(),
      name: newName.trim(),
      icon: newIcon,
      steps: newSteps
        .filter((s) => s.trim())
        .map((s, i) => ({ id: `new-${i}`, habit: s.trim(), duration: "5 min", completed: false })),
      activeStep: 0,
    };
    setRituals((prev) => [...prev, ritual]);
    setNewName("");
    setNewSteps([""]);
    setShowCreate(false);
    setExpandedId(ritual.id);
  };

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">ritual chains</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            link habits into sequences — complete one, the next activates
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground transition-all duration-300"
        >
          <Plus className={`w-4 h-4 transition-transform duration-300 ${showCreate ? "rotate-45" : ""}`} />
        </button>
      </div>

      {/* Create new ritual */}
      {showCreate && (
        <div className="bg-card rounded-lg border border-border p-4 space-y-3 animate-fade-in">
          <p className="text-xs text-muted-foreground font-medium">new ritual</p>

          <div className="flex gap-2">
            {(["sunrise", "moon", "zap"] as const).map((icon) => {
              const Icon = iconMap[icon];
              return (
                <button
                  key={icon}
                  onClick={() => setNewIcon(icon)}
                  className={`p-2.5 rounded-lg transition-all duration-300 ${
                    newIcon === icon ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="ritual name..."
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none border-b border-border pb-2"
          />

          <div className="space-y-2">
            {newSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-4">{i + 1}.</span>
                <input
                  value={step}
                  onChange={(e) => {
                    const updated = [...newSteps];
                    updated[i] = e.target.value;
                    setNewSteps(updated);
                  }}
                  placeholder="habit step..."
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                />
                {newSteps.length > 1 && (
                  <button onClick={() => setNewSteps(newSteps.filter((_, j) => j !== i))}>
                    <X className="w-3 h-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => setNewSteps([...newSteps, ""])}
              className="text-xs text-primary"
            >
              + add step
            </button>
          </div>

          <button
            onClick={createRitual}
            disabled={!newName.trim()}
            className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium disabled:opacity-30 transition-all duration-300"
          >
            create ritual
          </button>
        </div>
      )}

      {/* Ritual cards */}
      <div className="space-y-3">
        {rituals.map((ritual) => {
          const Icon = iconMap[ritual.icon];
          const isExpanded = expandedId === ritual.id;
          const allDone = ritual.activeStep >= ritual.steps.length;
          const progressPct = (ritual.steps.filter((s) => s.completed).length / ritual.steps.length) * 100;

          return (
            <SwipeToDelete key={ritual.id} onDelete={() => deleteRitual(ritual.id)}>
              <div
                className="bg-card rounded-lg border border-border overflow-hidden transition-all duration-300"
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : ritual.id)}
                  className="w-full flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{ritual.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {allDone ? "completed ✓" : `${ritual.activeStep} of ${ritual.steps.length} steps`}
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </button>

                {/* Progress bar */}
                <div className="px-4 pb-1">
                  <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                {/* Expanded steps */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-3 space-y-1 animate-fade-in">
                    {ritual.steps.map((step, i) => {
                      const isActive = i === ritual.activeStep && !allDone;
                      const isDone = step.completed;

                      return (
                        <div key={step.id}>
                          <div
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                              isActive
                                ? "bg-primary/10 border border-primary/30"
                                : isDone
                                ? "opacity-50"
                                : "opacity-30"
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                                  isDone
                                    ? "bg-primary border-primary"
                                    : isActive
                                    ? "border-primary animate-pulse"
                                    : "border-muted-foreground/30"
                                }`}
                              />
                            </div>

                            <div className="flex-1">
                              <p
                                className={`text-sm ${
                                  isDone ? "line-through text-muted-foreground" : "text-foreground"
                                }`}
                              >
                                {step.habit}
                              </p>
                              <p className="text-[10px] text-muted-foreground">{step.duration}</p>
                            </div>

                            {isActive && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  advanceStep(ritual.id);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium transition-all duration-300 hover:bg-primary/90"
                              >
                                done
                              </button>
                            )}
                          </div>

                          {i < ritual.steps.length - 1 && (
                            <div className="flex justify-start ml-[1.35rem]">
                              <div
                                className={`w-0.5 h-3 transition-all duration-300 ${
                                  isDone ? "bg-primary/50" : "bg-muted"
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {allDone && (
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => resetRitual(ritual.id)}
                          className="flex-1 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          reset chain
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </SwipeToDelete>
          );
        })}
      </div>
    </div>
  );
};

export default RitualsView;
