import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "guide";
  text: string;
}

const fakeResponses = [
  "your exercise habit has the highest friction score. try reducing it to a 10-minute walk — momentum matters more than intensity.",
  "i noticed your journaling streak is strong. consider anchoring your weaker habits right after journaling to ride that momentum.",
  "you've been consistent with meditation for 12 days. that's your strongest anchor habit — protect it at all costs.",
  "no-coffee has been tough this week. would switching to herbal tea reduce the friction enough to stay consistent?",
  "your completion rate peaks on tuesdays and wednesdays. schedule your hardest habits on those days.",
  "consistency beats perfection. even a 2-minute version of a habit keeps the chain alive.",
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "guide",
    text: "hey. i've been analyzing your patterns. ask me anything about your habits, or i'll share what i've noticed.",
  },
];

const GuideView = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = fakeResponses[Math.floor(Math.random() * fakeResponses.length)];
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "guide", text: response },
      ]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  return (
    <div className="animate-fade-in flex flex-col" style={{ height: "calc(100vh - 10rem)" }}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">the guide</h2>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pb-4 scrollbar-none">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all duration-300 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border text-foreground rounded-bl-md"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="ask the guide..."
          className="flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || isTyping}
          className="p-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 transition-all duration-300 hover:bg-primary/90"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default GuideView;
