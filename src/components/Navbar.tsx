"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Sun,
  Moon,
} from "lucide-react";
import { UserAccount } from "@/types";
import { useTheme } from "@/lib/useTheme";

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
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { isDark, toggleTheme, mounted } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showUserDropdown]);

  const isGuest = !currentUser || currentUser.isGuest;
  const displayName = currentUser ? currentUser.name : "Guest";
  const userInitials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl transition-colors duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none shrink-0" onClick={() => setActiveTab("jobs")}>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 p-[1.5px] shadow-sm">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                Elevate<span className="text-blue-600 dark:text-blue-400">AI</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
              Intelligent Career Matcher &amp; Pipeline
            </p>
          </div>
        </div>

        {/* Central Tab Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700/70">
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "jobs"
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm border border-slate-200/80 dark:border-slate-600"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Job Matches</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 font-bold">
              {matchesCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("unlocks")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "unlocks"
                ? "bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm border border-slate-200/80 dark:border-slate-600"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Skill Unlocks</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 font-bold">
              {unlocksCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("roadmaps")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "roadmaps"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/80 dark:border-slate-600"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Career Blueprints</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "ai"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50"
            }`}
          >
            <MessageSquareCode className="w-3.5 h-3.5" />
            <span>AI Career Coach</span>
          </button>
        </nav>

        {/* Right Actions: Theme Toggle, Tracker, Greenhouse, API Key, AI Drawer, Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all shadow-sm"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle Theme"
          >
            {mounted && isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Applications & Pipeline Hub Button (hidden on mobile top bar to prevent overflow; available in bottom sub-bar & floating button) */}
          <button
            onClick={onOpenTracker}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
            title="View Enrolled Jobs & Application Tracker"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Applications</span>
            {applicationsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white font-bold">
                {applicationsCount}
              </span>
            )}
          </button>

          {/* Greenhouse & ATS Sync Trigger */}
          <button
            onClick={onOpenComposioModal}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700/60 text-xs font-semibold transition-all"
            title="Sync Greenhouse & Composio"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Greenhouse</span>
          </button>

          {/* API Key Modal Button (hidden on mobile, available on sm+) */}
          <button
            onClick={onOpenKeyModal}
            title="Configure AI Models & API Keys (Gemini, Groq, OpenAI)"
            className="hidden sm:flex p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
          </button>

          {/* Zara AI Coach Trigger */}
          <button
            onClick={onOpenAiDrawer}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all shadow-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-xs">Zara AI</span>
          </button>

          {/* User Auth Profile / Guest Login Pill */}
          <div className="relative">
            {isGuest ? (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all shadow-sm"
                title="Sign in to save your resume forever, or continue as guest"
              >
                <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span className="hidden sm:inline">Sign In</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 hidden lg:inline">(or Guest)</span>
              </button>
            ) : (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-blue-300 dark:border-blue-700 text-xs font-semibold text-slate-900 dark:text-white transition-all shadow-sm"
                >
                  <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shrink-0">
                    {userInitials}
                  </div>
                  <span className="hidden sm:inline max-w-[110px] truncate">{displayName}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:inline" />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl p-3 text-xs space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{displayName}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</div>
                    </div>

                    <div className="py-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Resume saved permanently</span>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAuthModal();
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Switch Account</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-2"
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

      {/* Mobile sub-bar: 4 equal grid columns, zero horizontal overflow */}
      <div className="md:hidden grid grid-cols-4 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 py-1.5 px-1 text-xs">
        <button
          onClick={() => setActiveTab("jobs")}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-lg transition-colors ${
            activeTab === "jobs" ? "text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-slate-800" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span className="text-[10px] leading-tight">Jobs</span>
        </button>
        <button
          onClick={() => setActiveTab("unlocks")}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-lg transition-colors ${
            activeTab === "unlocks" ? "text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-slate-800" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="text-[10px] leading-tight">Unlocks</span>
        </button>
        <button
          onClick={() => setActiveTab("roadmaps")}
          className={`flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-lg transition-colors ${
            activeTab === "roadmaps" ? "text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-slate-800" : "text-slate-600 dark:text-slate-400"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="text-[10px] leading-tight">Roadmaps</span>
        </button>
        <button
          onClick={onOpenTracker}
          className="flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-lg text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold transition-colors"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span className="text-[10px] leading-tight truncate max-w-full">Tracker ({applicationsCount})</span>
        </button>
      </div>
    </header>
  );
}
