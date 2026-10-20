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
        return { label: "Enrolled & Applied", bg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60" };
      case "under_review":
        return { label: "Under Review", bg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/60" };
      case "interviewing":
        return { label: "Interview Scheduled", bg: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/60" };
      case "offer_received":
        return { label: "🎉 Offer Received!", bg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/60 font-bold" };
      case "saved":
        return { label: "Saved / Want to Apply", bg: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700" };
      case "rejected":
        return { label: "Not Selected", bg: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/60" };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-button">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#183B56] dark:text-white text-base">Application & Pipeline Hub</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-800/60">
                  {applications.length} Tracked
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Live log of all enrolled jobs, applications, and recruiter responses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenComposioModal}
              title="Connect Greenhouse / Composio"
              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-800/60 text-[11px] text-indigo-700 dark:text-indigo-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Sync Greenhouse</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Metric Bar */}
        <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 divide-x divide-slate-200 dark:divide-slate-800 text-center py-2.5 px-2">
          <div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">{totalApplied}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Applied</div>
          </div>
          <div>
            <div className="text-base font-bold text-blue-600 dark:text-blue-400">{totalInterviewing}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Interviewing</div>
          </div>
          <div>
            <div className="text-base font-bold text-cyan-600 dark:text-cyan-400">{totalSaved}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Saved</div>
          </div>
          <div>
            <div className="text-base font-bold text-amber-600 dark:text-amber-400">{totalOffers}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Offers</div>
          </div>
        </div>

        {/* Status Filters */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white shadow-button"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
            }`}
          >
            All ({applications.length})
          </button>
          <button
            onClick={() => setFilter("applied")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              filter === "applied"
                ? "bg-blue-600 text-white shadow-button"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
            }`}
          >
            Enrolled ({totalApplied})
          </button>
          <button
            onClick={() => setFilter("interviewing")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              filter === "interviewing"
                ? "bg-blue-600 text-white shadow-button"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
            }`}
          >
            Interviewing ({totalInterviewing})
          </button>
          <button
            onClick={() => setFilter("saved")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              filter === "saved"
                ? "bg-blue-600 text-white shadow-button"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
            }`}
          >
            Saved ({totalSaved})
          </button>
          <button
            onClick={() => setFilter("offers")}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
              filter === "offers"
                ? "bg-blue-600 text-white shadow-button"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700"
            }`}
          >
            Offers ({totalOffers})
          </button>
        </div>

        {/* Applications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {filteredApps.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-[#183B56] dark:text-white">No jobs in this filter yet</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
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
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-sm"
                >
                  {/* Top Bar: Title, Company, Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-[#183B56] dark:text-white text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {app.jobTitle}
                        </h4>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                          {app.matchScore}% Fit
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {app.company}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {app.location}
                        </span>
                        {app.salaryRange && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
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
                      <option value="applied" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Enrolled &amp; Applied</option>
                      <option value="under_review" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Under Review</option>
                      <option value="interviewing" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Interview Scheduled</option>
                      <option value="offer_received" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🎉 Offer Received</option>
                      <option value="saved" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Saved / Want to Apply</option>
                      <option value="rejected" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Not Selected</option>
                    </select>
                  </div>

                  {/* Recruiter Response & Notes Section */}
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1.5">
                      <span className="font-semibold flex items-center gap-1 text-[#183B56] dark:text-slate-300">
                        <MessageSquare className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>Recruiter Status &amp; Response:</span>
                      </span>
                      {!isEditing ? (
                        <button
                          onClick={() => handleStartEdit(app)}
                          className="text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 flex items-center gap-1 transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                          <span>Update</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSaveEdit(app.id)}
                          className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Save</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 mt-2">
                        <div>
                          <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">Recruiter Response:</label>
                          <input
                            type="text"
                            value={editResponse}
                            onChange={(e) => setEditResponse(e.target.value)}
                            placeholder="e.g. Email received from Greenhouse: 30min call scheduled"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-0.5">Next Steps &amp; Notes:</label>
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            rows={2}
                            placeholder="e.g. Prep SQL case studies with Zara AI"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-blue-500 resize-none"
                          />
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-slate-700 dark:text-slate-200 font-medium">
                          {app.recruiterResponse || "Application submitted; waiting for recruiter feedback."}
                        </p>
                        {app.notes && (
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 italic">
                            &quot;{app.notes}&quot;
                          </p>
                        )}
                      </>
                    )}
                  </div>

                  {/* Footer Meta & Actions */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <span>Applied: {app.appliedAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Ask Zara AI about this application */}
                      <button
                        onClick={() => onAskAriaAboutJob(app.jobTitle, app.company, app.status)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-800/60 flex items-center gap-1 transition-colors"
                        title="Get interview prep or follow-up email from Zara"
                      >
                        <Sparkles className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>Prep with Zara</span>
                      </button>

                      {/* Direct Apply / Job Portal Link */}
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                        title="Open Official Job Application Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {/* Delete */}
                      <button
                        onClick={() => onRemove(app.id)}
                        className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
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
