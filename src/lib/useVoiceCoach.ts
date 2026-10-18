"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function useVoiceCoach(onSpeechRecognized?: (transcript: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSupport, setHasSupport] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const finalTranscriptRef = useRef<string>("");
  const callbackRef = useRef(onSpeechRecognized);

  // Keep callback fresh
  useEffect(() => {
    callbackRef.current = onSpeechRecognized;
  }, [onSpeechRecognized]);

  // Clean Markdown for silky smooth Text-to-Speech
  const cleanMarkdownForSpeech = (markdown: string): string => {
    return markdown
      .replace(/###/g, "")
      .replace(/##/g, "")
      .replace(/#/g, "")
      .replace(/\*\*/g, "")
      .replace(/\*/g, "")
      .replace(/`{1,3}[^`]*`{1,3}/g, "")
      .replace(/>/g, "")
      .replace(/[-+]\s/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n+/g, ". ")
      .trim();
  };

  const speakText = useCallback((text: string, onEnd?: () => void) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    try {
      window.speechSynthesis.cancel();

      const cleaned = cleanMarkdownForSpeech(text);
      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) =>
          (v.name.includes("Natural") ||
            v.name.includes("Google") ||
            v.name.includes("Samantha") ||
            v.name.includes("Zira") ||
            v.name.includes("Jenny")) &&
          v.lang.startsWith("en")
      );
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
      setIsSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Initialize Speech Recognition instance
  const initRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;

    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSupport(false);
      setVoiceError("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        let accumulatedFinal = "";
        let currentInterim = "";

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            accumulatedFinal += res[0].transcript + " ";
          } else {
            currentInterim += res[0].transcript;
          }
        }

        const combined = (accumulatedFinal + currentInterim).trim();
        setTranscript(combined);
        finalTranscriptRef.current = combined;
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          setVoiceError("Microphone permission denied. Please allow microphone access in your browser address bar.");
        } else if (event.error === "no-speech") {
          // No speech detected, keep waiting or stop gracefully
        } else if (event.error !== "aborted") {
          setVoiceError(`Voice error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      return recognition;
    } catch (err) {
      console.error("Failed to construct SpeechRecognition:", err);
      return null;
    }
  }, []);

  // Start listening with explicit microphone permission request
  const startListening = useCallback(async () => {
    setVoiceError(null);
    setTranscript("");
    finalTranscriptRef.current = "";

    // Stop speech if speaking
    stopSpeaking();

    // 1. Explicitly request microphone stream to trigger browser prompt
    if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately stop stream tracks; we just needed permission verified
        stream.getTracks().forEach((track) => track.stop());
      } catch (err: any) {
        console.warn("Microphone permission error:", err);
        setVoiceError("Microphone permission denied. Please click the lock/settings icon in your browser address bar and allow Microphone.");
        setIsListening(false);
        return;
      }
    }

    // 2. Initialize or re-use recognition instance
    if (!recognitionRef.current) {
      recognitionRef.current = initRecognition();
    }

    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.abort();
    } catch (_) {}

    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e: any) {
      console.warn("Error starting speech recognition:", e);
      // If already started or restarting
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          recognitionRef.current?.start();
          setIsListening(true);
        }, 150);
      } catch (_) {}
    }
  }, [initRecognition, stopSpeaking]);

  // Stop listening and return whatever was recorded
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    setIsListening(false);

    const text = finalTranscriptRef.current.trim();
    if (text && callbackRef.current) {
      callbackRef.current(text);
    }
    return text;
  }, []);

  return {
    isListening,
    isSpeaking,
    hasSupport,
    transcript,
    voiceError,
    startListening,
    stopListening,
    speakText,
    stopSpeaking,
  };
}
