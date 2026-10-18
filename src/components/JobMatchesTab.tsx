"use client";

import React, { useState } from "react";
import { JobMatch, ResumeProfile } from "@/types";
import { Search, MapPin, DollarSign, Building, Sparkles, Send, Filter, CheckCircle2, AlertCircle } from "lucide-react";
import { TailorPitchModal } from "./TailorPitchModal";

interface JobMatchesTabProps {
  jobs: JobMatch[];
  profile: ResumeProfile;
}

export function JobMatchesTab({ jobs, profile }: JobMatchesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  const [selectedJobForPitch, setSelectedJobForPitch] = useState<JobMatch | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.matchedSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesWorkplace =
      filterType === "All" || job.workplaceType.toLowerCase() === filterType.toLowerCase();

    return matchesSearch && matchesWorkplace;
  });

  return (
    <div className="space-y-6">
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
            Ranked by percentage match against {profile.name}'s extracted profile
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

          return (
            <div
              key={job.id}
              className="bg-obsidian-900/90 border border-slate-800 rounded-2xl p-5 shadow-glass glass-panel-hover flex flex-col justify-between"
            >
              <div>
                {/* Top Row: Title, Company, Match Ring */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base text-white hover:text-emerald-300 transition-colors cursor-pointer">
                        {job.title}
                      </span>
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

                  {job.missingSkills.length > 0 && (
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

              {/* Bottom Actions */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedJobForPitch(job)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tailor Resume Pitch</span>
                </button>

                <button
                  onClick={() => {
                    alert(`Application submitted to ${job.company} for ${job.title}! Best of luck!`);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-obsidian-950 font-bold transition-all shadow-glow"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Quick Apply</span>
                </button>
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
