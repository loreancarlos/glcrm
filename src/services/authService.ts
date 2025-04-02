import { api } from "./api";
import { User } from "../types";

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthError {
  message: string;
  code: "INVALID_CREDENTIALS" | "NETWORK_ERROR" | "UNKNOWN_ERROR";
}

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    try {
      return await api.login(email, password);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("fetch")) {
          throw new Error("Erro de conexão com o servidor");
        }
      }
      throw new Error("Email ou senha inválidos");
    }
  }

  static async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      await api.changePassword(currentPassword, newPassword);
    } catch (error) {
      throw new Error("Falha ao alterar a senha");
    }
  }

  static async adminResetPassword(
    userId: string,
    newPassword: string
  ): Promise<void> {
    try {
      await api.adminResetPassword(userId, newPassword);
    } catch (error) {
      throw new Error("Falha ao redefinir a senha");
    }
  }

  static async updateGoogleCalendar(
    userId: string,
    data: { 
      accessToken?: string | null; 
      refreshToken?: string | null;
      selectedCalendarId?: string | null;
    }
  ): Promise<void> {
    try {
      await api.updateGoogleCalendar(userId, data);
    } catch (error) {
      throw new Error("Falha ao atualizar configurações do Google Calendar");
    }
  }
}