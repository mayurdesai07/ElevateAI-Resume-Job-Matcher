"use client";

import React, { useState } from "react";
import {
  X,
  Lock,
  Mail,
  User,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  UserCheck,
  ShieldCheck,
  Check,
} from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password?: string) => { success: boolean; error?: string };
  onSignup: (name: string, email: string, password?: string) => { success: boolean; error?: string };
  onLoginAsGuest: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  onLogin,
  onSignup,
  onLoginAsGuest,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (mode === "login") {
      if (!email.trim()) {
        setErrorMsg("Please enter your email address.");
        return;
      }
      const res = onLogin(email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to log in.");
      }
    } else {
      if (!name.trim()) {
        setErrorMsg("Please enter your full name.");
        return;
      }
      if (!email.trim()) {
        setErrorMsg("Please enter your email address.");
        return;
      }
      const res = onSignup(name, email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Failed to create account.");
      }
    }
  };

  const handleSelectDemoUser = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
    onLogin(demoEmail, demoPass);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-obsidian-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/20 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 p-[1.5px] shadow-glow items-center justify-center">
            <div className="w-full h-full bg-obsidian-900 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            {mode === "login" ? "Welcome Back to ElevateAI" : "Create Your Account"}
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {mode === "login"
              ? "Sign in to access your saved resume, tailored matches, and applications forever."
              : "Upload your resume once and keep your career intelligence stored permanently."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-obsidian-950 rounded-xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "login"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              mode === "signup"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs leading-relaxed animate-in fade-in duration-150">
            {errorMsg}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. Mayur Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-obsidian-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-xs rounded-xl bg-obsidian-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2 text-xs rounded-xl bg-obsidian-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-obsidian-950 transition-all shadow-glow flex items-center justify-center gap-2 mt-2"
          >
            <span>{mode === "login" ? "Sign In & Load Profile" : "Create Account & Save Profile"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-500 bg-obsidian-900 px-2">
            Or Continue Directly
          </div>
        </div>

        {/* Guest Login Option */}
        <button
          type="button"
          onClick={onLoginAsGuest}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-600 transition-all flex items-center justify-center gap-2.5 group"
        >
          <UserCheck className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Continue as Guest (Instant Access)</span>
        </button>

        {/* Demo Accounts Quick Pick */}
        {mode === "login" && (
          <div className="mt-5 pt-4 border-t border-slate-800/60">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2 text-center">
              Quick 1-Click Demo Profiles:
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleSelectDemoUser("alex@example.com", "password123")}
                className="px-2 py-1.5 rounded-lg bg-obsidian-950 border border-slate-800 hover:border-emerald-500/40 text-[10px] text-slate-300 hover:text-white transition-all text-center"
              >
                <div className="font-bold text-emerald-400">Alex</div>
                <div className="text-[9px] text-slate-500">Data Analyst</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoUser("sarah@example.com", "password123")}
                className="px-2 py-1.5 rounded-lg bg-obsidian-950 border border-slate-800 hover:border-emerald-500/40 text-[10px] text-slate-300 hover:text-white transition-all text-center"
              >
                <div className="font-bold text-purple-400">Sarah</div>
                <div className="text-[9px] text-slate-500">ML Engineer</div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDemoUser("marcus@example.com", "password123")}
                className="px-2 py-1.5 rounded-lg bg-obsidian-950 border border-slate-800 hover:border-emerald-500/40 text-[10px] text-slate-300 hover:text-white transition-all text-center"
              >
                <div className="font-bold text-cyan-400">Marcus</div>
                <div className="text-[9px] text-slate-500">Full Stack</div>
              </button>
            </div>
          </div>
        )}

        {/* Security & Persistence Notice */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Your resume data is stored securely and remembered forever.</span>
        </div>
      </div>
    </div>
  );
}
