"use client";

import React, { useState } from "react";
import { JobMatch, ResumeProfile } from "@/types";
import { Check, Copy, Sparkles, X, Mail, Send } from "lucide-react";

interface TailorPitchModalProps {
  job: JobMatch;
  profile: ResumeProfile;
  onClose: () => void;
}

export function TailorPitchModal({ job, profile, onClose }: TailorPitchModalProps) {
  const [copied, setCopied] = useState(false);

  const pitchText = `Subject: Application for ${job.title} — ${profile.name}

Dear Hiring Team at ${job.company},

I am writing to express my enthusiastic interest in the ${job.title} role (${job.salaryRange}) at ${job.company}. Having followed ${job.company}'s recent product developments, I was immediately drawn to your team's mission and engineering standards.

With over ${profile.yearsOfExperience} years of experience as a ${profile.title}, my background is a direct match with your core requirements:
• Mastery in ${job.matchedSkills.slice(0, 3).join(", ")}, which I have used to optimize data pipelines and deliver executive analytics with tangible business ROI.
• Hands-on production track record in ${job.matchedSkills.slice(3).join(", ") || profile.technicalSkills.slice(0, 2).join(", ")}, aligning directly with your tech stack.
• Demonstrated ability to bridge technical architecture with cross-functional stakeholder communication.

I would welcome the opportunity to discuss how my experience in ${profile.technicalSkills[0]} and ${profile.technicalSkills[1] || "system modeling"} can help ${job.company} accelerate roadmap objectives this quarter.

Thank you for your time and consideration.

Best regards,
${profile.name}
${profile.email || "email@example.com"}
Portfolio / LinkedIn Profile`;

  const fallbackCopy = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    } catch (_) {}
  };

  const handleCopy = () => {
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(pitchText).catch(() => fallbackCopy(pitchText));
      } else {
        fallbackCopy(pitchText);
      }
    } catch (_) {
      fallbackCopy(pitchText);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-obsidian-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">AI-Tailored Pitch & Cover Note</h3>
            <p className="text-xs text-slate-400">
              Personalized for <span className="text-slate-200 font-semibold">{job.title}</span> at <span className="text-emerald-400 font-semibold">{job.company}</span>
            </p>
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-obsidian-950 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
          {pitchText}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            <span>Ready to paste directly into job portals or cold emails</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:brightness-110 transition-all shadow-glow"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Tailored Pitch</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
