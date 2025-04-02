import { create } from "zustand";
import { Sale } from "../types";
import { api } from "../services/api";

interface SaleState {
  sales: Sale[];
  loading: boolean;
  error: string | null;
  fetchSales: () => Promise<void>;
  addSale: (sale: Omit<Sale, "id">) => Promise<void>;
  updateSale: (id: string, sale: Partial<Sale>) => Promise<Sale>;
  deleteSale: (id: string) => Promise<void>;
  updateInstallmentStatus: (
    saleId: string,
    installmentNumber: number,
    updates: { billIssued?: boolean; billPaid?: boolean }
  ) => Promise<void>;
}

export const useSaleStore = create<SaleState>((set, get) => ({
  sales: [],
  loading: false,
  error: null,
  fetchSales: async () => {
    try {
      set({ loading: false, error: null });
      const sales = await api.getSales();
      set({ sales, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch sales", loading: false });
    }
  },
  addSale: async (saleData) => {
    try {
      set({ loading: false, error: null });
      const sale = await api.createSale(saleData);
      set({
        sales: [...get().sales, sale],
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to create sale", loading: false });
      throw error;
    }
  },
  updateSale: async (id, saleData) => {
    try {
      set({ loading: false, error: null });
      const updatedSale = await api.updateSale(id, saleData);
      set({
        sales: get().sales.map((sale) => (sale.id === id ? updatedSale : sale)),
        loading: false,
      });
      return updatedSale;
    } catch (error) {
      set({ error: "Failed to update sale", loading: false });
      throw error;
    }
  },
  deleteSale: async (id) => {
    try {
      set({ loading: false, error: null });
      await api.deleteSale(id);
      const updatedSales = get().sales.filter((sale) => sale.id !== id);
      set({ sales: updatedSales, loading: false });
    } catch (error) {
      set({ error: "Failed to delete sale", loading: false });
      throw error;
    }
  },
  updateInstallmentStatus: async (saleId, installmentNumber, updates) => {
    try {
      set({ loading: false, error: null });
      const updatedSale = await api.updateInstallmentStatus(
        saleId,
        installmentNumber,
        updates as { billIssued: boolean; billPaid: boolean }
      );
      set({
        sales: get().sales.map((sale) =>
          sale.id === saleId ? updatedSale : sale
        ),
        loading: false,
      });
    } catch (error) {
      set({ error: "Failed to update installment status", loading: false });
      throw error;
    }
  },
}));
