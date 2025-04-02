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
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-lg font-semibold mb-2">Resumo</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total em Vendas</p>
          <p className="text-xl font-bold">
            {formatCurrency(Number(totalSales))}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Total em Comissões</p>
          <p className="text-xl font-bold">
            {formatCurrency(Number(totalCommissions))}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-500">Número de Vendas</p>
          <p className="text-xl font-bold">{numberOfSales}</p>
        </div>
      </div>
    </div>
  );
}
