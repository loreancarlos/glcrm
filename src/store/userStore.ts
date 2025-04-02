import { create } from "zustand";
import { User } from "../types";
import { api } from "../services/api";

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, "id">) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  adminResetPassword: (userId: string, newPassword: string) => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ loading: false, error: null });
      const users = await api.getUsers();
      set({ users, loading: false });
    } catch (error) {
      set({ error: "Falha ao carregar usuários", loading: false });
    }
  },

  addUser: async (userData) => {
    try {
      set({ loading: false, error: null });
      const user = await api.createUser(userData);
      set({ users: [...get().users, user], loading: false });
    } catch (error) {
      set({ error: "Falha ao criar usuário", loading: false });
      throw error;
    }
  },

  updateUser: async (id, userData) => {
    try {
      set({ loading: false, error: null });
      const updatedUser = await api.updateUser(id, userData);
      set({
        users: get().users.map((user) => (user.id === id ? updatedUser : user)),
        loading: false,
      });
    } catch (error) {
      set({ error: "Falha ao atualizar usuário", loading: false });
      throw error;
    }
  },
 
  deleteUser: async (id) => {
    try {
      set({ loading: false, error: null });
      await api.deleteUser(id);
      const updatedUsers = get().users.filter((user) => user.id !== id);

      set({
        users: updatedUsers,
        loading: false,
      });
    } catch (error) {
      set({ error: "Falha ao excluir usuário", loading: false });
      throw error;
    }
  },

  toggleUserStatus: async (id) => {
    try {
      set({ loading: false, error: null });
      const updatedUser = await api.toggleUserStatus(id);
      set({
        users: get().users.map((user) => (user.id === id ? updatedUser : user)),
        loading: false,
      });
    } catch (error) {
      set({ error: "Falha ao alterar status do usuário", loading: false });
      throw error;
    }
  },

  adminResetPassword: async (userId: string, newPassword: string) => {
    try {
      set({ loading: false, error: null });
      await api.adminResetPassword(userId, newPassword);
      set({ loading: false });
    } catch (error) {
      set({ error: "Falha ao redefinir senha", loading: false });
      throw error;
    }
  },
}));
