"use client";

import { useState, useEffect, useCallback } from "react";
import { UserAccount, ResumeProfile } from "@/types";
import { SAMPLE_RESUMES } from "@/data/mockResumes";

const CURRENT_USER_KEY = "elevate_ai_current_user";
const USERS_DB_KEY = "elevate_ai_users_db";

// Preloaded starter accounts so users can immediately test or sign up their own
const DEFAULT_ACCOUNTS: Record<string, UserAccount> = {
  "alex@example.com": {
    id: "usr_alex_rivera",
    email: "alex@example.com",
    name: "Alex Rivera",
    password: "password123",
    isGuest: false,
    savedProfile: SAMPLE_RESUMES.alex_data_analyst,
    createdAt: "2026-01-15T00:00:00.000Z",
    lastLoginAt: new Date().toISOString(),
  },
  "sarah@example.com": {
    id: "usr_sarah_chen",
    email: "sarah@example.com",
    name: "Sarah Chen",
    password: "password123",
    isGuest: false,
    savedProfile: SAMPLE_RESUMES.sarah_ml_engineer,
    createdAt: "2026-02-01T00:00:00.000Z",
    lastLoginAt: new Date().toISOString(),
  },
  "marcus@example.com": {
    id: "usr_marcus_vance",
    email: "marcus@example.com",
    name: "Marcus Vance",
    password: "password123",
    isGuest: false,
    savedProfile: SAMPLE_RESUMES.marcus_fullstack,
    createdAt: "2026-02-10T00:00:00.000Z",
    lastLoginAt: new Date().toISOString(),
  },
};

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize and load stored users & active session from localStorage
  useEffect(() => {
    try {
      // Ensure default accounts exist in db
      const rawDb = localStorage.getItem(USERS_DB_KEY);
      let usersDb: Record<string, UserAccount> = DEFAULT_ACCOUNTS;
      if (rawDb) {
        try {
          usersDb = { ...DEFAULT_ACCOUNTS, ...JSON.parse(rawDb) };
        } catch {
          usersDb = DEFAULT_ACCOUNTS;
        }
      }
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));

      // Check for active logged in user
      const savedUserStr = localStorage.getItem(CURRENT_USER_KEY);
      if (savedUserStr) {
        const user = JSON.parse(savedUserStr);
        // Refresh with latest saved profile from DB if not guest
        if (!user.isGuest && usersDb[user.email.toLowerCase()]) {
          const freshUser = usersDb[user.email.toLowerCase()];
          setCurrentUser(freshUser);
        } else {
          setCurrentUser(user);
        }
      } else {
        // Automatically start as guest with Alex's profile or prompt modal
        const guestUser: UserAccount = {
          id: `guest_${Math.random().toString(36).substring(2, 9)}`,
          email: "guest@elevateai.internal",
          name: "Guest Explorer",
          isGuest: true,
          savedProfile: SAMPLE_RESUMES.alex_data_analyst,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
        setCurrentUser(guestUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(guestUser));
      }
    } catch (e) {
      console.warn("Error reading auth from localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save profile forever to active user account
  const saveProfileForUser = useCallback((profile: ResumeProfile) => {
    setCurrentUser((prev) => {
      if (!prev) return null;

      const updatedUser: UserAccount = {
        ...prev,
        savedProfile: profile,
        lastLoginAt: new Date().toISOString(),
      };

      try {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

        // If registered user (not guest), save permanently to user DB
        if (!prev.isGuest && prev.email) {
          const rawDb = localStorage.getItem(USERS_DB_KEY);
          const usersDb = rawDb ? JSON.parse(rawDb) : { ...DEFAULT_ACCOUNTS };
          usersDb[prev.email.toLowerCase()] = updatedUser;
          localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
        }
      } catch (err) {
        console.warn("Failed to persist user profile:", err);
      }

      return updatedUser;
    });
  }, []);

  // Log in existing user
  const login = useCallback((email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const rawDb = localStorage.getItem(USERS_DB_KEY);
    const usersDb: Record<string, UserAccount> = rawDb ? JSON.parse(rawDb) : { ...DEFAULT_ACCOUNTS };

    const existing = usersDb[cleanEmail];
    if (!existing) {
      return { success: false, error: "No account found with this email. Please click 'Create Free Account'." };
    }

    if (existing.password && password && existing.password !== password.trim()) {
      return { success: false, error: "Incorrect password. Please verify and try again." };
    }

    const updatedUser: UserAccount = {
      ...existing,
      lastLoginAt: new Date().toISOString(),
    };

    usersDb[cleanEmail] = updatedUser;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
    setIsAuthModalOpen(false);

    return { success: true };
  }, []);

  // Sign up new user
  const signup = useCallback((name: string, email: string, password?: string): { success: boolean; error?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !cleanName) {
      return { success: false, error: "Please provide both your name and email." };
    }

    const rawDb = localStorage.getItem(USERS_DB_KEY);
    const usersDb: Record<string, UserAccount> = rawDb ? JSON.parse(rawDb) : { ...DEFAULT_ACCOUNTS };

    if (usersDb[cleanEmail]) {
      return { success: false, error: "An account with this email already exists. Please Sign In." };
    }

    // Inherit current resume if user already loaded one, or start fresh
    const initialProfile = currentUser?.savedProfile || SAMPLE_RESUMES.alex_data_analyst;

    const newUser: UserAccount = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: cleanName,
      email: cleanEmail,
      password: password?.trim() || "password123",
      isGuest: false,
      savedProfile: initialProfile,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    usersDb[cleanEmail] = newUser;
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDb));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);

    return { success: true };
  }, [currentUser]);

  // Continue / login as Guest
  const loginAsGuest = useCallback((): UserAccount => {
    const guestUser: UserAccount = {
      id: `guest_${Math.random().toString(36).substring(2, 9)}`,
      email: "guest@elevateai.internal",
      name: "Guest Explorer",
      isGuest: true,
      savedProfile: currentUser?.savedProfile || SAMPLE_RESUMES.alex_data_analyst,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(guestUser));
    setCurrentUser(guestUser);
    setIsAuthModalOpen(false);
    return guestUser;
  }, [currentUser]);

  // Log out (returns to guest mode)
  const logout = useCallback(() => {
    const guestUser: UserAccount = {
      id: `guest_${Math.random().toString(36).substring(2, 9)}`,
      email: "guest@elevateai.internal",
      name: "Guest Explorer",
      isGuest: true,
      savedProfile: SAMPLE_RESUMES.alex_data_analyst,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(guestUser));
    setCurrentUser(guestUser);
  }, []);

  return {
    currentUser,
    isLoaded,
    isAuthenticated: currentUser !== null && !currentUser.isGuest,
    isGuest: currentUser?.isGuest ?? true,
    isAuthModalOpen,
    openAuthModal: () => setIsAuthModalOpen(true),
    closeAuthModal: () => setIsAuthModalOpen(false),
    login,
    signup,
    loginAsGuest,
    logout,
    saveProfileForUser,
  };
}
