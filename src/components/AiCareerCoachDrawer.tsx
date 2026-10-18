"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ResumeProfile, JobMatch, OneSkillUnlock, CareerBlueprint } from "@/types";
import {
  MessageSquareCode,
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RefreshCw,
  ChevronRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio
} from "lucide-react";
import { useVoiceCoach } from "@/lib/useVoiceCoach";

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
      content: `👋 Hi **${profile.name}**! I'm **Aria**, your AI Career Coach & Talent Architect.\n\n🎙️ **Voice AI is enabled!** Click the microphone button below to speak directly with me, or type any question.\n\nI have complete context of your resume (**${profile.title}**), your **${jobMatches.length} job matches**, and your **One-Skill Unlock recommendations**.`,
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
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
  } = useVoiceCoach((recognizedText) => {
    // When final speech is recognized, populate input or auto-send
    if (recognizedText) {
      setInput(recognizedText);
      handleSendMessage(recognizedText);
    }
  });

  // Keep input updated with live interim transcript while listening
  useEffect(() => {
    if (isListening && transcript) {
      setInput(transcript);
    }
  }, [isListening, transcript]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isListening]);

  // Handle initial external prompt injection
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    if (isSpeaking) {
      stopSpeaking();
      setCurrentlySpeakingId(null);
    }

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
      const storedGemini = typeof window !== "undefined" ? localStorage.getItem("elevate_gemini_key") : null;
      const storedOpenAi = typeof window !== "undefined" ? localStorage.getItem("elevate_openai_key") : null;
      const userApiKey = storedGemini || storedOpenAi || undefined;
      const apiProvider = storedGemini ? "gemini" : (storedOpenAi ? "openai" : undefined);

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: query,
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
      const replyText = data.reply || "I reviewed your resume and am ready to guide your next steps.";

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: replyText,
        timestamp: "Just now",
        suggestedPrompts: [
          "Break down week 1 in detail",
          "Draft bullet points for this",
          "What salary should I ask for?"
        ]
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // If voice mode is enabled, auto-speak Aria's response!
      if (voiceMode) {
        setCurrentlySpeakingId(assistantMessage.id);
        speakText(replyText);
      }
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

  const toggleSpeechForMessage = (message: ChatMessage) => {
    if (isSpeaking && currentlySpeakingId === message.id) {
      stopSpeaking();
      setCurrentlySpeakingId(null);
    } else {
      setCurrentlySpeakingId(message.id);
      speakText(message.content);
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
                <h3 className="font-bold text-white text-sm">Aria — Voice & Chat Coach</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-400">Context: {profile.title} · {profile.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Mode Toggle Switch */}
            <button
              onClick={() => {
                const next = !voiceMode;
                setVoiceMode(next);
                if (!next && isSpeaking) stopSpeaking();
              }}
              title={voiceMode ? "Voice Auto-Read ON" : "Voice Auto-Read OFF"}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                voiceMode
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow"
                  : "bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200"
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${voiceMode ? "text-emerald-400 animate-pulse" : ""}`} />
              <span>Voice Mode: {voiceMode ? "ON" : "OFF"}</span>
            </button>

            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                if (isListening) stopListening();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Audio Visualizer / Context Banner */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-slate-400">
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

          {/* Voice status indicator */}
          {isListening && (
            <div className="flex items-center gap-1.5 text-rose-400 font-bold animate-pulse text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Listening to you...</span>
            </div>
          )}

          {isSpeaking && (
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
              <Volume2 className="w-3.5 h-3.5 animate-bounce" />
              <span>Aria Speaking...</span>
            </div>
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
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed relative group ${
                  m.role === "user"
                    ? "bg-emerald-500 text-obsidian-950 font-medium rounded-tr-none shadow-glow"
                    : "bg-obsidian-900 border border-slate-800 text-slate-200 rounded-tl-none whitespace-pre-wrap"
                }`}
              >
                {/* Text-to-speech speaker button on assistant message */}
                {m.role === "assistant" && (
                  <button
                    onClick={() => toggleSpeechForMessage(m)}
                    title={isSpeaking && currentlySpeakingId === m.id ? "Stop voice" : "Read aloud"}
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition-colors"
                  >
                    {isSpeaking && currentlySpeakingId === m.id ? (
                      <VolumeX className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-emerald-400" />
                    )}
                  </button>
                )}

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
              <span>Aria is thinking & synthesizing your voice input...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with Voice Microphone */}
        <div className="p-3 border-t border-slate-800 bg-obsidian-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            {/* Microphone Button */}
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
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center relative ${
                isListening
                  ? "bg-rose-500/20 border-rose-500 text-rose-400 shadow-glow animate-pulse"
                  : "bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40"
              }`}
            >
              {isListening ? (
                <>
                  <Mic className="w-4 h-4 text-rose-400" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                </>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <input
              type="text"
              placeholder={
                isListening
                  ? "Listening to your voice... Speak now!"
                  : "Ask Aria or click the mic to speak..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-obsidian-950 border transition-all text-white placeholder-slate-500 focus:outline-none ${
                isListening
                  ? "border-rose-500 bg-rose-950/20 text-rose-200"
                  : "border-slate-700/80 focus:border-emerald-500"
              }`}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold disabled:opacity-40 transition-all shadow-glow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick voice hint */}
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 px-1">
            <span>💡 Click the mic & say: "Why am I missing out on Senior roles?"</span>
            {isListening && <span className="text-rose-400 font-semibold">🎙️ Audio Recording Active</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
