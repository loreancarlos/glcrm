import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useTeamStore } from "../store/teamStore";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { Key, Calendar } from "lucide-react";
import { useGoogleLogin } from '@react-oauth/google';

export function Profile() {
  const { user, changePassword, updateGoogleCalendar } = useAuthStore();
  const { teams } = useTeamStore();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [calendars, setCalendars] = useState<Array<{ id: string; summary: string }>>([]);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já tem um token do Google Calendar
    if (user?.google_calendar_token) {
      setIsGoogleConnected(true);
      setSelectedCalendar(user.google_calendar_id || null);
      fetchCalendars();
    }
  }, [user]);

  const fetchCalendars = async () => {
    if (!user?.google_calendar_token) return;

    try {
      const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          'Authorization': `Bearer ${user.google_calendar_token}`
        }
      });

      if (!calendarResponse.ok) {
        // Se o token expirou, tenta renovar usando o refresh token
        if (calendarResponse.status === 401 && user.google_calendar_refresh_token) {
          const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              client_id: '480482032578-1gecsmq9615errtu0quhv8dsqbf1gb0j.apps.googleusercontent.com',
              client_secret: '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',
              refresh_token: user.google_calendar_refresh_token,
              grant_type: 'refresh_token',
            }),
          });

          if (tokenResponse.ok) {
            const newTokens = await tokenResponse.json();
            await updateGoogleCalendar(user.id, {
              accessToken: newTokens.access_token,
              refreshToken: user.google_calendar_refresh_token // Mantém o refresh token existente
            });
            // Tenta buscar os calendários novamente com o novo token
            return fetchCalendars();
          }
        }
        throw new Error('Failed to fetch calendars');
      }

      const data = await calendarResponse.json();
      setCalendars(data.items);
    } catch (error) {
      console.error('Error fetching calendars:', error);
      setError("Erro ao carregar calendários");
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        // Primeiro, obter o refresh token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            code: response.code,
            client_id: '480482032578-1gecsmq9615errtu0quhv8dsqbf1gb0j.apps.googleusercontent.com',
            client_secret: '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',
            redirect_uri: window.location.origin,
            grant_type: 'authorization_code',
          }),
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for tokens');
        }

        const tokens = await tokenResponse.json();
        
        // Fetch calendars list
        const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`
          }
        });
        
        const data = await calendarResponse.json();
        setCalendars(data.items);
        setIsGoogleConnected(true);
        
        // Save both access token and refresh token
        if (user) {
          await updateGoogleCalendar(user.id, {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            selectedCalendarId: null
          });
        }
        
        setSuccessMessage("Conectado com sucesso ao Google Calendar!");
      } catch (error) {
        setError("Erro ao conectar com o Google Calendar");
        setIsGoogleConnected(false);
      }
    },
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/calendar',
    access_type: 'offline',
    prompt: 'consent',
  });

  const handleDisconnectGoogle = async () => {
    try {
      if (user) {
        await updateGoogleCalendar(user.id, {
          accessToken: null,
          refreshToken: null,
          selectedCalendarId: null
        });
        setIsGoogleConnected(false);
        setCalendars([]);
        setSelectedCalendar(null);
        setSuccessMessage("Desconectado do Google Calendar com sucesso!");
      }
    } catch (error) {
      setError("Erro ao desconectar do Google Calendar");
    }
  };

  const handleCalendarSelect = async (calendarId: string) => {
    try {
      if (user) {
        await updateGoogleCalendar(user.id, {
          selectedCalendarId: calendarId
        });
        setSelectedCalendar(calendarId);
        setSuccessMessage("Calendário selecionado com sucesso!");
      }
    } catch (error) {
      setError("Erro ao selecionar calendário");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      setError("A nova senha deve ter pelo menos 6 caracteres");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setSuccessMessage("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Erro ao alterar senha"
      );
    }
  };

  const getUserTeam = () => {
    if (user?.role === "teamLeader") {
      const team = teams.find((t) => t.leaderId === user.id);
      return team ? team.name : "Nenhum";
    }
    if (!user?.teamId) return "Nenhum";
    const team = teams.find((t) => t.id === user.teamId);
    return team ? team.name : "Nenhum";
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Perfil do Usuário</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <p className="mt-1 text-gray-900">{user.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Perfil
            </label>
            <p className="mt-1 text-gray-900">
              {user.role === "admin" && "Administrador"}
              {user.role === "broker" && "Corretor"}
              {user.role === "teamLeader" && "Supervisor"}
              {user.role === "user" && "Usuário"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Time
            </label>
            <p className="mt-1 text-gray-900">{getUserTeam()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="h-5 w-5 text-gray-400" />
          <h2 className="text-2xl font-bold">Google Calendar</h2>
        </div>

        <div className="space-y-4">
          {!isGoogleConnected ? (
            <button
              onClick={() => login()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Conectar com Google Calendar
            </button>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600">Conectado ao Google Calendar</span>
                <button
                  onClick={handleDisconnectGoogle}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Desconectar
                </button>
              </div>

              {calendars.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selecione um Calendário
                  </label>
                  <select
                    value={selectedCalendar || ""}
                    onChange={(e) => handleCalendarSelect(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="">Selecione um calendário</option>
                    {calendars.map((calendar) => (
                      <option key={calendar.id} value={calendar.id}>
                        {calendar.summary}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Key className="h-5 w-5 text-gray-400" />
          <h2 className="text-2xl font-bold">Alterar Senha</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Senha Atual
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nova Senha
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          {error && <ErrorMessage message={error} />}

          {successMessage && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Alterar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}