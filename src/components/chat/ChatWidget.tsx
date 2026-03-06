"use client";

import { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/stores/chatStore";
import type { ChatMessage } from "@/types";

const QUICK_ACTIONS = [
  "Search for a book",
  "Library hours",
  "How to access e-books?",
  "Available databases",
  "Research assistance",
];

export default function ChatWidget() {
  const {
    isOpen,
    messages,
    inputValue,
    isLoading,
    toggleChat,
    closeChat,
    setInputValue,
    addMessage,
    setLoading,
    initSession,
  } = useChatStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      initSession();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const fakeEvent = { key: "Enter" } as React.KeyboardEvent;
      if (inputRef.current) {
        setInputValue(action);
        setTimeout(handleSend, 50);
      }
    }, 50);
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
          : "bottom-4 right-4 h-150 w-100 max-sm:bottom-0 max-sm:right-0 max-sm:h-full max-sm:w-full max-sm:rounded-none"
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                message.role === "user"
                  ? "bg-maroon-100 text-maroon-800"
                  : "overflow-hidden border border-maroon-200"
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
                "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                message.role === "user"
                  ? "bg-maroon-800 text-white"
                  : "bg-gray-100 text-gray-800"
              )}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>

              {message.metadata?.books && message.metadata.books.length > 0 && (
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
                                  : "bg-red-100 text-red-700"
                            )}
                          >
                            {book.availability.charAt(0).toUpperCase() +
                              book.availability.slice(1)}
                          </span>
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

      {/* Quick Actions (only if few messages) */}
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
  );
}
