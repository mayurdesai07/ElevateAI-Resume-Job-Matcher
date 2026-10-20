"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, ResumeProfile, JobMatch, OneSkillUnlock, CareerBlueprint } from "@/types";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RefreshCw,
  ChevronRight,
  Mic,
  Volume2,
  VolumeX,
  AlertCircle
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
  onClearInitialPrompt?: () => void;
}

export function AiCareerCoachDrawer({
  isOpen,
  onClose,
  profile,
  jobMatches,
  oneSkillUnlocks,
  activeBlueprint,
  initialPrompt,
  onClearInitialPrompt,
}: AiCareerCoachDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `👋 Hi **${profile.name}**! I'm **Zara**, your AI Career Coach & Talent Architect.\n\n🎙️ **Voice is ready!** Just tap the **Microphone** button below, speak naturally, and I will transcribe your voice and talk back to you.\n\nHow can I help you elevate your career today?`,
      timestamp: "Just now",
      suggestedPrompts: [
        "What are the skills which I lack for getting a new job?",
        "Give me the jobs which are only one skill away from me.",
        "What if I have Snowflake—would I get this job?",
        "What is the single highest-ROI skill I should learn this month?"
      ],
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  // Keep input updated in real-time with live speech transcript while listening
  useEffect(() => {
    if (isListening && transcript) {
      setInput(transcript);
    }
  }, [isListening, transcript]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isListening]);

  // Handle external prompt injection safely (only once per unique prompt)
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim() && initialPrompt !== lastInjectedPromptRef.current) {
      lastInjectedPromptRef.current = initialPrompt;
      handleSendMessage(initialPrompt.trim());
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend !== undefined ? textToSend : input).trim();
    if (!query) return;

    // Mutex & Anti-spam guard: prevent rapid-fire duplicate requests
    const now = Date.now();
    if (isSubmittingRef.current || isLoading) return;
    if (lastSentTextRef.current === query && now - lastSentTimeRef.current < 2500) {
      return; // Ignore identical prompt within 2.5 seconds
    }

    isSubmittingRef.current = true;
    lastSentTimeRef.current = now;
    lastSentTextRef.current = query;

    // Stop listening safely if user submitted while mic was active
    if (isListening) {
      stopListening();
    }
    resetTranscript();

    // Stop speaking if Zara is currently talking
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
      const storedGroq = typeof window !== "undefined" ? localStorage.getItem("elevate_groq_key") : null;
      const storedOpenAi = typeof window !== "undefined" ? localStorage.getItem("elevate_openai_key") : null;
      const userApiKey = storedGemini || storedGroq || storedOpenAi || undefined;
      const apiProvider = storedGemini ? "gemini" : (storedGroq ? "groq" : (storedOpenAi ? "openai" : undefined));

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

      // Automatically speak Zara's response if user used the microphone
      if (usedVoiceRef.current) {
        setCurrentlySpeakingId(assistantMessage.id);
        speakText(replyText, () => {
          setCurrentlySpeakingId(null);
          usedVoiceRef.current = false;
        });
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
      isSubmittingRef.current = false;
    }
  };

  const handleMicToggle = async () => {
    if (isListening) {
      // User tapped mic to finish speaking -> stop and send the transcribed message
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-button">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#183B56] dark:text-white text-sm">Zara — AI Career Coach</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Context: {profile.title} · {profile.name}</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (isSpeaking) stopSpeaking();
              if (isListening) stopListening();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Banner */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Target Focus:</span>
            <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 font-medium">
              {profile.name}
            </span>
            {activeBlueprint && (
              <span className="px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60 font-medium">
                Track: {activeBlueprint.title}
              </span>
            )}
          </div>

          {isListening && (
            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold animate-pulse text-[11px]">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Listening... (tap mic when done)</span>
            </div>
          )}

          {isSpeaking && (
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
              <Volume2 className="w-3.5 h-3.5 animate-bounce" />
              <span>Zara Speaking...</span>
            </div>
          )}
        </div>

        {/* Error notification if mic access was blocked */}
        {voiceError && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border-b border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="flex-1">{voiceError}</span>
          </div>
        )}

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
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed relative group ${
                  m.role === "user"
                    ? "bg-blue-600 text-white font-medium rounded-tr-none shadow-button"
                    : "bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none whitespace-pre-wrap"
                }`}
              >
                {/* Speaker button on assistant message */}
                {m.role === "assistant" && (
                  <button
                    onClick={() => toggleSpeechForMessage(m)}
                    title={isSpeaking && currentlySpeakingId === m.id ? "Stop voice" : "Listen aloud"}
                    className="absolute top-2.5 right-2.5 p-1 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-sm transition-colors"
                  >
                    {isSpeaking && currentlySpeakingId === m.id ? (
                      <VolumeX className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400" />
                    )}
                  </button>
                )}

                {m.content}

                {/* Suggested Prompt Chips */}
                {m.suggestedPrompts && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Quick Questions:
                    </span>
                    {m.suggestedPrompts.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(chip)}
                        className="text-left px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-between font-medium"
                      >
                        <span>{chip}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.role === "user" && (
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 text-xs items-center text-slate-500 dark:text-slate-400">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <span>Zara is thinking & preparing your answer...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar with 1-Click Microphone */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/60">
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
              onClick={handleMicToggle}
              title={isListening ? "Stop and send voice message" : "Click to speak with Zara"}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center relative ${
                isListening
                  ? "bg-rose-500 text-white border-rose-400 shadow-md animate-pulse scale-105"
                  : "bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-sm"
              }`}
            >
              <Mic className={`w-4 h-4 ${isListening ? "animate-bounce" : ""}`} />
              {isListening && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
              )}
            </button>

            <input
              type="text"
              placeholder={
                isListening
                  ? "Listening... Speak now! Tap mic or press Enter when done"
                  : "Click mic to speak, or type your message..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-white dark:bg-slate-900 border transition-all text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none ${
                isListening
                  ? "border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-200"
                  : "border-slate-200 dark:border-slate-700 focus:border-blue-500"
              }`}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-40 transition-all shadow-button"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Clean voice status hint */}
          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 px-1">
            <span>
              {isListening ? (
                <strong className="text-rose-600 dark:text-rose-400">🎙️ Recording live: speak your question, then tap mic or send</strong>
              ) : (
                "💡 Tap the mic to speak. Zara automatically talks back to you!"
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
