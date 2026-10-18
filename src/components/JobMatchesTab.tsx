"use client";

import React, { useState, useEffect } from "react";
import { JobMatch, ResumeProfile } from "@/types";
import {
  Search,
  MapPin,
  DollarSign,
  Building,
  Sparkles,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  Check,
  RefreshCw,
  Clock,
  Radio,
  Navigation
} from "lucide-react";
import { TailorPitchModal } from "./TailorPitchModal";

interface JobMatchesTabProps {
  jobs: JobMatch[];
  profile: ResumeProfile;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  isRefreshing: boolean;
  onRefresh: () => void;
  lastRefreshedAt: Date;
  onEnrollAndApply: (job: JobMatch) => void;
  onSaveJob: (job: JobMatch) => void;
  isEnrolled: (jobId: string) => boolean;
  isSaved: (jobId: string) => boolean;
  onOpenTracker: () => void;
}

const PRESET_LOCATIONS = [
  { label: "📍 Near Me (Bengaluru)", value: "Bengaluru" },
  { label: "Mangaluru", value: "Mangaluru" },
  { label: "Mysuru", value: "Mysore" },
  { label: "Pan-India", value: "India" },
  { label: "Remote / Global", value: "Remote" },
];

export function JobMatchesTab({
  jobs,
  profile,
  selectedLocation,
  onSelectLocation,
  isRefreshing,
  onRefresh,
  lastRefreshedAt,
  onEnrollAndApply,
  onSaveJob,
  isEnrolled,
  isSaved,
  onOpenTracker,
}: JobMatchesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [customLocationInput, setCustomLocationInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [selectedJobForPitch, setSelectedJobForPitch] = useState<JobMatch | null>(null);
  const [appliedToast, setAppliedToast] = useState<{ title: string; company: string; url?: string } | null>(null);

  // Hourly countdown timer (3600 seconds)
  const [secondsUntilNextRefresh, setSecondsUntilNextRefresh] = useState(3600);

  useEffect(() => {
    const updateCountdown = () => {
      const elapsedSeconds = Math.floor((Date.now() - lastRefreshedAt.getTime()) / 1000);
      const remaining = Math.max(0, 3600 - (elapsedSeconds % 3600));
      setSecondsUntilNextRefresh(remaining);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [lastRefreshedAt]);

  const formatCountdown = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;
  };

  // Filter jobs by text search and workplace type
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.matchedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesWorkplace =
      filterType === "All" || job.workplaceType.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesWorkplace;
  });

  // Sort jobs:
  // 1. Unapplied NEW jobs at the top
  // 2. Unapplied other jobs by match score
  // 3. Enrolled/applied jobs sink gracefully to the bottom
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const aEnrolled = isEnrolled(a.id);
    const bEnrolled = isEnrolled(b.id);

    if (aEnrolled && !bEnrolled) return 1;
    if (!aEnrolled && bEnrolled) return -1;

    if (a.isNew && !b.isNew) return -1;
    if (!a.isNew && b.isNew) return 1;

    return b.matchScore - a.matchScore;
  });

  const handleApplyClick = (job: JobMatch) => {
    onEnrollAndApply(job);
    setAppliedToast({ title: job.title, company: job.company, url: job.url });

    // Open the actual live job listing in a new browser tab
    if (job.url) {
      window.open(job.url, "_blank", "noopener,noreferrer");
    }

    setTimeout(() => {
      setAppliedToast(null);
    }, 5000);
  };

  const handleCustomLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocationInput.trim()) {
      onSelectLocation(customLocationInput.trim());
      setShowCustomInput(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification when 1-Click Enrolled */}
      {appliedToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-obsidian-900 border border-emerald-500/50 shadow-glow text-white text-xs flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-obsidian-950 font-black">
            <Check className="w-4 h-4 stroke-[3]" />
          </div>
          <div>
            <div className="font-bold text-emerald-400">Enrolled &amp; Opening Application!</div>
            <div className="text-slate-300">
              {appliedToast.title} at {appliedToast.company}
            </div>
            <button
              onClick={onOpenTracker}
              className="text-[11px] text-cyan-400 hover:underline font-semibold mt-0.5 block"
            >
              View in Applications Side Panel →
            </button>
          </div>
        </div>
      )}

      {/* Hourly Automation Radar Status Bar */}
      <div className="bg-gradient-to-r from-obsidian-900 via-obsidian-900 to-emerald-950/40 p-4 rounded-2xl border border-emerald-500/20 shadow-glass flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400">Automated Job Radar Active</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Hourly Ingestion
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Next automatic refresh in:</span>
              <span className="font-mono font-semibold text-emerald-400">
                {formatCountdown(secondsUntilNextRefresh)}
              </span>
              <span className="text-slate-500">· Scans LinkedIn, Greenhouse &amp; Public ATS</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-emerald-400" : ""}`} />
            <span>{isRefreshing ? "Scanning..." : "Refresh Now"}</span>
          </button>
        </div>
      </div>

      {/* Location Filter & Workplace Toolbar */}
      <div className="bg-obsidian-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
        {/* Preset Locations Pills */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Navigation className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-slate-300">Target Location:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_LOCATIONS.map((loc) => {
              const isActive =
                selectedLocation.toLowerCase() === loc.value.toLowerCase() ||
                (loc.value === "Bengaluru" && selectedLocation.toLowerCase().includes("bengaluru"));
              return (
                <button
                  key={loc.value}
                  onClick={() => onSelectLocation(loc.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-obsidian-950 shadow-glow"
                      : "bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/70"
                  }`}
                >
                  {loc.label}
                </button>
              );
            })}

            {/* Custom Location Toggle */}
            <button
              onClick={() => setShowCustomInput(!showCustomInput)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
            >
              + Other City
            </button>
          </div>
        </div>

        {/* Custom Location Input Bar (Expandable) */}
        {showCustomInput && (
          <form onSubmit={handleCustomLocationSubmit} className="flex items-center gap-2 pt-2 border-t border-slate-800">
            <div className="relative flex-1">
              <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter city (e.g. Hyderabad, Pune, Mumbai, Chennai)..."
                value={customLocationInput}
                onChange={(e) => setCustomLocationInput(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-obsidian-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 transition-all"
            >
              Search
            </button>
          </form>
        )}

        {/* Search & Workplace Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800/60">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by role, company, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-obsidian-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <span className="text-xs text-slate-400 hidden lg:inline">Workplace:</span>
            {["All", "Remote", "Hybrid"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  filterType === type
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Headline & Results Count */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Direct Job Matches</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Ready to Apply Now
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Active verified roles matched against {profile.name}&apos;s profile in{" "}
            <span className="text-emerald-400 font-semibold">{selectedLocation}</span>
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white">{sortedJobs.length}</span> positions
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sortedJobs.map((job) => {
          // Circular progress math
          const radius = 22;
          const circumference = 2 * Math.PI * radius;
          const safeScore =
            typeof job.matchScore === "number" && !isNaN(job.matchScore)
              ? Math.min(100, Math.max(0, Math.round(job.matchScore)))
              : 82;
          const strokeDashoffset = circumference - (safeScore / 100) * circumference;

          const enrolled = isEnrolled(job.id);
          const saved = isSaved(job.id);

          return (
            <div
              key={job.id}
              className={`bg-obsidian-900/90 border rounded-2xl p-5 shadow-glass glass-panel-hover flex flex-col justify-between transition-all ${
                enrolled
                  ? "border-emerald-500/50 bg-emerald-950/10 opacity-85"
                  : job.isNew
                  ? "border-amber-500/40 bg-gradient-to-b from-amber-950/10 to-obsidian-900"
                  : "border-slate-800"
              }`}
            >
              <div>
                {/* Top Row: Title, Fresh Badge, Company Details & Circular Percentage Ring */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-white hover:text-emerald-300 transition-colors">
                        {job.title}
                      </h3>
                      {job.isNew && !enrolled && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-orange-500 text-obsidian-950 uppercase tracking-wider animate-pulse">
                          ✨ NEW
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 text-xs text-slate-400 flex-wrap">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {job.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                        {job.workplaceType}
                      </span>
                    </div>
                  </div>

                  {/* Circular Match Ring Badge (Top Right) */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg className="w-14 h-14 -rotate-90">
                      <circle
                        cx="28"
                        cy="28"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        className="text-slate-800"
                        fill="transparent"
                      />
                      <circle
                        cx="28"
                        cy="28"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className={
                          safeScore >= 90
                            ? "text-emerald-400"
                            : safeScore >= 80
                            ? "text-teal-400"
                            : "text-amber-400"
                        }
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xs font-black text-white">{safeScore}%</span>
                      <span className="text-[8px] font-bold uppercase text-slate-400">FIT</span>
                    </div>
                  </div>
                </div>

                {/* Salary, Level & Application Metadata */}
                <div className="mt-3.5 flex items-center gap-2 flex-wrap">
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{job.salaryRange}</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                    {job.experienceLevel} Tier
                  </span>
                  <span className="text-xs text-slate-400">
                    {job.applicantsCount} applicants · {job.postedDaysAgo === 0 ? "Just posted today" : `Posted ${job.postedDaysAgo}d ago`}
                  </span>
                </div>

                {/* AI "Why You Fit" Box */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Why You Fit:</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">{job.whyYouFit}</p>
                </div>

                {/* Skills tags: Matched vs Missing */}
                <div className="mt-3.5 space-y-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-medium text-slate-400">Matched:</span>
                    {job.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium text-[11px] flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        {s}
                      </span>
                    ))}
                  </div>

                  {job.missingSkills && job.missingSkills.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-medium text-slate-500">Unmatched:</span>
                      {job.missingSkills.map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-400 border border-slate-700 font-medium text-[11px]"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions: 1-Click Enroll & Apply, Bookmark, Tailor Pitch */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJobForPitch(job)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Tailor Pitch</span>
                  </button>

                  <button
                    onClick={() => onSaveJob(job)}
                    title={saved ? "Saved in Application Hub" : "Save for later"}
                    className={`p-2 rounded-xl border transition-all ${
                      saved
                        ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                        : "bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-cyan-400 text-cyan-400" : ""}`} />
                  </button>
                </div>

                {/* 1-Click Enroll & Apply Button */}
                {enrolled ? (
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                      <span>Enrolled &amp; Applied</span>
                    </span>
                    <button
                      onClick={onOpenTracker}
                      className="text-xs text-cyan-400 hover:underline font-semibold"
                    >
                      Track Status →
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApplyClick(job)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-obsidian-950 transition-all shadow-glow"
                  >
                    <span>1-Click Enroll &amp; Apply</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tailor Pitch Modal */}
      {selectedJobForPitch && (
        <TailorPitchModal
          job={selectedJobForPitch}
          profile={profile}
          onClose={() => setSelectedJobForPitch(null)}
        />
      )}
    </div>
  );
}
