"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  ExternalLink,
  Check,
  RefreshCw,
  Building2,
  Mail,
  Linkedin,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from "lucide-react";

interface ComposioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncGreenhouse: (boardTokens: string[]) => Promise<void>;
}

export function ComposioModal({
  isOpen,
  onClose,
  onSyncGreenhouse,
}: ComposioModalProps) {
  const [composioKey, setComposioKey] = useState("");
  const [greenhouseBoard, setGreenhouseBoard] = useState("figma,discord,datadog,gitlab");
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedKey = localStorage.getItem("elevate_composio_key");
      const storedBoard = localStorage.getItem("elevate_greenhouse_boards");
      if (storedKey) {
        setComposioKey(storedKey);
        setIsConnected(true);
      }
      if (storedBoard) {
        setGreenhouseBoard(storedBoard);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndSync = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);

    if (typeof window !== "undefined") {
      if (composioKey.trim()) {
        localStorage.setItem("elevate_composio_key", composioKey.trim());
        setIsConnected(true);
      }
      localStorage.setItem("elevate_greenhouse_boards", greenhouseBoard.trim());
    }

    const boards = greenhouseBoard
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);

    try {
      await onSyncGreenhouse(boards);
      setSyncSuccess(true);
      setTimeout(() => {
        setSyncSuccess(false);
        onClose();
      }, 1500);
    } catch (e) {
      console.warn("Sync error:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-obsidian-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-glow">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Composio &amp; Greenhouse Integration</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                LIVE SYNC
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Feed real-time Greenhouse candidate applications &amp; company jobs into ElevateAI
            </p>
          </div>
        </div>

        {/* Connected Apps Status Grid */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col items-center text-center">
            <Building2 className="w-4 h-4 text-emerald-400 mb-1" />
            <span className="font-bold text-white text-[11px]">Greenhouse</span>
            <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <Check className="w-3 h-3" /> Ready
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex flex-col items-center text-center">
            <Mail className="w-4 h-4 text-indigo-400 mb-1" />
            <span className="font-bold text-white text-[11px]">Composio Agent</span>
            <span className="text-[10px] text-indigo-300 flex items-center gap-0.5 mt-0.5">
              <Zap className="w-3 h-3" /> Connected
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex flex-col items-center text-center">
            <Linkedin className="w-4 h-4 text-cyan-400 mb-1" />
            <span className="font-bold text-white text-[11px]">Direct Portals</span>
            <span className="text-[10px] text-cyan-300 flex items-center gap-0.5 mt-0.5">
              <Check className="w-3 h-3" /> Live
            </span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="mt-4 space-y-3.5 text-xs">
          {/* Composio API Key */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <span>Composio API Key (Optional)</span>
              </label>
              <a
                href="https://app.composio.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1 text-[11px]"
              >
                <span>Composio Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <input
              type="password"
              placeholder="comp_..."
              value={composioKey}
              onChange={(e) => setComposioKey(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            />
          </div>

          {/* Greenhouse Board Tokens */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-200">
                Greenhouse Company Boards (Comma-separated)
              </label>
              <span className="text-[10px] text-slate-400">e.g. figma, stripe, discord</span>
            </div>
            <input
              type="text"
              value={greenhouseBoard}
              onChange={(e) => setGreenhouseBoard(e.target.value)}
              placeholder="figma, discord, datadog, gitlab"
              className="w-full px-3.5 py-2.5 rounded-xl bg-obsidian-950 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono text-xs"
            />
            <p className="text-[10px] text-slate-400 mt-1">
              ElevateAI automatically connects to these Greenhouse company boards to pull open listings and link your applications directly.
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            When you connect Greenhouse via Composio, ElevateAI automatically syncs your applied jobs, tracks recruiter response status, and alerts Aria AI so she can coach you for interviews.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            Close
          </button>

          <button
            onClick={handleSaveAndSync}
            disabled={isSyncing}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-obsidian-950 transition-all shadow-glow flex items-center gap-2 disabled:opacity-50"
          >
            {isSyncing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Syncing Greenhouse Feeds...</span>
              </>
            ) : syncSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-obsidian-950" />
                <span>Connected &amp; Synced!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-obsidian-950" />
                <span>Connect &amp; Sync Live Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
