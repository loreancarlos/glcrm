import { create } from "zustand";
import { Development } from "../types";
import { api } from "../services/api";

interface DevelopmentState {
  developments: Development[];
  loading: boolean;
  error: string | null;
  fetchDevelopments: () => Promise<void>;
  addDevelopment: (development: Omit<Development, "id">) => Promise<void>;
  updateDevelopment: (
    id: string,
    development: Partial<Development>
  ) => Promise<void>;
  deleteDevelopment: (id: string) => Promise<void>;
}

export const useDevelopmentStore = create<DevelopmentState>((set, get) => ({
  developments: [],
  loading: false,
  error: null,
  fetchDevelopments: async () => {
    try {
      set({ loading: false, error: null });
      const developments = await api.getDevelopments();
      // Remove date formatting here since we'll handle it in the UI
      set({ developments, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch developments", loading: false });
    }
  },
  addDevelopment: async (developmentData) => {
    try {
      set({ loading: false, error: null });
      const development = await api.createDevelopment(developmentData);
      set({
        developments: [...get().developments, development],
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to create development", loading: false });
      throw error;
    }
  },
  updateDevelopment: async (id, developmentData) => {
    try {
      set({ loading: false, error: null });
      const updatedDevelopment = await api.updateDevelopment(
        id,
        developmentData
      );
      set({
        developments: get().developments.map((development) =>
          development.id === id ? updatedDevelopment : development
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to update development", loading: false });
      throw error;
    }
  },
  deleteDevelopment: async (id) => {
    try {
      set({ loading: false, error: null });
      await api.deleteDevelopment(id);
      const updatedDevelopments = get().developments.filter(
        (development) => development.id !== id
      );
      set({ developments: updatedDevelopments, loading: false });
    } catch (error) {
      set({ error: "Failed to delete development", loading: false });
      throw error;
    }
  },
}));
