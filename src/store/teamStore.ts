import { create } from "zustand";
import { api } from "../services/api";
import { Team } from "../types";

interface TeamState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  fetchTeams: () => Promise<void>;
  addTeam: (team: Team) => Promise<void>;
  updateTeam: (id: string, team: Team) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  addTeamMember: (teamId: string, userId: string) => Promise<void>;
  removeTeamMember: (userId: string) => Promise<void>;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: [],
  loading: false,
  error: null,
  fetchTeams: async () => {
    try {
      set({ loading: false, error: null });
      const teams = await api.getTeams();
      set({ teams, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch teams", loading: false });
    }
  },
  addTeam: async (teamData) => {
    try {
      set({ loading: false, error: null });
      const team = await api.createTeam(teamData);
      set({ teams: [...get().teams, team], loading: false });
      await get().fetchTeams(); // Atualiza a lista após adicionar
    } catch (error) {
      set({ error: "Failed to create team", loading: false });
      throw error;
    }
  },
  updateTeam: async (id, teamData) => {
    try {
      set({ loading: false, error: null });
      const updatedTeam = await api.updateTeam(id, teamData);
      set({
        teams: get().teams.map((team) => (team.id === id ? updatedTeam : team)),
        loading: false,
      });
      await get().fetchTeams(); // Atualiza a lista após atualizar
    } catch (error) {
      set({ error: "Failed to update team", loading: false });
      throw error;
    }
  },
  deleteTeam: async (id) => {
    try {
      set({ loading: false, error: null });
      await api.deleteTeam(id);
      set({
        teams: get().teams.filter((team) => team.id !== id),
        loading: false,
      });
      await get().fetchTeams(); // Atualiza a lista após deletar
    } catch (error) {
      set({ error: "Failed to delete team", loading: false });
      throw error;
    }
  },
  addTeamMember: async (teamId, userId) => {
    try {
      set({ loading: false, error: null });
      await api.addTeamMember(teamId, userId);
      await get().fetchTeams(); // Atualiza a lista após adicionar membro
      set({ loading: false });
    } catch (error) {
      set({ error: "Failed to add team member", loading: false });
      throw error;
    }
  },
  removeTeamMember: async (userId) => {
    try {
      set({ loading: false, error: null });
      await api.removeTeamMember(userId);
      await get().fetchTeams(); // Atualiza a lista após remover membro
      set({ loading: false });
    } catch (error) {
      set({ error: "Failed to remove team member", loading: false });
      throw error;
    }
  },
}));
