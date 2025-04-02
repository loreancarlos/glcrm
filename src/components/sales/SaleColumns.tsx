import { Sale, User } from "../../types";
import { formatCurrency, formatDisplayName } from "../../utils/format";

export const getSaleColumns = (
  clients: Array<{ id: string; name: string }>,
  developments: Array<{ id: string; name: string }>,
  users: User[]
) => [
  {
    header: "Cliente",
    accessor: "clientId" as const,
    render: (clientId: string) =>
      formatDisplayName(
        clients.find((c) => c.id === clientId)?.name || clientId
      ),
  },
  {
    header: "Empreendimento",
    accessor: "developmentId" as const,
    render: (developmentId: string) =>
      developments.find((d) => d.id === developmentId)?.name || developmentId,
  },
  {
    header: "Corretor",
    accessor: "brokerId" as const,
    render: (brokerId: string) =>
      formatDisplayName(users.find((u) => u.id === brokerId)?.name || brokerId),
  },
  { header: "Quadra", accessor: "blockNumber" as const },
  { header: "Lote", accessor: "lotNumber" as const },
  /* {
    header: "Data da Compra",
    accessor: "purchaseDate" as const,
    render: (value: string) => formatDateDisplay(value),
  }, */
  {
    header: "Valor Total",
    accessor: "totalValue" as const,
    render: (value: number) => formatCurrency(Number(value)),
  },
  /*  {
    header: "Parcelas da Entrada",
    accessor: "downPaymentInstallments" as const,
    render: (value: string) => value == "1" ? "À Vista" : value,
  }, */
  /*  {
    header: "Valor da Comissão",
    accessor: "commissionValue" as const,
    render: (value: number) => formatCurrency(Number(value)),
  }, */
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
