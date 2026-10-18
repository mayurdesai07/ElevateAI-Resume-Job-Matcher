"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ResumeProfile, JobMatch, OneSkillUnlock, CareerBlueprint } from "@/types";
import {
  MessageSquareCode,
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
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  AudioWaveform
} from "lucide-react";
import { useVoiceCoach } from "@/lib/useVoiceCoach";

interface AiCareerCoachFullTabProps {
  profile: ResumeProfile;
  jobMatches: JobMatch[];
  oneSkillUnlocks: OneSkillUnlock[];
  activeBlueprint?: CareerBlueprint | null;
  initialPrompt?: string;
}

export function AiCareerCoachFullTab({
  profile,
  jobMatches,
  oneSkillUnlocks,
  activeBlueprint,
  initialPrompt,
}: AiCareerCoachFullTabProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `### 🎯 Welcome to your Voice-Enabled AI Career Studio!

I'm **Aria**, an autonomous Career Strategist and Voice Coach. You can talk to me directly using your microphone or type your questions!

**Active Context:**
- **Candidate:** ${profile.name} (${profile.title}, ~${profile.yearsOfExperience} yrs exp)
- **Top Match:** ${jobMatches[0]?.title} at ${jobMatches[0]?.company} (${jobMatches[0]?.matchScore}% Fit)
- **Primary 1-Skill Unlock:** ${oneSkillUnlocks[0]?.targetRole} (+${oneSkillUnlocks[0]?.salaryBoostPercent}% salary boost)
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Voice AI Hook
  const {
    isListening,
    isSpeaking,
    hasSupport,
    voiceMode,
    setVoiceMode,
    transcript,
    audioLevel,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
  } = useVoiceCoach((recognizedText) => {
    if (recognizedText) {
      setInput(recognizedText);
      handleSendMessage(recognizedText);
    }
  });

  // Keep input updated with live interim speech while listening
  useEffect(() => {
    if (isListening && transcript) {
      setInput(transcript);
    }
  }, [isListening, transcript]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isListening]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || isLoading) return;

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
      const storedOpenAi = typeof window !== "undefined" ? localStorage.getItem("elevate_openai_key") : null;
      const userApiKey = storedGemini || storedOpenAi || undefined;
      const apiProvider = storedGemini ? "gemini" : (storedOpenAi ? "openai" : undefined);

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

      // If voice mode is enabled, auto-speak Aria's response
      if (voiceMode) {
        setCurrentlySpeakingId(assistantMessage.id);
        speakText(replyContent);
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
      speakText(message.content);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
      {/* Left Sidebar: Active Context & Voice Controls */}
      <div className="lg:col-span-1 space-y-4">
        {/* Voice AI Control Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-obsidian-900 to-obsidian-900 border border-indigo-500/30 shadow-glass">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-300">
              <Radio className={`w-4 h-4 ${voiceMode ? "text-emerald-400 animate-pulse" : "text-indigo-400"}`} />
              <span>Voice Conversation</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${voiceMode ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
              {voiceMode ? "AUTO-VOICE ON" : "MUTED"}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Talk directly to Aria. Toggle auto-voice to have her speak all responses out loud.
          </p>

          <button
            onClick={() => {
              const next = !voiceMode;
              setVoiceMode(next);
              if (!next && isSpeaking) stopSpeaking();
            }}
            className={`mt-3 w-full py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
              voiceMode
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700"
            }`}
          >
            {voiceMode ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Auto-Read Responses: ACTIVE</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-slate-400" />
                <span>Enable Voice Auto-Read</span>
              </>
            )}
          </button>
        </div>

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
                  VOICE ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Ask by voice or text. Get tailored career schedules, resume rewrites, and interview advice.
              </p>
            </div>
          </div>

          {/* Audio State Banner */}
          {isSpeaking && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold animate-pulse">
              <Volume2 className="w-4 h-4" />
              <span>Aria Speaking...</span>
            </div>
          )}

          {isListening && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold animate-pulse">
              <Mic className="w-4 h-4" />
              <span>Listening to Voice...</span>
            </div>
          )}
        </div>

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

        {/* Input Form with Microphone Button */}
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
              onClick={() => {
                if (isListening) {
                  stopListening();
                } else {
                  startListening();
                }
              }}
              title={isListening ? "Stop listening" : "Click to speak with Aria"}
              className={`p-3 rounded-xl border transition-all flex items-center justify-center relative ${
                isListening
                  ? "bg-rose-500/20 border-rose-500 text-rose-400 shadow-glow animate-pulse"
                  : "bg-obsidian-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40"
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-5 h-5 text-rose-400" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                </>
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            <input
              type="text"
              placeholder={
                isListening
                  ? "Listening to your voice... Speak your question now!"
                  : "Ask Aria anything, or click the mic to speak..."
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

          {/* Helpful voice hint */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>🎙️ **Voice AI Ready**: Click the mic and speak naturally. Aria understands speech directly.</span>
            {isListening && <span className="text-rose-400 font-bold animate-pulse">● Live Recording</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
