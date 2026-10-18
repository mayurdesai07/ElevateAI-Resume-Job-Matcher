"use client";

import React, { useState } from "react";
import { JobApplication, ApplicationStatus } from "@/types";
import {
  X,
  Briefcase,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Bookmark,
  Calendar,
  Building,
  MapPin,
  DollarSign,
  Edit3,
  Check,
  Trash2,
  Filter,
  RefreshCw
} from "lucide-react";

interface ApplicationTrackerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  applications: JobApplication[];
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onUpdateNotes: (id: string, notes: string, recruiterResponse?: string) => void;
  onRemove: (id: string) => void;
  onAskAriaAboutJob: (jobTitle: string, company: string, status: string) => void;
  onOpenComposioModal: () => void;
}

export function ApplicationTrackerDrawer({
  isOpen,
  onClose,
  applications,
  onUpdateStatus,
  onUpdateNotes,
  onRemove,
  onAskAriaAboutJob,
  onOpenComposioModal,
}: ApplicationTrackerDrawerProps) {
  const [filter, setFilter] = useState<"all" | "applied" | "interviewing" | "saved" | "offers">("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editResponse, setEditResponse] = useState<string>("");
  const [editNotes, setEditNotes] = useState<string>("");

  if (!isOpen) return null;

  // Filter logic
  const filteredApps = applications.filter((app) => {
    if (filter === "all") return true;
    if (filter === "applied") return app.status === "applied" || app.status === "under_review";
    if (filter === "interviewing") return app.status === "interviewing";
    if (filter === "saved") return app.status === "saved";
    if (filter === "offers") return app.status === "offer_received";
    return true;
  });

  // Metric counts
  const totalApplied = applications.filter((a) => a.status === "applied" || a.status === "under_review").length;
  const totalInterviewing = applications.filter((a) => a.status === "interviewing").length;
  const totalSaved = applications.filter((a) => a.status === "saved").length;
  const totalOffers = applications.filter((a) => a.status === "offer_received").length;

  const handleStartEdit = (app: JobApplication) => {
    setEditingId(app.id);
    setEditResponse(app.recruiterResponse || "");
    setEditNotes(app.notes || "");
  };

  const handleSaveEdit = (id: string) => {
    onUpdateNotes(id, editNotes, editResponse);
    setEditingId(null);
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case "applied":
        return { label: "Enrolled & Applied", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
      case "under_review":
        return { label: "Under Review", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" };
      case "interviewing":
        return { label: "Interview Scheduled", bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30" };
      case "offer_received":
        return { label: "🎉 Offer Received!", bg: "bg-emerald-400/20 text-emerald-300 border-emerald-400/40" };
      case "saved":
        return { label: "Saved / Want to Apply", bg: "bg-slate-700/30 text-slate-300 border-slate-600/40" };
      case "rejected":
        return { label: "Not Selected", bg: "bg-rose-500/10 text-rose-400 border-rose-500/30" };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-obsidian-950 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-obsidian-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-obsidian-950 shadow-glow">
              <Briefcase className="w-5 h-5 text-obsidian-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Application & Pipeline Hub</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {applications.length} Tracked
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Live log of all enrolled jobs, applications, and recruiter responses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenComposioModal}
              title="Connect Greenhouse / Composio"
              className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-[11px] text-indigo-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Sync Greenhouse</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Metric Bar */}
        <div className="grid grid-cols-4 border-b border-slate-800/80 bg-obsidian-950 divide-x divide-slate-800/80 text-center py-2.5 px-2">
          <div>
            <div className="text-base font-bold text-emerald-400">{totalApplied}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Applied</div>
          </div>
          <div>
            <div className="text-base font-bold text-indigo-400">{totalInterviewing}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Interviewing</div>
          </div>
          <div>
            <div className="text-base font-bold text-cyan-400">{totalSaved}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Saved</div>
          </div>
          <div>
            <div className="text-base font-bold text-amber-400">{totalOffers}</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Offers</div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="p-3 border-b border-slate-800 bg-obsidian-900/60 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === "all"
                ? "bg-emerald-500 text-obsidian-950 font-bold shadow-glow"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setFilter("applied")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === "applied"
                ? "bg-emerald-500 text-obsidian-950 font-bold shadow-glow"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            Enrolled ({totalApplied})
          </button>
          <button
            onClick={() => setFilter("interviewing")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === "interviewing"
                ? "bg-indigo-500 text-white font-bold shadow-glow"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            Interviewing ({totalInterviewing})
          </button>
          <button
            onClick={() => setFilter("saved")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === "saved"
                ? "bg-cyan-500 text-obsidian-950 font-bold shadow-glow"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            Saved ({totalSaved})
          </button>
          <button
            onClick={() => setFilter("offers")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              filter === "offers"
                ? "bg-amber-400 text-obsidian-950 font-bold shadow-glow"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            Offers ({totalOffers})
          </button>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {filteredApps.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500 mb-3">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">No jobs in this filter yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Click &quot;1-Click Enroll &amp; Apply&quot; on any job card to instantly log and track your applications here!
              </p>
            </div>
          ) : (
            filteredApps.map((app) => {
              const badge = getStatusBadge(app.status);
              const isEditing = editingId === app.id;

              return (
                <div
                  key={app.id}
                  className="p-4 rounded-xl bg-obsidian-900 border border-slate-800/90 hover:border-slate-700 transition-all shadow-glass"
                >
                  {/* Top Bar: Title, Company, Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white text-sm hover:text-emerald-400 transition-colors">
                          {app.jobTitle}
                        </h4>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {app.matchScore}% Fit
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span className="font-semibold text-slate-200 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {app.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {app.location}
                        </span>
                        {app.salaryRange && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold text-[11px]">
                              {app.salaryRange}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status Select dropdown */}
                    <select
                      value={app.status}
                      onChange={(e) => onUpdateStatus(app.id, e.target.value as ApplicationStatus)}
                      aria-label="Application Status"
                      className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none transition-colors cursor-pointer ${badge.bg}`}
                    >
                      <option value="applied" className="bg-obsidian-950 text-white">Enrolled &amp; Applied</option>
                      <option value="under_review" className="bg-obsidian-950 text-white">Under Review</option>
                      <option value="interviewing" className="bg-obsidian-950 text-white">Interview Scheduled</option>
                      <option value="offer_received" className="bg-obsidian-950 text-white">🎉 Offer Received</option>
                      <option value="saved" className="bg-obsidian-950 text-white">Saved / Want to Apply</option>
                      <option value="rejected" className="bg-obsidian-950 text-white">Not Selected</option>
                    </select>
                  </div>

                  {/* Recruiter Response & Notes Section */}
                  <div className="mt-3 p-3 rounded-xl bg-obsidian-950/80 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span className="font-semibold flex items-center gap-1 text-slate-300">
                        <MessageSquare className="w-3 h-3 text-emerald-400" />
                        <span>Recruiter Status &amp; Response:</span>
                      </span>
                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEdit(app)}
                          className="text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Update</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSaveEdit(app.id)}
                          className="text-emerald-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 mt-2">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Recruiter Response:</label>
                          <input
                            type="text"
                            value={editResponse}
                            onChange={(e) => setEditResponse(e.target.value)}
                            placeholder="e.g. Email received from Greenhouse: 30min call scheduled"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-0.5">Next Steps &amp; Notes:</label>
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            rows={2}
                            placeholder="e.g. Prep SQL case studies with Aria AI"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-obsidian-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-emerald-500 resize-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-200 font-medium">
                          {app.recruiterResponse || "Application submitted; waiting for recruiter feedback."}
                        </p>
                        {app.notes && (
                          <p className="text-slate-400 text-[11px] mt-1 italic">
                            &quot;{app.notes}&quot;
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>Applied: {app.appliedAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Ask Aria AI about this application */}
                      <button
                        onClick={() => onAskAriaAboutJob(app.jobTitle, app.company, app.status)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30 flex items-center gap-1 transition-colors"
                        title="Get interview prep or follow-up email from Aria"
                      >
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Prep with Aria</span>
                      </button>

                      {/* Direct Apply / Job Portal Link */}
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Open Official Job Application Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {/* Delete */}
                      <button
                        onClick={() => onRemove(app.id)}
                        className="p-1 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Remove from tracker"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
