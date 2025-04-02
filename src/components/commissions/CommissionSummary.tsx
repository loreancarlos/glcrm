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
    <>
      <h1 className="text-2xl font-bold">Resumo</h1>
      <div className="bg-gray-50 rounded-lg">
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
    </>
  );
}
