import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage, ChatSession, VerifiedStudent } from "@/types";

interface ChatState {
  isOpen: boolean;
  isLoading: boolean;
  session: ChatSession | null;
  messages: ChatMessage[];
  inputValue: string;
  verifiedStudent: VerifiedStudent | null;
  isVerifying: boolean;
  verificationError: string | null;

  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setInputValue: (value: string) => void;
  addMessage: (message: ChatMessage) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  initSession: () => void;
  setVerifiedStudent: (student: VerifiedStudent | null) => void;
  setVerifying: (v: boolean) => void;
  setVerificationError: (error: string | null) => void;
  resetVerification: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isLoading: false,
      session: null,
      messages: [],
      inputValue: "",
      verifiedStudent: null,
      isVerifying: false,
      verificationError: null,

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
                  "Mabuhay! I'm ROSe (Reference Online Services), your MSEUF University Library assistant. I can help you search for books, find digital resources, answer questions about library services, and more. How can I help you today?",
                timestamp: Date.now(),
              },
            ],
          });
        }
      },

      setVerifiedStudent: (student) => set({ verifiedStudent: student }),
      setVerifying: (v) => set({ isVerifying: v }),
      setVerificationError: (error) => set({ verificationError: error }),
      resetVerification: () =>
        set({
          verifiedStudent: null,
          verificationError: null,
          messages: [],
          session: null,
        }),
    }),
    {
      name: "mseuf-chat",
      partialize: (state) => ({
        verifiedStudent: state.verifiedStudent,
      }),
    }
  )
);
