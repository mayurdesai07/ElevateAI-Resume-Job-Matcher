"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ResumeProfile, JobMatch, OneSkillUnlock, CareerBlueprint } from "@/types";
import { MessageSquareCode, Sparkles, X, Send, Bot, User, RefreshCw, ChevronRight } from "lucide-react";

interface AiCareerCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ResumeProfile;
  jobMatches: JobMatch[];
  oneSkillUnlocks: OneSkillUnlock[];
  activeBlueprint?: CareerBlueprint | null;
  initialPrompt?: string;
}

export function AiCareerCoachDrawer({
  isOpen,
  onClose,
  profile,
  jobMatches,
  oneSkillUnlocks,
  activeBlueprint,
  initialPrompt,
}: AiCareerCoachDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `👋 Hi **${profile.name}**! I'm **Aria**, your AI Career Coach & Talent Architect.\n\nI have complete context of your resume (**${profile.title}**), your **${jobMatches.length} job matches**, and your **One-Skill Unlock recommendations**.\n\nHow can I help you elevate your career today?`,
      timestamp: "Just now",
      suggestedPrompts: [
        "Why am I missing out on Senior roles right now?",
        "Give me a 3-month Data Analyst study schedule",
        "Rewrite my resume bullet points for impact",
        "What is the single highest-ROI skill I should learn this month?"
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle initial external prompt injection
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
          context: {
            profile,
            jobMatches,
            oneSkillUnlocks,
            activeBlueprint,
          },
        }),
      });

      const data = await res.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I encountered an issue processing your request. Please try again.",
        timestamp: "Just now",
        suggestedPrompts: [
          "Break down week 1 in detail",
          "Draft bullet points for this",
          "What salary should I ask for?"
        ]
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("AI Coach error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I had trouble connecting. Let me check your resume and answer directly.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-obsidian-950 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-obsidian-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">Aria — AI Career Coach</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">Context: {profile.title} · {profile.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Context bar */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <span className="font-semibold text-slate-300">Active Focus:</span>
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {profile.name}
          </span>
          {activeBlueprint && (
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Track: {activeBlueprint.title}
            </span>
          )}
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.role === "user"
                    ? "bg-emerald-500 text-obsidian-950 font-medium rounded-tr-none shadow-glow"
                    : "bg-obsidian-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap"
                }`}
              >
                {m.content}

                {/* Suggested Prompt Chips */}
                {m.suggestedPrompts && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Quick Questions:
                    </span>
                    {m.suggestedPrompts.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="text-left px-2.5 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-[11px] text-slate-300 transition-colors flex items-center justify-between"
                      >
                        <span>{chip}</span>
                        <ChevronRight className="w-3 h-3 text-slate-500" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs items-center text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <span>Aria is thinking & synthesizing your resume data...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-800 bg-obsidian-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask Aria anything about your career, study plan, or resume..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold disabled:opacity-40 transition-all shadow-glow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
