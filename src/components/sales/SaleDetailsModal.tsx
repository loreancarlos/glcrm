import React from "react";
import { Modal } from "../common/Modal";
import { Sale, User, Client, Development } from "../../types";
import { formatCurrency, formatDateDisplay } from "../../utils/format";
import { formatCPF } from "../../utils/masks";

interface SaleDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
  clients: Client[];
  developments: Development[];
  users: User[];
}

export function SaleDetailsModal({
  isOpen,
  onClose,
  sale,
  clients,
  developments,
  users,
}: SaleDetailsModalProps) {
  if (!sale) return null;

  const client = clients.find((c) => c.id === sale.clientId);
  const secondBuyer = sale.secondBuyerId
    ? clients.find((c) => c.id === sale.secondBuyerId)
    : null;
  const development = developments.find((d) => d.id === sale.developmentId);
  const broker = users.find((u) => u.id === sale.brokerId);

  const statusMap = {
    paid: "Pago",
    canceled: "Cancelado",
    waiting_contract: "Aguardando a Assinatura do Contrato",
    waiting_down_payment: "Aguardando Pagamento da Entrada",
    waiting_seven_days: "Aguardando Prazo de 07 dias",
    waiting_invoice: "Aguardando a Emissão de Nota Fiscal",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalhes da Venda">
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Comprador</h3>
            <p className="mt-1 text-sm text-gray-900">{client?.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">CPF</h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatCPF(client?.cpf || "")}
            </p>
          </div>
          {secondBuyer && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Sociedade/Cônjuge
              </h3>
              <p className="mt-1 text-sm text-gray-900">{secondBuyer.name}</p>
            </div>
          )}
          {secondBuyer && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">CPF</h3>
              <p className="mt-1 text-sm text-gray-900">
                {formatCPF(secondBuyer.cpf) || ""}
              </p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Empreendimento
            </h3>
            <p className="mt-1 text-sm text-gray-900">{development?.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Corretor</h3>
            <p className="mt-1 text-sm text-gray-900">{broker?.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Quadra</h3>
            <p className="mt-1 text-sm text-gray-900">{sale.blockNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Lote</h3>
            <p className="mt-1 text-sm text-gray-900">{sale.lotNumber}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Data da Compra
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatDateDisplay(sale.purchaseDate)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Parcelas da Entrada
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {sale.downPaymentInstallments == "1"
                ? "À Vista"
                : sale.downPaymentInstallments}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Valor Total</h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatCurrency(Number(sale.totalValue))}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Valor da Comissão
            </h3>
            <p className="mt-1 text-sm text-gray-900">
              {formatCurrency(Number(sale.commissionValue))}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Status</h3>
            <p className="mt-1 text-sm text-gray-900">
              {statusMap[sale.status]}
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
