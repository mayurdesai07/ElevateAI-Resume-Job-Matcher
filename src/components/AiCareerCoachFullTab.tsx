"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ResumeProfile, JobMatch, OneSkillUnlock, CareerBlueprint } from "@/types";
import {
  Sparkles,
  Send,
  Bot,
  User,
  RefreshCw,
  Copy,
  Check,
  TrendingUp,
  Brain,
  FileText,
  DollarSign,
  Mic,
  Volume2,
  VolumeX,
  AlertCircle
} from "lucide-react";
import { useVoiceCoach } from "@/lib/useVoiceCoach";

interface AiCareerCoachFullTabProps {
  profile: ResumeProfile;
  jobMatches: JobMatch[];
  oneSkillUnlocks: OneSkillUnlock[];
  activeBlueprint?: CareerBlueprint | null;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export function AiCareerCoachFullTab({
  profile,
  jobMatches,
  oneSkillUnlocks,
  activeBlueprint,
  initialPrompt,
  onClearInitialPrompt,
}: AiCareerCoachFullTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `### 🎯 Welcome to your Voice-Enabled AI Career Studio!

I'm **Aria**, an autonomous Career Strategist and Voice Coach. You can talk to me directly using your microphone or type your questions!

**Active Context:**
- **Candidate:** ${profile?.name || "Candidate"} (${profile?.title || "Professional"}, ~${profile?.yearsOfExperience || 3} yrs exp)
- **Top Match:** ${jobMatches[0]?.title || "Senior Analytics Specialist"} at ${jobMatches[0]?.company || "Top Tech Firm"} (${jobMatches[0]?.matchScore || 94}% Fit)
- **Primary 1-Skill Unlock:** ${oneSkillUnlocks[0]?.targetRole || "Senior Specialist"} (+${oneSkillUnlocks[0]?.salaryBoostPercent || 35}% salary boost)
${activeBlueprint ? `- **Target Blueprint:** ${activeBlueprint.title} (${activeBlueprint.averageSalaryUsd})` : ""}

Click the **Microphone** below to speak, or pick any starter question!`,
      timestamp: "Just now",
      suggestedPrompts: [
        "Why am I missing out on Senior roles right now?",
        "I want to become a Data Analyst in 3 months—give me a weekly study schedule based on my current resume.",
        "Rewrite my resume bullet points to highlight my technical projects.",
        "What questions will hiring managers ask me for a Senior Data Analyst role?"
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentlySpeakingId, setCurrentlySpeakingId] = useState<string | null>(null);

  // Guards against concurrent / duplicate sends
  const isSubmittingRef = useRef<boolean>(false);
  const lastSentTextRef = useRef<string>("");
  const lastSentTimeRef = useRef<number>(0);
  const lastInjectedPromptRef = useRef<string>("");
  const usedVoiceRef = useRef<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Clean Voice AI Hook
  const {
    isListening,
    isSpeaking,
    hasSupport,
    transcript,
    voiceError,
    startListening,
    stopListening,
    resetTranscript,
    speakText,
    stopSpeaking,
  } = useVoiceCoach();

  // Keep input updated with live interim speech while listening
  useEffect(() => {
    if (isListening && transcript) {
      setInput(transcript);
    }
  }, [isListening, transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isListening]);

  // Handle external prompt injection safely
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && initialPrompt !== lastInjectedPromptRef.current) {
      lastInjectedPromptRef.current = initialPrompt;
      handleSendMessage(initialPrompt.trim());
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  const handleSendMessage = async (queryText?: string) => {
    const text = (queryText !== undefined ? queryText : input).trim();
    if (!text) return;

    // Mutex & Anti-spam guard: prevent rapid-fire duplicate requests
    const now = Date.now();
    if (isSubmittingRef.current || isLoading) return;
    if (lastSentTextRef.current === text && now - lastSentTimeRef.current < 2500) {
      return; // Ignore duplicate spam within 2.5 seconds
    }

    isSubmittingRef.current = true;
    lastSentTimeRef.current = now;
    lastSentTextRef.current = text;

    // Stop listening safely if user submitted while mic was active
    if (isListening) {
      stopListening();
    }
    resetTranscript();

    // Stop speaking if Aria is talking
    if (isSpeaking) {
      stopSpeaking();
      setCurrentlySpeakingId(null);
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const storedGemini = typeof window !== "undefined" ? localStorage.getItem("elevate_gemini_key") : null;
      const storedGroq = typeof window !== "undefined" ? localStorage.getItem("elevate_groq_key") : null;
      const storedOpenAi = typeof window !== "undefined" ? localStorage.getItem("elevate_openai_key") : null;
      const userApiKey = storedGemini || storedGroq || storedOpenAi || undefined;
      const apiProvider = storedGemini ? "gemini" : (storedGroq ? "groq" : (storedOpenAi ? "openai" : undefined));

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: text,
          userApiKey,
          apiProvider,
          context: {
            profile,
            jobMatches,
            oneSkillUnlocks,
            activeBlueprint,
          },
        }),
      });

      const data = await res.json();
      const replyContent = data.reply || "Let me analyze your background and guide you.";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyContent,
        timestamp: "Just now",
        suggestedPrompts: [
          "Create a day-by-day checklist for Week 1",
          "What salary should I ask for during negotiations?",
          "How do I explain missing skills during an interview?"
        ]
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Automatically speak Aria's response if user used the mic!
      if (usedVoiceRef.current) {
        setCurrentlySpeakingId(assistantMessage.id);
        speakText(replyContent, () => {
          setCurrentlySpeakingId(null);
          usedVoiceRef.current = false;
        });
      }
    } catch (err) {
      console.error("AI Coach API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, connection issue. Let me review your resume context.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const handleMicToggle = async () => {
    if (isListening) {
      // User tapped mic while listening -> stop and send the transcribed voice message
      const recorded = stopListening();
      const query = (recorded || transcript || input).trim();
      if (query) {
        usedVoiceRef.current = true;
        handleSendMessage(query);
      }
    } else {
      // User tapped mic to start speaking
      usedVoiceRef.current = true;
      setInput("");
      resetTranscript();
      await startListening();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const toggleSpeechForMessage = (message: ChatMessage) => {
    if (isSpeaking && currentlySpeakingId === message.id) {
      stopSpeaking();
      setCurrentlySpeakingId(null);
    } else {
      setCurrentlySpeakingId(message.id);
      speakText(message.content, () => {
        setCurrentlySpeakingId(null);
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Left Sidebar: Active Context & Quick Strategies */}
      <div className="lg:col-span-1 space-y-4">
        {/* Active Context Card */}
        <div className="p-4 rounded-2xl bg-obsidian-900 border border-slate-800 shadow-glass">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <Brain className="w-4 h-4 text-emerald-400" />
            <span>Active AI Context</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-slate-400">Candidate:</span>
              <div className="font-bold text-white">{profile.name}</div>
            </div>
            <div>
              <span className="text-slate-400">Current Role:</span>
              <div className="font-semibold text-emerald-400">{profile.title}</div>
            </div>
            <div>
              <span className="text-slate-400">Top 1-Skill Target:</span>
              <div className="font-semibold text-amber-400">
                {oneSkillUnlocks[0]?.targetRole || "Senior Specialist"}
              </div>
            </div>
            {activeBlueprint && (
              <div>
                <span className="text-slate-400">Viewed Blueprint:</span>
                <div className="font-semibold text-cyan-400">{activeBlueprint.title}</div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Launch Questions */}
        <div className="p-4 rounded-2xl bg-obsidian-900 border border-slate-800 shadow-glass">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Instant Strategies</span>
          </div>

          <div className="space-y-2">
            {[
              { label: "Why missing out on Senior roles?", icon: TrendingUp },
              { label: "3-Month Data Analyst Study Plan", icon: Brain },
              { label: "Rewrite Resume Bullets (Google XYZ)", icon: FileText },
              { label: "Negotiate Top-of-Band Salary", icon: DollarSign },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(btn.label)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors flex items-center gap-2"
              >
                <btn.icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="line-clamp-1">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="lg:col-span-3 bg-obsidian-900/90 border border-slate-800 rounded-2xl shadow-glass flex flex-col h-[700px]">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">Aria — Voice Career Strategist</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  READY
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Tap the microphone to talk with Aria, or type any career and interview question.
              </p>
            </div>
          </div>

          {/* Audio State Banner */}
          {isSpeaking && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-pulse">
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>Aria Speaking...</span>
            </div>
          )}

          {isListening && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold animate-pulse">
              <Mic className="w-4 h-4 animate-bounce" />
              <span>Listening to Voice...</span>
            </div>
          )}
        </div>

        {/* Error notification if mic access was blocked */}
        {voiceError && (
          <div className="p-3 bg-rose-950/40 border-b border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="flex-1">{voiceError}</span>
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl max-w-[85%] leading-relaxed relative group ${
                  m.role === "user"
                    ? "bg-emerald-500 text-obsidian-950 font-medium rounded-tr-none shadow-glow text-sm"
                    : "bg-obsidian-950 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap"
                }`}
              >
                {/* Action buttons (Copy + Speak) */}
                {m.role === "assistant" && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleSpeechForMessage(m)}
                      title={isSpeaking && currentlySpeakingId === m.id ? "Stop voice" : "Read aloud"}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      {isSpeaking && currentlySpeakingId === m.id ? (
                        <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5 hover:text-emerald-400" />
                      )}
                    </button>

                    <button
                      onClick={() => copyToClipboard(m.content, m.id)}
                      title="Copy text"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                    >
                      {copiedId === m.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                )}

                {m.content}

                {/* Suggested prompt chips */}
                {m.suggestedPrompts && (
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
                    {m.suggestedPrompts.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors"
                      >
                        ⚡ {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs items-center text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <span>Aria is analyzing your voice prompt and career data...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form with 1-Click Microphone Button */}
        <div className="p-4 border-t border-slate-800 bg-obsidian-950 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3"
          >
            {/* Microphone Voice Button */}
            <button
              type="button"
              onClick={handleMicToggle}
              title={isListening ? "Stop and send voice message" : "Click to speak with Aria"}
              className={`p-3 rounded-xl border transition-all flex items-center justify-center relative ${
                isListening
                  ? "bg-rose-500 text-white border-rose-400 shadow-glow animate-pulse scale-105"
                  : "bg-obsidian-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40"
              }`}
            >
              <Mic className={`w-5 h-5 ${isListening ? "animate-bounce" : ""}`} />
              {isListening && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
              )}
            </button>

            <input
              type="text"
              placeholder={
                isListening
                  ? "Listening to your voice... Speak now! Tap mic or press Enter when done"
                  : "Click mic to speak, or type your question..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`flex-1 px-4 py-3 text-xs rounded-xl bg-obsidian-900 border transition-all text-white placeholder-slate-500 focus:outline-none ${
                isListening
                  ? "border-rose-500 bg-rose-950/20 text-rose-200"
                  : "border-slate-700/80 focus:border-emerald-500"
              }`}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-obsidian-950 font-bold disabled:opacity-40 transition-all shadow-glow flex items-center gap-2"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Clean voice status hint */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>
              {isListening ? (
                <strong className="text-rose-400">🎙️ Live Recording: Speak now, then tap mic or send</strong>
              ) : (
                "🎙️ 1-Click Voice AI: Click the mic and speak naturally. Aria transcribes and speaks back to you."
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
