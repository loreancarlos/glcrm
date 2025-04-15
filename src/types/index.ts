import { z } from "zod";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "broker" | "teamLeader";
  active: boolean;
  lastLogin?: string;
  teamId: string | null;
  createdAt: string;
  google_calendar_token?: string | null;
  google_calendar_refresh_token?: string | null;
  google_calendar_id?: string | null;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
}

export interface Development {
  id: string;
  name: string;
  location: string;
  description: string;
}

export interface Sale {
  updatedAt: string;
  id: string;
  clientId: string;
  secondBuyerId: string | null;
  developmentId: string;
  brokerId: string;
  blockNumber: string;
  lotNumber: string;
  totalValue: number;
  downPaymentInstallments: string;
  purchaseDate: string;
  commissionValue: number;
  status:
    | "paid"
    | "canceled"
    | "waiting_contract"
    | "waiting_down_payment"
    | "waiting_seven_days"
    | "waiting_invoice";
}

export interface Team {
  id: string;
  name: string;
  leaderId: string;
  createdAt: string;
  updatedAt: string;
  members?: User[];
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  developmentsInterest: string[];
  brokerId: string;
  createdAt: string;
  updatedAt: string;
  lastContact?: Date;
  source?:
    | "indication"
    | "organic"
    | "website"
    | "paidTraffic"
    | "doorToDoor"
    | "tent"
    | "importedList";
}

export interface Business {
  id: string;
  leadId: string;
  developmentId: string;
  brokerId: string;
  source:
    | "indication"
    | "organic"
    | "website"
    | "paidTraffic"
    | "doorToDoor"
    | "tent"
    | "importedList";
  status: "new" | "recall" | "whatsapp" | "scheduled" | "lost";
  scheduledAt?: string | null;
  recallAt?: string | null;
  notes?: string | null;
  lastCallAt?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface CallModeSession {
  id: string;
  userId: string;
  developmentId: string;
  startTime: Date;
  endTime: Date;
  businessViewed: string[];
  answeredCalls: number;
  talkedCalls: number;
  scheduledCalls: number;
  whatsappCalls: number;
  notInterestCalls: number;
  recallCalls: number;
  voicemailCalls: number;
  invalidNumberCalls: number;
  notReceivingCalls: number;
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  brokerId?: string;
  teamId?: string;
}

export interface ReportData {
  totalBusinessViewed: number;
  answeredCalls: number;
  talkedCalls: number;
  scheduledCalls: number;
  whatsappCalls: number;
  notInterestCalls: number;
  recallCalls: number;
  voicemailCalls: number;
  invalidNumberCalls: number;
  notReceivingCalls: number;
}
