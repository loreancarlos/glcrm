import { useSaleStore } from '../store/saleStore';

export function hasDevelopmentSales(developmentId: string): boolean {
  const { sales } = useSaleStore.getState();
  return sales.some(sale => sale.developmentId === developmentId);
}

export function getDeleteDevelopmentErrorMessage(developmentId: string): string | null {
  if (hasDevelopmentSales(developmentId)) {
    return 'Não é possível excluir este empreendimento pois existem vendas associadas a ele.';
  }
  return null;
}