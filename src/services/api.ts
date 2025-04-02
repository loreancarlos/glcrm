import { API_URL } from "../config";

class ApiClient {
  private baseURL: string;
  private token: string | null;
  private ws: WebSocket | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();

  constructor() {
    this.baseURL = API_URL;
    this.token = localStorage.getItem("auth-storage")
      ? JSON.parse(localStorage.getItem("auth-storage")!).state.token
      : null;

    if (this.token) {
      this.connectWebSocket();
    }
  }

  private connectWebSocket() {
    const wsUrl = API_URL.replace("http", "ws");
    this.ws = new WebSocket(`${wsUrl}?token=${this.token}`);

    this.ws.onmessage = (event) => {
      const { type, data } = JSON.parse(event.data);
      const handler = this.messageHandlers.get(type);
      if (handler) {
        handler(data);
      }
    };

    this.ws.onclose = () => {
      setTimeout(() => this.connectWebSocket(), 5000);
    };
  }

  setToken(token: string) {
    this.token = token;
    if (this.ws) {
      this.ws.close();
    }
    this.connectWebSocket();
  }

  clearToken() {
    this.token = null;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  onMessage(type: string, handler: (data: any) => void) {
    this.messageHandlers.set(type, handler);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        throw new Error("Session expired");
      }
      const error = await response.json();
      throw new Error(error.error || "An error occurred");
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
    this.setToken(response.token);
    return response;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<void>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  async adminResetPassword(userId: string, newPassword: string) {
    return this.request<void>("/auth/admin/reset-password", {
      method: "POST",
      body: JSON.stringify({ userId, newPassword }),
    });
  }

  // Users
  async getUsers() {
    return this.request<any[]>("/users");
  }

  async createUser(data: any) {
    return this.request<any>("/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateUser(id: string, data: any) {
    return this.request<any>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteUser(id: string) {
    return this.request<void>(`/users/${id}`, {
      method: "DELETE",
    });
  }

  async toggleUserStatus(id: string) {
    return this.request<any>(`/users/${id}/toggle-status`, {
      method: "PATCH",
    });
  }

  // Clients
  async getClients() {
    return this.request<any[]>("/clients");
  }

  async createClient(data: any) {
    return this.request<any>("/clients", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateClient(id: string, data: any) {
    return this.request<any>(`/clients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteClient(id: string) {
    return this.request<void>(`/clients/${id}`, {
      method: "DELETE",
    });
  }

  // Developments
  async getDevelopments() {
    return this.request<any[]>("/developments");
  }

  async createDevelopment(data: any) {
    return this.request<any>("/developments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateDevelopment(id: string, data: any) {
    return this.request<any>(`/developments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteDevelopment(id: string) {
    return this.request<void>(`/developments/${id}`, {
      method: "DELETE",
    });
  }

  // Sales
  async getSales() {
    return this.request<any[]>("/sales");
  }

  async createSale(data: any) {
    return this.request<any>("/sales", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateSale(id: string, data: any) {
    return this.request<any>(`/sales/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteSale(id: string) {
    return this.request<void>(`/sales/${id}`, {
      method: "DELETE",
    });
  }

  async updateInstallmentStatus(
    saleId: string,
    installmentNumber: number,
    data: { billIssued: boolean; billPaid: boolean }
  ) {
    return this.request<any>(
      `/sales/${saleId}/installments/${installmentNumber}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
  }

  // Teams
  async getTeams() {
    return this.request<any[]>("/teams");
  }

  async createTeam(data: any) {
    return this.request<any>("/teams", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateTeam(id: string, data: any) {
    return this.request<any>(`/teams/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteTeam(id: string) {
    return this.request<void>(`/teams/${id}`, {
      method: "DELETE",
    });
  }

  async addTeamMember(teamId: string, userId: string) {
    return this.request<any>("/teams/members", {
      method: "POST",
      body: JSON.stringify({ teamId, userId }),
    });
  }

  async removeTeamMember(userId: string) {
    return this.request<any>(`/teams/members/${userId}`, {
      method: "DELETE",
    });
  }

  // Leads
  async getLeads() {
    return this.request<any[]>("/leads");
  }

  async createLead(data: any) {
    return this.request<any>("/leads", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateLead(id: string, data: any) {
    return this.request<any>(`/leads/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteLead(id: string) {
    return this.request<void>(`/leads/${id}`, {
      method: "DELETE",
    });
  }

  // Business
  async getBusiness() {
    return this.request<any[]>("/business");
  }

  async createBusiness(data: any) {
    return this.request<any>("/business", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateBusiness(id: string, data: any) {
    return this.request<any>(`/business/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteBusiness(id: string) {
    return this.request<void>(`/business/${id}`, {
      method: "DELETE",
    });
  }

  // Call Mode Sessions
  async getCallModeSessions() {
    return this.request<any[]>("/callModeSessions");
  }

  async createCallModeSession(data: {
    startTime: Date;
    endTime: Date;
    leadsViewed: string[];
    answeredCalls: number;
    scheduledCalls: number;
    whatsappCalls: number;
    notInterestCalls: number;
    recallCalls: number;
    voicemailCalls: number;
    invalidNumberCalls: number;
    notReceivingCalls: number;
  }) {
    return this.request<any>("/callModeSessions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateCallModeSession(
    id: string,
    data: {
      endTime?: Date;
      leadsViewed?: string[];
      answeredCalls?: number;
      scheduledCalls?: number;
      whatsappCalls?: number;
      notInterestCalls?: number;
      recallCalls?: number;
      voicemailCalls?: number;
      invalidNumberCalls?: number;
      notReceivingCalls?: number;
    }
  ) {
    return this.request<any>(`/callModeSessions/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // Google Calendar methods
  async updateGoogleCalendar(
    userId: string,
    data: { 
      accessToken?: string | null; 
      refreshToken?: string | null;
      selectedCalendarId?: string | null;
    }
  ) {
    return this.request<void>(`/users/${userId}/google-calendar`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async createCalendarEvent(
    businessId: string,
    data: {
      summary: string;
      description: string;
      startDateTime: string;
      endDateTime: string;
    }
  ) {
    return this.request<void>(`/business/${businessId}/calendar-event`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();