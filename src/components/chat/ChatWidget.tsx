"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  BookOpen,
  User,
  Loader2,
  ShieldCheck,
  LogOut,
  GraduationCap,
  ExternalLink,
  CheckCircle2,
  XCircle,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chatStore";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import type { ChatMessage } from "@/types";

// Fresh HTTP client — bypasses the React subscription cache so deleted/
// re-created students are always fetched from the latest Convex state.
const convexHttp = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const QUICK_ACTIONS = [
  "Search for a book",
  "Library hours",
  "How to access e-books?",
  "Available databases",
  "Research assistance",
];

const DEPARTMENTS = [
  "College of Arts and Sciences",
  "College of Business and Accountancy",
  "College of Education",
  "College of Engineering",
  "College of Nursing and Health Sciences",
  "Institute of Graduate Studies and Research",
];

const PROGRAMS: Record<string, string[]> = {
  "College of Arts and Sciences": [
    "BS Psychology",
    "BS Biology",
    "BA Communication",
    "BA Political Science",
    "BS Mathematics",
  ],
  "College of Business and Accountancy": [
    "BS Accountancy",
    "BS Business Administration",
    "BS Management Accounting",
    "BS Entrepreneurship",
  ],
  "College of Education": [
    "Bachelor of Elementary Education",
    "Bachelor of Secondary Education",
    "Bachelor of Physical Education",
  ],
  "College of Engineering": [
    "BS Civil Engineering",
    "BS Mechanical Engineering",
    "BS Electrical Engineering",
    "BS Electronics Engineering",
    "BS Computer Engineering",
    "BS Industrial Engineering",
  ],
  "College of Nursing and Health Sciences": [
    "BS Nursing",
    "BS Medical Technology",
    "BS Pharmacy",
  ],
  "Institute of Graduate Studies and Research": [
    "Master of Arts in Education",
    "Master in Business Administration",
    "Doctor of Education",
  ],
};


function formatBotContent(content: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const lines = content.split("\n");

  lines.forEach((line, lineIdx) => {
    const segments: React.ReactNode[] = [];
    let remaining = line;
    let segKey = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(/\*(.+?)\*/);

      const match =
        boldMatch && italicMatch
          ? boldMatch.index! <= italicMatch.index!
            ? boldMatch
            : italicMatch
          : boldMatch || italicMatch;

      if (!match || match.index === undefined) {
        segments.push(<span key={segKey++}>{remaining}</span>);
        break;
      }

      if (match.index > 0) {
        segments.push(
          <span key={segKey++}>{remaining.slice(0, match.index)}</span>,
        );
      }

      const isBold = match[0].startsWith("**");
      segments.push(
        isBold ? (
          <strong key={segKey++} className="font-semibold">
            {match[1]}
          </strong>
        ) : (
          <em key={segKey++} className="italic">
            {match[1]}
          </em>
        ),
      );

      remaining = remaining.slice(match.index + match[0].length);
    }

    parts.push(
      <span key={lineIdx}>
        {segments}
        {lineIdx < lines.length - 1 && <br />}
      </span>,
    );
  });

  return parts;
}

