"use client";

import React, { useState } from "react";
import { SAMPLE_RESUMES } from "@/data/mockResumes";
import { MASTER_CAREER_BLUEPRINTS } from "@/data/careerBlueprints";
import { calculateJobMatches, generateOneSkillUnlocks } from "@/lib/parser";
import { ResumeProfile } from "@/types";

import { Navbar } from "@/components/Navbar";
import { HeroDropzone } from "@/components/HeroDropzone";
import { ProfileSummaryBar } from "@/components/ProfileSummaryBar";
import { JobMatchesTab } from "@/components/JobMatchesTab";
import { OneSkillUnlockTab } from "@/components/OneSkillUnlockTab";
import { CareerExplorerTab } from "@/components/CareerExplorerTab";
import { AiCareerCoachFullTab } from "@/components/AiCareerCoachFullTab";
import { AiCareerCoachDrawer } from "@/components/AiCareerCoachDrawer";
import { Sparkles, ArrowUp } from "lucide-react";

export default function Home() {
  // Candidate profile state (defaulting to Alex Rivera - Data Analyst)
  const [profile, setProfile] = useState<ResumeProfile>(SAMPLE_RESUMES.alex_data_analyst);
  const [activeTab, setActiveTab] = useState<"jobs" | "unlocks" | "roadmaps" | "ai">("jobs");
  const [activeBlueprintId, setActiveBlueprintId] = useState<string>("data-analyst");

  // AI Drawer state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [injectedAiPrompt, setInjectedAiPrompt] = useState<string>("");

  // Dynamically compute matches and unlocks based on current active profile
  const jobMatches = calculateJobMatches(profile);
  const oneSkillUnlocks = generateOneSkillUnlocks(profile);
  const activeBlueprint = MASTER_CAREER_BLUEPRINTS[activeBlueprintId] || MASTER_CAREER_BLUEPRINTS["data-analyst"];

  const handleOpenAiWithPrompt = (promptText: string) => {
    setInjectedAiPrompt(promptText);
    setIsAiDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-obsidian-950">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiDrawer={() => {
          setInjectedAiPrompt("");
          setIsAiDrawerOpen(true);
        }}
        matchesCount={jobMatches.length}
        unlocksCount={oneSkillUnlocks.length}
      />

      {/* Main Body */}
      <main className="flex-1 pb-20">
        {/* Hero & Resume Dropzone */}
        <HeroDropzone
          activeProfile={profile}
          onProfileLoaded={(newProfile) => {
            setProfile(newProfile);
          }}
        />

        {/* Extracted Profile Summary Card */}
        <ProfileSummaryBar profile={profile} />

        {/* Dynamic Tab Views */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {activeTab === "jobs" && (
            <JobMatchesTab jobs={jobMatches} profile={profile} />
          )}

          {activeTab === "unlocks" && (
            <OneSkillUnlockTab
              unlocks={oneSkillUnlocks}
              profile={profile}
              onAskAiAboutSkill={handleOpenAiWithPrompt}
            />
          )}

          {activeTab === "roadmaps" && (
            <CareerExplorerTab
              profile={profile}
              selectedBlueprintId={activeBlueprintId}
              onSelectBlueprintId={setActiveBlueprintId}
              onAskAiAboutRole={handleOpenAiWithPrompt}
            />
          )}

          {activeTab === "ai" && (
            <AiCareerCoachFullTab
              profile={profile}
              jobMatches={jobMatches}
              oneSkillUnlocks={oneSkillUnlocks}
              activeBlueprint={activeBlueprint}
            />
          )}
        </div>
      </main>

      {/* Slide-over persistent AI Assistant Drawer */}
      <AiCareerCoachDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        profile={profile}
        jobMatches={jobMatches}
        oneSkillUnlocks={oneSkillUnlocks}
        activeBlueprint={activeBlueprint}
        initialPrompt={injectedAiPrompt}
      />

      {/* Persistent Floating AI Action Button (Bottom Right) */}
      <aside aria-label="Quick Actions" className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => {
            setInjectedAiPrompt("");
            setIsAiDrawerOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:scale-105 text-white font-bold text-xs shadow-glow transition-all"
        >
          <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
          <span>Ask Aria AI</span>
        </button>
      </aside>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-obsidian-950 py-8 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">ElevateAI</span>
            <span>— Intelligent Resume Job Matcher & Skill Unlock</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Production Vercel Ready</span>
            <span>•</span>
            <span>Next.js 14 App Router</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
