import { useSaleStore } from '../store/saleStore';

export function hasUserSales(userId: string): boolean {
  const { sales } = useSaleStore.getState();
  return sales.some(sale => sale.clientId === userId);
}

export function getDeleteUserErrorMessage(userId: string): string | null {
  if (hasUserSales(userId)) {
    return 'Não é possível excluir este cliente pois existem vendas associadas a ele.';
  }
  return null;
}