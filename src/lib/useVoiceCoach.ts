"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function useVoiceCoach() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasSupport, setHasSupport] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);
  const finalTranscriptRef = useRef<string>("");

  // Clean Markdown for smooth Text-to-Speech
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

  // Clean up recognition instance
  const cleanupRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
    setIsListening(false);
  }, []);

  // Stop listening cleanly and return the accumulated transcript
  const stopListening = useCallback((): string => {
    cleanupRecognition();
    const text = finalTranscriptRef.current.trim();
    return text;
  }, [cleanupRecognition]);

  // Start listening
  const startListening = useCallback(async () => {
    if (typeof window === "undefined") return;

    // Check browser support
    const win = window as unknown as IWindow;
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSupport(false);
      setVoiceError("Voice recognition requires Chrome, Edge, or Safari.");
      return;
    }

    // Stop active speech first
    stopSpeaking();
    cleanupRecognition();

    setVoiceError(null);
    setTranscript("");
    finalTranscriptRef.current = "";

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
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
        finalTranscriptRef.current = combined;
        setTranscript(combined);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event?.error);
        if (event?.error === "not-allowed" || event?.error === "service-not-allowed") {
          setVoiceError("Microphone access is blocked. Please allow microphone permissions in your browser address bar.");
        } else if (event?.error !== "no-speech" && event?.error !== "aborted") {
          setVoiceError(`Voice error: ${event?.error}`);
        }
        isListeningRef.current = false;
        setIsListening(false);
      };

      recognition.onend = () => {
        isListeningRef.current = false;
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn("Error starting speech recognition:", err);
      setVoiceError("Could not start microphone. Please ensure microphone permissions are allowed.");
      isListeningRef.current = false;
      setIsListening(false);
    }
  }, [stopSpeaking, cleanupRecognition]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    finalTranscriptRef.current = "";
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRecognition();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [cleanupRecognition]);

  return {
    isListening,
    isSpeaking,
    hasSupport,
    transcript,
    voiceError,
    startListening,
    stopListening,
    resetTranscript,
    speakText,
    stopSpeaking,
  };
}
