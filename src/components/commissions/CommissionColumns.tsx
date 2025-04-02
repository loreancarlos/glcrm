import { Sale } from "../../types";
import {
  formatCurrency,
  formatDateDisplay,
  formatDisplayName,
} from "../../utils/format";

export const getCommissionColumns = () => [
  {
    header: "Data da Venda",
    accessor: "purchaseDate" as const,
    render: (value: string) => formatDateDisplay(value),
  },
  {
    header: "Cliente",
    accessor: "clientName" as const,
    render: (value: string) => formatDisplayName(value),
  },
  {
    header: "Empreendimento",
    accessor: "developmentName" as const,
  },
  {
    header: "Quadra",
    accessor: "blockNumber" as const,
  },
  {
    header: "Lote",
    accessor: "lotNumber" as const,
  },
  {
    header: "Valor da Venda",
    accessor: "totalValue" as const,
    render: (value: number) => formatCurrency(Number(value)),
  },
  {
    header: "Valor da Comissão",
    accessor: "commissionValue" as const,
    render: (value: number) => formatCurrency(Number(value)),
  },
  {
    header: "Última Alteração",
    accessor: "updatedAt" as const,
    render: (value: string) => formatDateDisplay(value),
  },
  {
    header: "Status",
    accessor: "status" as const,
    render: (value: Sale["status"]) => {
      const statusMap = {
        paid: "Pago",
        canceled: "Cancelado",
        waiting_contract: "Aguardando a Assinatura do Contrato",
        waiting_down_payment: "Aguardando Pagamento da Entrada",
        waiting_seven_days: "Aguardando Prazo de 07 dias",
        waiting_invoice: "Aguardando a Emissão de Nota Fiscal",
      };
      const colorMap = {
        paid: "bg-green-100 text-green-800",
        canceled: "bg-red-100 text-red-800",
        waiting_contract: "bg-yellow-100 text-yellow-800",
        waiting_down_payment: "bg-orange-100 text-orange-800",
        waiting_seven_days: "bg-blue-100 text-blue-800",
        waiting_invoice: "bg-purple-100 text-purple-800",
      };
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[value]}`}>
          {statusMap[value]}
        </span>
      );
    },
  },
];
