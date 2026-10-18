"use client";

import React, { useState, useEffect } from "react";
import { KeyRound, Sparkles, ExternalLink, Check, X, ShieldCheck } from "lucide-react";

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ApiKeyModal({ isOpen, onClose }: ApiKeyModalProps) {
  const [geminiKey, setGeminiKey] = useState("");
  const [openAiKey, setOpenAiKey] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setGeminiKey(localStorage.getItem("elevate_gemini_key") || "");
      setOpenAiKey(localStorage.getItem("elevate_openai_key") || "");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("elevate_gemini_key", geminiKey.trim());
      localStorage.setItem("elevate_openai_key", openAiKey.trim());
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1200);
    }
  };

  const handleClear = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("elevate_gemini_key");
      localStorage.removeItem("elevate_openai_key");
      setGeminiKey("");
      setOpenAiKey("");
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 800);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-obsidian-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI Engine & API Key Settings</h3>
            <p className="text-xs text-slate-400">
              ElevateAI connects out-of-the-box, or you can use your custom keys
            </p>
          </div>
        </div>

        {/* Status banner */}
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-slate-300">
            <strong className="text-emerald-400">Live AI Active:</strong> You don't need to add any key! ElevateAI automatically connects to our live conversational AI models for full conversational chats and career guidance.
          </div>
        </div>

        {/* Custom API Key Input */}
        <div className="mt-5 space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-200">
                Google Gemini API Key (Optional)
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-semibold text-slate-200">
                OpenAI API Key (Optional)
              </label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Get Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="sk-..."
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-obsidian-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
          >
            Reset to Default
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 transition-all shadow-glow flex items-center gap-1.5"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Settings</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
