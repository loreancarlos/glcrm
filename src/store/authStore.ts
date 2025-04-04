import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "../types";
import { AuthService, AuthError } from "../services/authService";

interface GoogleCalendarUpdate {
  accessToken?: string | null;
  refreshToken?: string | null;
  selectedCalendarId?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  adminResetPassword: (userId: string, newPassword: string) => Promise<void>;
  updateGoogleCalendar: (
    userId: string,
    data: GoogleCalendarUpdate
  ) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const { user, token } = await AuthService.login(email, password);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          const authError = error as AuthError;
          throw new Error(authError.message);
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
      changePassword: async (currentPassword: string, newPassword: string) => {
        try {
          await AuthService.changePassword(currentPassword, newPassword);
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Falha ao alterar a senha");
        }
      },
      adminResetPassword: async (userId: string, newPassword: string) => {
        try {
          await AuthService.adminResetPassword(userId, newPassword);
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error("Falha ao redefinir a senha");
        }
      },
      updateGoogleCalendar: async (
        userId: string,
        data: GoogleCalendarUpdate
      ) => {
        try {
          await AuthService.updateGoogleCalendar(userId, {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            selectedCalendarId: data.selectedCalendarId,
          });

          // Atualiza o estado do usuário com as novas informações do Google Calendar
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  google_calendar_token: data.accessToken ?? null,
                  google_calendar_refresh_token: data.refreshToken ?? null,
                  google_calendar_id: data.selectedCalendarId ?? null,
                }
              : null,
          }));
        } catch (error) {
          throw new Error(
            "Falha ao atualizar configurações do Google Calendar"
          );
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
