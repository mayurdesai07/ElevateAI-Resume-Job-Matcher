"use client";

import React, { useState } from "react";
import { JobMatch, ResumeProfile } from "@/types";
import {
  Search,
  MapPin,
  DollarSign,
  Building,
  Sparkles,
  Send,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  RefreshCw,
  Globe2,
  Check,
  Briefcase
} from "lucide-react";
import { TailorPitchModal } from "./TailorPitchModal";

interface JobMatchesTabProps {
  jobs: JobMatch[];
  profile: ResumeProfile;
  onEnrollAndApply: (job: JobMatch) => void;
  onSaveJob: (job: JobMatch) => void;
  isEnrolled: (jobId: string) => boolean;
  isSaved: (jobId: string) => boolean;
  onOpenTracker: () => void;
  onRefreshLiveJobs?: () => Promise<void>;
  isRefreshingJobs?: boolean;
}

export function JobMatchesTab({
  jobs,
  profile,
  onEnrollAndApply,
  onSaveJob,
  isEnrolled,
  isSaved,
  onOpenTracker,
  onRefreshLiveJobs,
  isRefreshingJobs = false,
}: JobMatchesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSource, setFilterSource] = useState<string>("All");
  const [selectedJobForPitch, setSelectedJobForPitch] = useState<JobMatch | null>(null);
  const [appliedToast, setAppliedToast] = useState<{ title: string; company: string } | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.matchedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSource =
      filterSource === "All" ||
      (filterSource === "Greenhouse" && job.source?.toLowerCase().includes("greenhouse")) ||
      (filterSource === "Jobicy" && job.source?.toLowerCase().includes("jobicy")) ||
      (filterSource === "Remote" && job.workplaceType.toLowerCase() === "remote");

    return matchesSearch && matchesSource;
  });

  const handleApplyClick = (job: JobMatch) => {
    onEnrollAndApply(job);
    setAppliedToast({ title: job.title, company: job.company });
    setTimeout(() => {
      setAppliedToast(null);
    }, 4000);
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
            <div className="font-bold text-emerald-400">Enrolled &amp; Applied!</div>
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

      {/* Live Data Ingestion Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-obsidian-900 to-indigo-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-200">
            <strong className="text-emerald-400">Real-Time Ingestion Active:</strong> Aggregating live job feeds from{" "}
            <strong>Jobicy Remote API</strong>, <strong>Greenhouse Public Boards (Figma, Discord, Datadog, GitLab)</strong>, and verified market postings.
          </span>
        </div>

        {onRefreshLiveJobs && (
          <button
            onClick={() => onRefreshLiveJobs()}
            disabled={isRefreshingJobs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshingJobs ? "animate-spin" : ""}`} />
            <span>{isRefreshingJobs ? "Fetching Live Feeds..." : "Refresh Live Feeds"}</span>
          </button>
        )}
      </div>

      {/* Search & Filter Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-obsidian-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search roles, companies, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-obsidian-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Source & Type filter pills */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end overflow-x-auto">
          <span className="text-xs text-slate-400 hidden lg:inline">Feed Source:</span>
          {[
            { label: "All Feeds", id: "All" },
            { label: "Greenhouse Boards", id: "Greenhouse" },
            { label: "Jobicy Live", id: "Jobicy" },
            { label: "100% Remote", id: "Remote" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setFilterSource(type.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                filterSource === type.id
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-slate-800/60 text-slate-400 hover:text-white border border-slate-700/60"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Headline & Results Count */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Direct Live Job Matches</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Live &amp; Ready to Enroll
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by AI match score against {profile.name}&apos;s verified skills
          </p>
        </div>
        <div className="text-xs text-slate-400">
          Showing <span className="font-semibold text-white">{filteredJobs.length}</span> positions
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredJobs.map((job) => {
          // Circular progress math
          const radius = 22;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (job.matchScore / 100) * circumference;

          const enrolled = isEnrolled(job.id);
          const saved = isSaved(job.id);

          return (
            <div
              key={job.id}
              className={`bg-obsidian-900/90 border rounded-2xl p-5 shadow-glass glass-panel-hover flex flex-col justify-between transition-all ${
                enrolled ? "border-emerald-500/50 bg-emerald-950/10" : "border-slate-800"
              }`}
            >
              <div>
                {/* Top Row: Title, Company, Source Tag, Match Ring */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base text-white hover:text-emerald-300 transition-colors">
                        {job.title}
                      </span>
                      {job.source && (
                        <span className="px-2 py-0.2 rounded-md bg-slate-800/90 text-slate-300 text-[10px] font-mono border border-slate-700">
                          {job.source}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1">
                        <Building className="w-3.5 h-3.5" />
                        {job.company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="px-2 py-0.2 rounded-full text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                        {job.workplaceType}
                      </span>
                    </div>
                  </div>

                  {/* Circular Match Ring Badge */}
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
                          job.matchScore >= 90
                            ? "text-emerald-400"
                            : job.matchScore >= 80
                            ? "text-teal-400"
                            : "text-amber-400"
                        }
                        fill="transparent"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-xs font-black text-white">{job.matchScore}%</span>
                      <span className="text-[8px] font-bold uppercase text-slate-400">FIT</span>
                    </div>
                  </div>
                </div>

                {/* Salary & Level Tags */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <div className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>{job.salaryRange}</span>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                    {job.experienceLevel} Tier
                  </span>
                  <span className="text-xs text-slate-400">
                    {job.applicantsCount} applicants · Posted {job.postedDaysAgo}d ago
                  </span>
                </div>

                {/* AI "Why You Fit" Box */}
                <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Why You Fit:</span>
                  </div>
                  <p className="leading-relaxed text-slate-300">{job.whyYouFit}</p>
                </div>

                {/* Skills tags: Matched vs Missing */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-medium text-slate-400">Matched:</span>
                    {job.matchedSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium text-[11px] flex items-center gap-1"
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
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all"
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
