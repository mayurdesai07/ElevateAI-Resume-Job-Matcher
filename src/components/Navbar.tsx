"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Compass,
  Briefcase,
  Zap,
  MessageSquareCode,
  KeyRound,
  CheckCircle2,
  Building2,
  User,
  LogIn,
  LogOut,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { UserAccount } from "@/types";

interface NavbarProps {
  activeTab: "jobs" | "unlocks" | "roadmaps" | "ai";
  setActiveTab: (tab: "jobs" | "unlocks" | "roadmaps" | "ai") => void;
  onOpenAiDrawer: () => void;
  onOpenKeyModal: () => void;
  onOpenTracker: () => void;
  onOpenComposioModal: () => void;
  currentUser: UserAccount | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  matchesCount: number;
  unlocksCount: number;
  applicationsCount: number;
}

export function Navbar({
  activeTab,
  setActiveTab,
  onOpenAiDrawer,
  onOpenKeyModal,
  onOpenTracker,
  onOpenComposioModal,
  currentUser,
  onOpenAuthModal,
  onLogout,
  matchesCount,
  unlocksCount,
  applicationsCount,
}: NavbarProps) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const isGuest = !currentUser || currentUser.isGuest;
  const displayName = currentUser ? currentUser.name : "Guest";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
            <p className="text-[11px] text-slate-400 hidden sm:block">Intelligent Job Matcher &amp; Real-Time Pipeline</p>
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

        {/* Right Actions: Tracker, Integrations, Auth Profile, AI Drawer */}
        <div className="flex items-center gap-2">
          {/* Applications & Pipeline Hub Button */}
          <button
            onClick={onOpenTracker}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-obsidian-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-emerald-400 transition-all shadow-sm"
            title="View Enrolled Jobs & Application Tracker"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Applications</span>
            {applicationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-obsidian-950 font-bold">
                {applicationsCount}
              </span>
            )}
          </button>

          {/* Greenhouse & Composio Sync Trigger */}
          <button
            onClick={onOpenComposioModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
            title="Sync Greenhouse & Composio"
          >
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">Greenhouse</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={onOpenKeyModal}
            title="Configure AI Models &amp; API Keys (Gemini, Groq, OpenAI)"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-cyan-300 border border-slate-700/80 transition-colors"
          >
            <KeyRound className="w-4 h-4" />
          </button>

          {/* Aria AI Coach Trigger */}
          <button
            onClick={onOpenAiDrawer}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60 transition-all shadow-glow hover:shadow-emerald-500/20"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">Aria AI</span>
          </button>

          {/* User Auth Profile / Guest Login Pill */}
          <div className="relative">
            {isGuest ? (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
                title="Sign in to save your resume forever, or continue as guest"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Sign In</span>
                <span className="text-[10px] text-slate-400 hidden lg:inline">(or Guest)</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-obsidian-900 hover:bg-slate-800 border border-emerald-500/40 text-xs font-semibold text-white transition-all shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-[10px] font-black text-obsidian-950">
                    {userInitials}
                  </div>
                  <span className="max-w-[80px] sm:max-w-[110px] truncate">{displayName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-obsidian-900 border border-slate-700/80 shadow-2xl p-3 text-xs space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="pb-2 border-b border-slate-800">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>{displayName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                    </div>

                    <div className="py-1 text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>Resume saved permanently</span>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAuthModal();
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out (Guest Mode)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile sub-bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-obsidian-900/90 py-2 px-2 text-xs">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
            activeTab === "jobs" ? "text-emerald-400 font-bold bg-slate-800" : "text-slate-400"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Jobs
        </button>
        <button
          onClick={() => setActiveTab("unlocks")}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
            activeTab === "unlocks" ? "text-amber-400 font-bold bg-slate-800" : "text-slate-400"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          Unlocks
        </button>
        <button
          onClick={() => setActiveTab("roadmaps")}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-md ${
            activeTab === "roadmaps" ? "text-cyan-400 font-bold bg-slate-800" : "text-slate-400"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          Roadmaps
        </button>
        <button
          onClick={onOpenTracker}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-emerald-400 bg-emerald-500/10"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Tracker ({applicationsCount})
        </button>
      </div>
    </header>
  );
}
