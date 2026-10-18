"use client";

import React from "react";
import { ResumeProfile } from "@/types";
import { User, Award, CheckCircle, Wrench, Sparkles, Terminal } from "lucide-react";

interface ProfileSummaryBarProps {
  profile: ResumeProfile;
}

export function ProfileSummaryBar({ profile }: ProfileSummaryBarProps) {
  const technicalSkills = profile?.technicalSkills || [];
  const toolsAndSoftware = profile?.toolsAndSoftware || [];
  const keyStrengths = profile?.keyStrengths || [];
  const allSkillsCount = technicalSkills.length + toolsAndSoftware.length;
  const initial = profile?.name ? profile.name.trim().charAt(0).toUpperCase() : "U";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      <div className="bg-obsidian-900/90 border border-slate-800 rounded-2xl p-5 shadow-glass backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          {/* Candidate Persona Header */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-indigo-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">{profile?.name || "Candidate"}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {profile?.title || "Professional"}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {profile?.experienceLevel || "Mid"} Level · ~{profile?.yearsOfExperience || 3} yrs exp
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1 max-w-2xl">
                {profile?.summary || "Targeted career profile."}
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-2 self-start lg:self-auto">
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Extracted Skills:</span>
              <span className="font-bold text-white">{allSkillsCount} Detected</span>
            </div>
          </div>
        </div>

        {/* Extracted Skills Chips Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
          {/* Technical Skills */}
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Core Technical Skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {technicalSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Tools & Software */}
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-2">
              <Wrench className="w-3.5 h-3.5 text-indigo-400" />
              <span>Tools & Software</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {toolsAndSoftware.map((tool) => (
                <span
                  key={tool}
                  className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths & Soft Skills */}
          <div>
            <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-2">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Validated Strengths</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-300">
              {keyStrengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{str}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
