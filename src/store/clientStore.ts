import { create } from "zustand";
import { Client } from "../types";
import { api } from "../services/api";

interface ClientState {
  clients: Client[];
  loading: boolean;
  error: string | null;
  fetchClients: () => Promise<void>;
  addClient: (client: Omit<Client, "id">) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  loading: false,
  error: null,
  fetchClients: async () => {
    try {
      set({ loading: false, error: null });
      const clients = await api.getClients();
      set({ clients, loading: false });
    } catch (error) {
      if (error.message == "Session expired") {
        const elem = document.getElementById("logout");
        elem?.click();
      }
      set({ error: "Failed to fetch clients", loading: false });
    }
  },
  addClient: async (clientData) => {
    try {
      set({ loading: false, error: null });
      const client = await api.createClient(clientData);
      set({ clients: [...get().clients, client], loading: false });
    } catch (error) {
      set({ error: "Failed to create client", loading: false });
      throw error;
    }
  },
  updateClient: async (id, clientData) => {
    try {
      set({ loading: false, error: null });
      const updatedClient = await api.updateClient(id, clientData);
      set({
        clients: get().clients.map((client) =>
          client.id === id ? updatedClient : client
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to update client", loading: false });
      throw error;
    }
  },
  deleteClient: async (id) => {
    try {
      set({ loading: false, error: null });
      await api.deleteClient(id);
      const updatedClients = get().clients.filter((client) => client.id !== id);
      set({ clients: updatedClients, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },
}));
