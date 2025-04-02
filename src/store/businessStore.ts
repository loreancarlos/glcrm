import { create } from "zustand";
import { api } from "../services/api";
import { Business } from "../types";

interface BusinessState {
  businesses: Business[];
  loading: boolean;
  error: string | null;
  fetchBusinesses: () => Promise<void>;
  addBusiness: (business: Partial<Business>) => Promise<void>;
  updateBusiness: (id: string, business: Partial<Business>) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businesses: [],
  loading: false,
  error: null,
  fetchBusinesses: async () => {
    try {
      set({ loading: false, error: null });
      const businesses = await api.getBusiness();
      set({ businesses, loading: false });

      // Listen for new businesses via WebSocket
      api.onMessage("NEW_BUSINESS", (newBusiness) => {
        // Check if business already exists before adding
        set((state) => ({
          businesses: state.businesses.some(
            (business) => business.id === newBusiness.id
          )
            ? state.businesses
            : [newBusiness, ...state.businesses],
        }));
      });
    } catch (error) {
      set({ error: "Failed to fetch businesses", loading: false });
    }
  },
  addBusiness: async (businessData) => {
    try {
      set({ loading: false, error: null });
      const business = await api.createBusiness(businessData);
      // Don't add the business here since it will come through WebSocket
      return business;
    } catch (error) {
      set({ error: "Failed to create business", loading: false });
      throw error;
    }
  },
  updateBusiness: async (id, businessData) => {
    try {
      set({ loading: false, error: null });
      const updatedBusiness = await api.updateBusiness(id, businessData);
      set({
        businesses: get().businesses.map((business) =>
          business.id === id ? updatedBusiness : business
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to update business", loading: false });
      throw error;
    }
  },
  deleteBusiness: async (id) => {
    try {
      set({ loading: false, error: null });
      await api.deleteBusiness(id);
      set({
        businesses: get().businesses.filter((business) => business.id !== id),
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to delete business", loading: false });
      throw error;
    }
  },
}));
