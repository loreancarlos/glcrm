import React from "react";
import { formatCurrency } from "../../utils/format";

interface SaleSummaryProps {
  totalSales: number;
  totalCommissions: number;
  numberOfSales: number;
}

export function SaleSummary({
  totalSales,
  totalCommissions,
  numberOfSales,
}: SaleSummaryProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-dark-secondary">
      <h2 className="text-lg font-semibold mb-2 dark:text-white">Resumo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover">
          <p className="text-sm text-gray-500 dark:text-white">Total em Vendas</p>
          <p className="text-xl font-bold dark:text-white">
            {formatCurrency(Number(totalSales))}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover">
          <p className="text-sm text-gray-500 dark:text-white">Total em Comissões</p>
          <p className="text-xl font-bold dark:text-white">
            {formatCurrency(Number(totalCommissions))}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow dark:bg-dark-hover">
          <p className="text-sm text-gray-500 dark:text-white">Número de Vendas</p>
          <p className="text-xl font-bold dark:text-white">{numberOfSales}</p>
        </div>
      </div>
    </div>
  );
}
