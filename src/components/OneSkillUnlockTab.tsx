"use client";

import React from "react";
import { OneSkillUnlock, ResumeProfile } from "@/types";
import { Zap, TrendingUp, ArrowRight, BookOpen, Laptop, Clock, CheckCircle2, AlertTriangle, Sparkles, Award, ExternalLink } from "lucide-react";

interface OneSkillUnlockTabProps {
  unlocks: OneSkillUnlock[];
  profile: ResumeProfile;
  onAskAiAboutSkill: (skillOrRole: string) => void;
}

export function OneSkillUnlockTab({
  unlocks,
  profile,
  onAskAiAboutSkill,
}: OneSkillUnlockTabProps) {
  return (
    <div className="space-y-8">
      {/* High-ROI Headline Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-indigo-500/10 border border-amber-500/30 p-6 backdrop-blur-md shadow-glass">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-500/30">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>High-ROI Opportunities Detected</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            The "One-Skill Unlock" Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Roles where you already possess <strong className="text-emerald-400">80%–90% of the required skills</strong> and are only missing <strong className="text-amber-400">1 or 2 critical tools</strong> to qualify for senior salary bands.
          </p>
        </div>
      </div>

      {/* Unlock Cards List */}
      <div className="space-y-6">
        {unlocks.map((unlock) => {
          const currentSalaryFormatted = `$${(unlock.currentEstimatedSalary / 1000).toFixed(0)}k`;
          const unlockedSalaryFormatted = `$${(unlock.unlockedEstimatedSalary / 1000).toFixed(0)}k`;
          const dollarIncrease = unlock.unlockedEstimatedSalary - unlock.currentEstimatedSalary;
          const currentPercentWidth = Math.round(
            (unlock.currentEstimatedSalary / unlock.unlockedEstimatedSalary) * 100
          );

          return (
            <div
              key={unlock.id}
              className="bg-obsidian-900/95 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-6 shadow-glass transition-all glass-panel-hover"
            >
              {/* Card Header: Target Role & Salary Boost Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Target Role Unlock:
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white hover:text-amber-300 transition-colors">
                      {unlock.targetRole}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Based on your active foundation as <span className="text-slate-200 font-semibold">{unlock.currentRole}</span>
                  </p>
                </div>

                {/* Boost Pill */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-500/40 text-amber-300 font-black text-sm flex items-center gap-1.5 shadow-glow">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>+{unlock.salaryBoostPercent}% Salary Jump</span>
                    <span className="text-xs text-slate-400 font-normal">
                      (+${(dollarIncrease / 1000).toFixed(0)}k/yr)
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Salary Comparison Bar */}
              <div className="mt-5 p-4 rounded-xl bg-obsidian-950/70 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Current Market Potential: <strong className="text-slate-200">{currentSalaryFormatted}</strong></span>
                  <span className="text-emerald-400 font-bold">Unlocked Potential: {unlockedSalaryFormatted}+</span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden relative">
                  <div
                    style={{ width: `${currentPercentWidth}%` }}
                    className="h-full bg-slate-600 rounded-full"
                  />
                  <div
                    style={{ width: "100%" }}
                    className="absolute inset-0 h-full bg-gradient-to-r from-transparent via-amber-500/40 to-emerald-500 rounded-full"
                  />
                </div>
              </div>

              {/* The Missing Link Highlight */}
              <div className="mt-5 p-4 rounded-xl bg-amber-500/5 border border-amber-500/30">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>The Missing Link:</span>
                </div>
                <div className="text-sm font-semibold text-white">
                  {unlock.headline}
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {unlock.unlockReasoning}
                </p>

                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-slate-400">Missing Critical Skills:</span>
                  {unlock.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs"
                    >
                      ★ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actionable Bridge Plan Bento */}
              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Recommended Courses */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <BookOpen className="w-4 h-4 text-emerald-400" />
                      <span>Recommended Fast-Track Courses</span>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {unlock.bridgePlan.estimatedTimeToLearn}
                    </span>
                  </div>

                  <div className="space-y-2 mt-3">
                    {unlock.bridgePlan.recommendedCourses.map((c, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-obsidian-900 border border-slate-800 text-xs flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-semibold text-white">{c.name}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>{c.platform}</span>
                            <span>•</span>
                            <span>{c.duration}</span>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            c.isFree
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          }`}
                        >
                          {c.isFree ? "FREE" : "CERTIFIED"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Portfolio Project to Prove It */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 mb-2">
                    <Laptop className="w-4 h-4 text-indigo-400" />
                    <span>Portfolio Proof Project</span>
                  </div>

                  <div className="text-xs font-bold text-white">
                    {unlock.bridgePlan.portfolioProject.title}
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {unlock.bridgePlan.portfolioProject.description}
                  </p>

                  <div className="mt-3 p-2.5 rounded-lg bg-obsidian-900 border border-slate-800 text-[11px] space-y-1">
                    <div>
                      <span className="text-slate-400">Deliverable: </span>
                      <span className="text-slate-200">{unlock.bridgePlan.portfolioProject.deliverable}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-semibold">Resume Impact: </span>
                      <span className="text-slate-300">{unlock.bridgePlan.portfolioProject.impactStatement}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Coach Action */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Closing this gap can qualify you for top 10% hiring tiers</span>
                </div>

                <button
                  onClick={() =>
                    onAskAiAboutSkill(
                      `I want to learn ${unlock.missingSkills.join(" and ")} to unlock ${unlock.targetRole}. Give me a 4-week step-by-step study schedule and project guide based on my current resume.`
                    )
                  }
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:brightness-110 text-obsidian-950 transition-all shadow-glow"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Aria for a 30-Day Bridge Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
