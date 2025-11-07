"use client";

import { useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SimulatedTypingEffect } from "@/components/ai/SimulatedTypingEffect";

type Message = {
  role: "user" | "assistant";
  content: string;
  actions?: Array<{ label: string; action: string }>;
};

export function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm BzWork Copilot. Ask me to summarize projects, suggest automations, or plan next steps.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    const userMessage: Message = { role: "user", content: input };
    setMessages((state) => [...state, userMessage]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error ?? "No recibimos respuesta del copiloto");
      }
      const aiMessage: Message = {
        role: "assistant",
        content: data?.message ?? "No response",
        actions: data?.suggestedActions,
      };
      setMessages((state) => [...state, aiMessage]);
    } catch {
      setMessages((state) => [
        ...state,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "I could not reach the AI endpoint.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 text-white">
      <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">
            AI Copilot
          </p>
          <p className="text-sm font-semibold text-white">
            Natural language assistant
          </p>
        </div>
        <Sparkles className="h-5 w-5 text-amber-400" />
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-lg rounded-2xl px-4 py-3 text-sm ${
              message.role === "assistant"
                ? "bg-white/10 text-white"
                : "ml-auto bg-cyan-500/20 text-white"
            }`}
          >
            {message.role === "assistant" ? (
              <SimulatedTypingEffect text={message.content} />
            ) : (
              <p>{message.content}</p>
            )}
            {message.actions ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {message.actions.map((action) => (
                  <span
                    key={action.action}
                    className="rounded-xl border border-dashed border-white/20 px-3 py-1 text-xs font-semibold text-white/70"
                  >
                    {action.label}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <div className="border-t border-white/5 px-5 py-4">
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask for insights, new tasks, or automations..."
          className="min-h-[80px]"
        />
        <Button
          onClick={sendMessage}
          disabled={loading}
          className="mt-3 w-full rounded-2xl"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          <span className="ml-2">Send</span>
        </Button>
      </div>
    </div>
  );
}
