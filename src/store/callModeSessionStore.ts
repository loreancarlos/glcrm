import { create } from "zustand";
import { api } from "../services/api";
import { CallModeSession } from "../types";

interface CallModeSessionState {
  sessions: CallModeSession[];
  loading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  createSession: (
    session: Omit<CallModeSession, "id" | "userId">
  ) => Promise<CallModeSession>;
  updateSession: (
    id: string,
    updates: Partial<Omit<CallModeSession, "id" | "userId">>
  ) => Promise<void>;
}

export const useCallModeSessionStore = create<CallModeSessionState>(
  (set, get) => ({
    sessions: [],
    loading: false,
    error: null,
    fetchSessions: async () => {
      try {
        set({ loading: true, error: null });
        const sessions = await api.getCallModeSessions();
        set({ sessions, loading: false });
      } catch (error) {
        set({ error: "Failed to fetch call mode sessions", loading: false });
      }
    },
    createSession: async (sessionData) => {
      try {
        set({ loading: true, error: null });
        const session = await api.createCallModeSession(sessionData);
        set({ sessions: [...get().sessions, session], loading: false });
        return session;
      } catch (error) {
        set({ error: "Failed to create call mode session", loading: false });
        throw error;
      }
    },
    updateSession: async (id, updates) => {
      try {
        set({ loading: true, error: null });
        const updatedSession = await api.updateCallModeSession(id, updates);
        set({
          sessions: get().sessions.map((session) =>
            session.id === id ? { ...session, ...updatedSession } : session
          ),
          loading: false,
        });
      } catch (error) {
        set({ error: "Failed to update call mode session", loading: false });
        throw error;
      }
    },
  })
);