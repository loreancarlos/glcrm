import { create } from "zustand";
import { api } from "../services/api";

interface LeadState {
  leads: any[];
  loading: boolean;
  error: string | null;
  fetchLeads: () => Promise<void>;
  addLead: (lead: any) => Promise<any>;
  addImportLead: (lead: any) => Promise<any>;
  updateLead: (id: string, lead: any) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  updateLeadStatus: (id: string, status: string) => Promise<void>;
}

export const useLeadStore = create<LeadState>((set, get) => ({
  leads: [],
  loading: false,
  error: null,
  fetchLeads: async () => {
    try {
      set({ loading: false, error: null });
      const leads = await api.getLeads();
      set({ leads, loading: false });

      // Listen for new leads via WebSocket
      api.onMessage("NEW_LEAD", (newLead) => {
        // Check if lead already exists before adding
        set((state) => ({
          leads: state.leads.some(lead => lead.id === newLead.id) 
            ? state.leads 
            : [...state.leads, newLead],
        }));
      });
    } catch (error) {
      set({ error: "Failed to fetch leads", loading: false });
    }
  },
  addLead: async (leadData) => {
    try {
      set({ loading: false, error: null });
      const lead = await api.createLead(leadData);
      // Don't add the lead here since it will come through WebSocket
      return lead;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  addImportLead: async (leadData) => {
    try {
      set({ loading: false, error: null });
      const lead = await api.createImportLead(leadData);
      // Don't add the lead here since it will come through WebSocket
      return lead;
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  updateLead: async (id, leadData) => {
    try {
      set({ loading: false, error: null });
      const updatedLead = await api.updateLead(id, leadData);
      set({
        leads: get().leads.map((lead) => (lead.id === id ? updatedLead : lead)),
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to update lead", loading: false });
      throw error;
    }
  },
  deleteLead: async (id) => {
    try {
      set({ loading: false, error: null });
      await api.deleteLead(id);
      set({
        leads: get().leads.filter((lead) => lead.id !== id),
        loading: false,
      });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
  updateLeadStatus: async (id, status) => {
    try {
      set({ loading: false, error: null });
      const updatedLead = await api.updateLeadStatus(id, status);
      set({
        leads: get().leads.map((lead) => (lead.id === id ? updatedLead : lead)),
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to update lead status", loading: false });
      throw error;
    }
  },
}));