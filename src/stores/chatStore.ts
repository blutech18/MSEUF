import { create } from "zustand";
import type { ChatMessage, ChatSession } from "@/types";

interface ChatState {
  isOpen: boolean;
  isLoading: boolean;
  session: ChatSession | null;
  messages: ChatMessage[];
  inputValue: string;

  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setInputValue: (value: string) => void;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  initSession: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  isLoading: false,
  session: null,
  messages: [],
  inputValue: "",

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  setInputValue: (value) => set({ inputValue: value }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
      session: state.session
        ? { ...state.session, lastActivity: Date.now() }
        : state.session,
    })),

  setLoading: (loading) => set({ isLoading: loading }),

  clearMessages: () =>
    set({
      messages: [],
      session: null,
    }),

  initSession: () => {
    const existing = get().session;
    if (!existing) {
      set({
        session: {
          id: crypto.randomUUID(),
          messages: [],
          createdAt: Date.now(),
          lastActivity: Date.now(),
        },
        messages: [
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "Mabuhay! I'm ROSe (Reference Online Services), your MSEUF University Libraries assistant. I can help you search for books, find digital resources, answer questions about library services, and more. How can I help you today?",
            timestamp: Date.now(),
          },
        ],
      });
    }
  },
}));
