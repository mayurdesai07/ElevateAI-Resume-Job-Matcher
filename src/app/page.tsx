"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SAMPLE_RESUMES } from "@/data/mockResumes";
import { MASTER_CAREER_BLUEPRINTS } from "@/data/careerBlueprints";
import { calculateJobMatches, generateOneSkillUnlocks } from "@/lib/parser";
import { ResumeProfile, JobMatch } from "@/types";

import { Navbar } from "@/components/Navbar";
import { HeroDropzone } from "@/components/HeroDropzone";
import { ProfileSummaryBar } from "@/components/ProfileSummaryBar";
import { JobMatchesTab } from "@/components/JobMatchesTab";
import { OneSkillUnlockTab } from "@/components/OneSkillUnlockTab";
import { CareerExplorerTab } from "@/components/CareerExplorerTab";
import { AiCareerCoachFullTab } from "@/components/AiCareerCoachFullTab";
import { AiCareerCoachDrawer } from "@/components/AiCareerCoachDrawer";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { ApplicationTrackerDrawer } from "@/components/ApplicationTrackerDrawer";
import { ComposioModal } from "@/components/ComposioModal";
import { useApplicationTracker } from "@/lib/useApplicationTracker";
import { Sparkles } from "lucide-react";

export default function Home() {
  // Candidate profile state (defaulting to Alex Rivera - Data Analyst)
  const [profile, setProfile] = useState<ResumeProfile>(SAMPLE_RESUMES.alex_data_analyst);
  const [activeTab, setActiveTab] = useState<"jobs" | "unlocks" | "roadmaps" | "ai">("jobs");
  const [activeBlueprintId, setActiveBlueprintId] = useState<string>("data-analyst");

  // Real-time job matches state
  const [liveJobs, setLiveJobs] = useState<JobMatch[]>(() => calculateJobMatches(profile));
  const [isRefreshingJobs, setIsRefreshingJobs] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("Bengaluru");
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  // Application tracker state & hooks
  const {
    applications,
    enrollAndApply,
    saveJob,
    updateApplication,
    removeApplication,
    isEnrolled,
    isSaved,
    bulkIngestGreenhouseApplications,
  } = useApplicationTracker();

  // Drawers & Modals state
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isTrackerDrawerOpen, setIsTrackerDrawerOpen] = useState(false);
  const [isComposioModalOpen, setIsComposioModalOpen] = useState(false);
  const [injectedAiPrompt, setInjectedAiPrompt] = useState<string>("");

  // Dynamically compute 1-Skill Unlocks and Blueprint
  const oneSkillUnlocks = generateOneSkillUnlocks(profile);
  const activeBlueprint = MASTER_CAREER_BLUEPRINTS[activeBlueprintId] || MASTER_CAREER_BLUEPRINTS["data-analyst"];

  // Fetch live jobs from /api/jobs (LinkedIn Live, Jobicy, Greenhouse)
  const fetchLiveJobs = useCallback(async (currentProfile: ResumeProfile, location: string = selectedLocation) => {
    setIsRefreshingJobs(true);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile: currentProfile, location }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setLiveJobs(data.jobs);
          setLastRefreshedAt(new Date());
        }
      }
    } catch (e) {
      console.warn("Live jobs fetch error, falling back to local calculation:", e);
      setLiveJobs(calculateJobMatches(currentProfile));
    } finally {
      setIsRefreshingJobs(false);
    }
  }, [selectedLocation]);

  // Ingest live jobs on initial load and when profile changes
  useEffect(() => {
    fetchLiveJobs(profile, selectedLocation);
  }, [profile, selectedLocation, fetchLiveJobs]);

  // Hourly automated job discovery loop (every 60 minutes)
  useEffect(() => {
    const ONE_HOUR_MS = 60 * 60 * 1000;
    const interval = setInterval(() => {
      fetchLiveJobs(profile, selectedLocation);
    }, ONE_HOUR_MS);

    return () => clearInterval(interval);
  }, [profile, selectedLocation, fetchLiveJobs]);

  const handleSelectLocation = (loc: string) => {
    setSelectedLocation(loc);
    fetchLiveJobs(profile, loc);
  };

  const handleOpenAiWithPrompt = (promptText: string) => {
    setInjectedAiPrompt(promptText);
    setIsAiDrawerOpen(true);
  };

  // Sync custom Greenhouse boards from Composio modal
  const handleSyncGreenhouse = async (boardTokens: string[]) => {
    await fetchLiveJobs(profile);
    const mockSynced = boardTokens.map((token) => ({
      jobTitle: `Specialist at ${token.toUpperCase()}`,
      company: token.charAt(0).toUpperCase() + token.slice(1),
      location: "San Francisco / Remote",
      salaryRange: "$145k–$185k",
      url: `https://boards.greenhouse.io/${token}`,
      source: `Greenhouse (${token}) via Composio`,
      status: "applied" as const,
      notes: `Synced from your connected Greenhouse account (${token} board).`,
      recruiterResponse: "Application active in company ATS pipeline.",
    }));
    bulkIngestGreenhouseApplications(mockSynced);
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
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        onOpenTracker={() => setIsTrackerDrawerOpen(true)}
        onOpenComposioModal={() => setIsComposioModalOpen(true)}
        matchesCount={liveJobs.length}
        unlocksCount={oneSkillUnlocks.length}
        applicationsCount={applications.length}
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
            <JobMatchesTab
              jobs={liveJobs}
              profile={profile}
              selectedLocation={selectedLocation}
              onSelectLocation={handleSelectLocation}
              isRefreshing={isRefreshingJobs}
              onRefresh={() => fetchLiveJobs(profile, selectedLocation)}
              lastRefreshedAt={lastRefreshedAt}
              onEnrollAndApply={enrollAndApply}
              onSaveJob={saveJob}
              isEnrolled={isEnrolled}
              isSaved={isSaved}
              onOpenTracker={() => setIsTrackerDrawerOpen(true)}
            />
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
              jobMatches={liveJobs}
              oneSkillUnlocks={oneSkillUnlocks}
              activeBlueprint={activeBlueprint}
            />
          )}
        </div>
      </main>

      {/* Application & Pipeline Hub Drawer (Side Panel) */}
      <ApplicationTrackerDrawer
        isOpen={isTrackerDrawerOpen}
        onClose={() => setIsTrackerDrawerOpen(false)}
        applications={applications}
        onUpdateStatus={(id, status) => updateApplication(id, { status })}
        onUpdateNotes={(id, notes, recruiterResponse) => updateApplication(id, { notes, recruiterResponse })}
        onRemove={removeApplication}
        onAskAriaAboutJob={(jobTitle, company, status) =>
          handleOpenAiWithPrompt(
            `I applied to ${jobTitle} at ${company} (status: ${status}). What should I do next, and can you help me prepare for interview questions and recruiter follow-ups?`
          )
        }
        onOpenComposioModal={() => {
          setIsTrackerDrawerOpen(false);
          setIsComposioModalOpen(true);
        }}
      />

      {/* Composio & Greenhouse Integration Modal */}
      <ComposioModal
        isOpen={isComposioModalOpen}
        onClose={() => setIsComposioModalOpen(false)}
        onSyncGreenhouse={handleSyncGreenhouse}
      />

      {/* Slide-over persistent AI Assistant Drawer */}
      <AiCareerCoachDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        profile={profile}
        jobMatches={liveJobs}
        oneSkillUnlocks={oneSkillUnlocks}
        activeBlueprint={activeBlueprint}
        initialPrompt={injectedAiPrompt}
        onClearInitialPrompt={() => setInjectedAiPrompt("")}
      />

      {/* API Key & AI Engine Configuration Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
      />

      {/* Persistent Floating AI Action Button (Bottom Right) */}
      <aside aria-label="Quick Actions" className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <button
          onClick={() => setIsTrackerDrawerOpen(true)}
          className="flex items-center gap-2 px-3.5 py-3 rounded-2xl bg-obsidian-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700/80 shadow-glass transition-all"
          title="Open Application Tracker"
        >
          <span>📋 Tracker</span>
          {applications.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-emerald-500 text-obsidian-950 flex items-center justify-center font-black text-[10px]">
              {applications.length}
            </span>
          )}
        </button>

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
            <span>— Intelligent Resume Job Matcher &amp; Real-Time Pipeline</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Live Job Feeds (Jobicy &amp; Greenhouse)</span>
            <span>•</span>
            <span>Composio Connected</span>
            <span>•</span>
            <span>Next.js 14 App Router</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
