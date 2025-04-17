import React from "react";
import { formatCurrency } from "../../utils/format";

interface CommissionSummaryProps {
  totalSales: number;
  totalCommissions: number;
  numberOfSales: number;
}

export function CommissionSummary({
  totalSales,
  totalCommissions,
  numberOfSales,
}: CommissionSummaryProps) {
  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg dark:bg-dark-secondary">
      <h1 className="text-2xl font-bold mb-2  dark:text-white ">Resumo</h1>
      <div className="bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 dark:bg-dark-secondary">
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
    </div>
  );
}
