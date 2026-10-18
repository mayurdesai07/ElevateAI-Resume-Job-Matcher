"use client";

import React from "react";
import { Sparkles, Compass, Briefcase, Zap, MessageSquareCode, ExternalLink, KeyRound } from "lucide-react";

interface NavbarProps {
  activeTab: "jobs" | "unlocks" | "roadmaps" | "ai";
  setActiveTab: (tab: "jobs" | "unlocks" | "roadmaps" | "ai") => void;
  onOpenAiDrawer: () => void;
  onOpenKeyModal: () => void;
  matchesCount: number;
  unlocksCount: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenAiDrawer,
  onOpenKeyModal,
  matchesCount,
  unlocksCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-obsidian-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("jobs")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-[1px] shadow-glow">
            <div className="w-full h-full bg-obsidian-900 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                Elevate<span className="text-emerald-400">AI</span>
              </span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Intelligent Job Matcher & Skill Unlock</p>
          </div>
        </div>

        {/* Central Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-obsidian-900/90 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "jobs"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700/60"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>Job Matches</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold">
              {matchesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("unlocks")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "unlocks"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700/60"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>1-Skill Unlocks</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/10 text-amber-400 font-semibold">
              {unlocksCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("roadmaps")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "roadmaps"
                ? "bg-slate-800 text-white shadow-sm border border-slate-700/60"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Career Blueprints</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "ai"
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            <MessageSquareCode className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI Career Coach</span>
          </button>
        </nav>

        {/* Right Action: Quick AI Drawer Trigger & API Key Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenKeyModal}
            title="Configure AI Models & API Keys (Gemini, OpenAI, etc.)"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 border border-slate-700/80 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenAiDrawer}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60 transition-all shadow-glow hover:shadow-emerald-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Aria AI Coach</span>
          </button>
        </div>
      </div>

      {/* Mobile sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-obsidian-900/90 py-2 px-2 text-xs">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
            activeTab === "jobs" ? "text-emerald-400 font-bold bg-slate-800" : "text-slate-400"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Jobs
        </button>
        <button
          onClick={() => setActiveTab("unlocks")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
            activeTab === "unlocks" ? "text-amber-400 font-bold bg-slate-800" : "text-slate-400"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Unlocks
        </button>
        <button
          onClick={() => setActiveTab("roadmaps")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
            activeTab === "roadmaps" ? "text-cyan-400 font-bold bg-slate-800" : "text-slate-400"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Roadmaps
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
            activeTab === "ai" ? "text-indigo-400 font-bold bg-slate-800" : "text-slate-400"
          }`}
        >
          <MessageSquareCode className="w-3.5 h-3.5" />
          AI Coach
        </button>
      </div>
    </header>
  );
}