export default function ChatWidget() {
  const {
    isOpen,
    messages,
    inputValue,
    isLoading,
    verifiedStudent,
    isVerifying,
    toggleChat,
    closeChat,
    setInputValue,
    addMessage,
    setLoading,
    initSession,
    setVerifiedStudent,
    setVerifying,
    resetVerification,
  } = useChatStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toastTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [toastMounted, setToastMounted] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastName, setToastName] = useState("");
  const [errToastMounted, setErrToastMounted] = useState(false);
  const [errToastVisible, setErrToastVisible] = useState(false);
  const [errToastMsg, setErrToastMsg] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [hasLibraryAccount, setHasLibraryAccount] = useState<boolean | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    studentNumber: "",
    program: "",
    department: "",
  });

  useEffect(() => {
    if (isOpen && verifiedStudent) {
      initSession();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, verifiedStudent, initSession]);

  useEffect(() => {
    return () => {
      toastTimers.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const showErrorToast = useCallback((msg: string) => {
    setErrToastMsg(msg);
    setErrToastMounted(true);
    const t1 = setTimeout(() => setErrToastVisible(true), 10);
    const t2 = setTimeout(() => setErrToastVisible(false), 3200);
    const t3 = setTimeout(() => { setErrToastMounted(false); setErrToastMsg(""); }, 3700);
    toastTimers.current.push(t1, t2, t3);
  }, []);

  const handleVerify = useCallback(async () => {
    if (
      !formData.name.trim() ||
      !formData.studentNumber.trim() ||
      !formData.program ||
      !formData.department
    ) {
      showErrorToast("Please fill in all fields.");
      return;
    }

    setVerifying(true);

    try {
      const result = await convexHttp.query(api.students.verify, {
        studentNumber: formData.studentNumber.trim(),
        name: formData.name.trim(),
        program: formData.program,
        department: formData.department,
      });

      if (result.verified && result.student) {
        setVerifiedStudent(result.student);
        initSession();
        setToastName(result.student.name);
        setToastMounted(true);
        const t1 = setTimeout(() => setToastVisible(true), 10);
        const t2 = setTimeout(() => setToastVisible(false), 2700);
        const t3 = setTimeout(() => setToastMounted(false), 3200);
        toastTimers.current.push(t1, t2, t3);
      } else {
        showErrorToast(
          result.reason || "Verification failed. Please check your details.",
        );
      }
    } catch {
      showErrorToast(
        "Unable to verify. Please try again or contact the library.",
      );
    } finally {
      setVerifying(false);
    }
  }, [
    formData,
    setVerifiedStudent,
    setVerifying,
    initSession,
    showErrorToast,
  ]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          student: verifiedStudent
            ? {
                studentId: verifiedStudent.studentNumber,
                studentName: verifiedStudent.name,
                department: verifiedStudent.department,
                program: verifiedStudent.program,
              }
            : undefined,
        }),
      });

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.response ||
          "I apologize, but I encountered an issue. Please try again.",
        timestamp: Date.now(),
        metadata: data.metadata,
      };

      addMessage(assistantMessage);
    } catch {
      addMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: Date.now(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action: string) => {
    setInputValue(action);
    setTimeout(() => {
      if (inputRef.current) {
        setInputValue(action);
        setTimeout(handleSend, 50);
      }
    }, 50);
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    resetVerification();
    setFormData({
      name: "",
      studentNumber: "",
      program: "",
      department: "",
    });
    setHasLibraryAccount(null);
    setShowLogoutModal(false);
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-maroon-800 text-white shadow-lg transition-all duration-300 hover:bg-maroon-900 hover:shadow-xl hover:scale-105"
        aria-label="Open AI Chat Assistant"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl transition-all duration-300",
        isExpanded
          ? "bottom-0 right-0 h-full w-full sm:bottom-4 sm:right-4 sm:h-[90vh] sm:w-150 sm:rounded-2xl"
          : "bottom-4 right-4 h-150 w-100 max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none",
      )}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between bg-linear-to-r from-maroon-800 to-maroon-900 px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white/30">
            <Image
              src="/rose.png"
              alt="ROSe"
              fill
              sizes="40px"
              className="object-cover object-top"
            />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">
              ROSe
              <span className="ml-2 inline-flex h-2 w-2 rounded-full bg-green-400 align-middle" />
            </h3>
            <p className="text-xs text-maroon-200">Reference Online Services</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {verifiedStudent && (
            <button
              onClick={handleLogoutClick}
              className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
            aria-label={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={closeChat}
            className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Student Verification or Chat */}
      {!verifiedStudent ? (
        <div className="flex flex-1 flex-col overflow-y-auto bg-white p-5 sm:p-6">

          {/* ── Step 1: Library account checklist ── */}
          {hasLibraryAccount === null && (
            <div className="flex flex-col flex-1 items-center justify-center text-center gap-6">
              <div>
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-maroon-50">
                  <ShieldCheck className="h-6 w-6 text-maroon-700" />
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900">
                  Before we begin…
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Do you already have a library account?
                </p>
              </div>
              <div className="flex w-full flex-col gap-3">
                <button
                  onClick={() => setHasLibraryAccount(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-maroon-700 bg-maroon-800 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-maroon-900"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Yes, I have a library account
                </button>
                <button
                  onClick={() => setHasLibraryAccount(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                >
                  <XCircle className="h-5 w-5 text-gray-400" />
                  No, not yet
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2a: No library account — registration message ── */}
          {hasLibraryAccount === false && (
            <div className="flex flex-col flex-1 items-center justify-center text-center gap-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                <BookOpen className="h-7 w-7 text-amber-600" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-gray-900">
                  Library Account Required
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  You need a library account to use ROSe. Please register first
                  by visiting the library or filling out the online registration
                  form.
                </p>
              </div>
              <a
                href="/forms/registration"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-maroon-800 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-maroon-900"
              >
                <GraduationCap className="h-4 w-4" />
                Register for a Library Account
              </a>
              <button
                onClick={() => setHasLibraryAccount(null)}
                className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Go back
              </button>
            </div>
          )}

          {/* ── Step 2b: Has library account — verification form ── */}
          {hasLibraryAccount === true && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="mb-5 shrink-0">
                <div className="relative flex justify-center">
                  <button
                    onClick={() => {
                      setHasLibraryAccount(null);
                    }}
                    className="absolute left-0 top-0 flex h-12 items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Back
                  </button>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-maroon-50">
                    <ShieldCheck className="h-6 w-6 text-maroon-700" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-heading text-lg font-bold text-gray-900">
                    Student Verification
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Verify your identity to chat with ROSe
                  </p>
                </div>
              </div>

              <div className="flex flex-col flex-1">
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Juan Dela Cruz"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-maroon-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Student No.
                    </label>
                    <input
                      type="text"
                      value={formData.studentNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          studentNumber: e.target.value,
                        })
                      }
                      placeholder="2024-00123"
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-maroon-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          department: e.target.value,
                          program: "",
                        })
                      }
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-maroon-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                    >
                      <option value="">Select department</option>
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      Program
                    </label>
                    <select
                      value={formData.program}
                      onChange={(e) =>
                        setFormData({ ...formData, program: e.target.value })
                      }
                      disabled={!formData.department}
                      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition-colors focus:border-maroon-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-500/20 disabled:opacity-50"
                    >
                      <option value="">
                        {formData.department
                          ? "Select program"
                          : "Select department first"}
                      </option>
                      {formData.department &&
                        PROGRAMS[formData.department]?.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="mt-8 shrink-0 pb-1">
                  <button
                    onClick={handleVerify}
                    disabled={isVerifying}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-maroon-800 px-8 py-2.5 text-sm font-medium text-white transition-colors hover:bg-maroon-900 disabled:opacity-60"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="h-4 w-4" />
                        Verify
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden animate-fade-in-up">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    message.role === "user"
                      ? "bg-maroon-100 text-maroon-800"
                      : "overflow-hidden border border-maroon-200",
                  )}
                >
                  {message.role === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Image
                      src="/rose.png"
                      alt="ROSe"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover object-top"
                    />
                  )}
                </div>
                <div
                  className={cn(
                    "flex flex-col",
                    message.role === "user" ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-full rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      message.role === "user"
                        ? "bg-maroon-800 text-white"
                        : "bg-gray-100 text-gray-800",
                    )}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.role === "assistant"
                        ? formatBotContent(message.content)
                        : message.content}
                    </div>

                    {message.metadata?.books &&
                      message.metadata.books.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {message.metadata.books.map((book) => (
                            <div
                              key={book._id}
                              className="rounded-lg border border-gray-200 bg-white p-3"
                            >
                              <div className="flex items-start gap-2">
                                <BookOpen className="mt-0.5 h-4 w-4 shrink-0 text-maroon-600" />
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {book.title}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {book.authors.join(", ")}
                                  </p>
                                  {book.callNumber && (
                                    <p className="mt-1 text-xs text-gray-400">
                                      Call #: {book.callNumber}
                                    </p>
                                  )}
                                  <span
                                    className={cn(
                                      "mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium",
                                      book.availability === "available"
                                        ? "bg-green-100 text-green-700"
                                        : book.availability === "reserved"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : "bg-red-100 text-red-700",
                                    )}
                                  >
                                    {book.availability.charAt(0).toUpperCase() +
                                      book.availability.slice(1)}
                                  </span>
                                  {book.digitalAccessLink && (
                                    <div className="mt-1.5">
                                      <a
                                        href={book.digitalAccessLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 rounded-full bg-maroon-50 px-2.5 py-0.5 text-xs font-medium text-maroon-700 transition-colors hover:bg-maroon-100 hover:text-maroon-900"
                                      >
                                        <ExternalLink className="h-3 w-3" />
                                        Access E-Book
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    {message.metadata?.suggestions &&
                      message.metadata.suggestions.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {message.metadata.suggestions.map((s, i) => (
                            <button
                              key={i}
                              onClick={() => handleQuickAction(s)}
                              className="rounded-full border border-maroon-200 bg-white px-3 py-1 text-xs text-maroon-700 transition-colors hover:bg-maroon-50"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                  <span className="mt-1 px-1 text-[10px] text-gray-400">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 overflow-hidden rounded-full border border-maroon-200">
                  <Image
                    src="/rose.png"
                    alt="ROSe"
                    width={32}
                    height={32}
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-maroon-600" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="border-t border-gray-100 px-4 py-3">
              <p className="mb-2 text-xs font-medium text-gray-400">
                Quick actions
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-maroon-300 hover:bg-maroon-50 hover:text-maroon-700"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about books, services, resources..."
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-maroon-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-maroon-500/20"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-maroon-800 text-white transition-all hover:bg-maroon-900 disabled:opacity-50"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {toastMounted && (
        <div className="pointer-events-none absolute top-20 right-4 z-50 flex justify-end">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl bg-maroon-800 px-4 py-3 text-white shadow-xl transition-all duration-500",
              toastVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-8",
            )}
          >
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Sign in confirmation</p>
              <p className="mt-0.5 text-xs text-maroon-100">
                Welcome, {toastName}!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error toast */}
      {errToastMounted && (
        <div className="pointer-events-none absolute left-1/2 top-20 z-50 flex w-full max-w-xl -translate-x-1/2 justify-center px-4">
          <div
            className={cn(
              "flex w-full items-center gap-2 rounded-xl bg-maroon-800 px-5 py-3 text-white shadow-xl transition-all duration-500",
              errToastVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2",
            )}
          >
            <XCircle className="h-4 w-4 shrink-0 text-maroon-100" />
            <p className="text-xs font-medium text-maroon-50 text-left w-full">
              {errToastMsg}
            </p>
          </div>
        </div>
      )}

      {/* Sign Out Modal */}
      {showLogoutModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
              <LogOut className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Sign Out</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to sign out and end the current chat
              session?
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
