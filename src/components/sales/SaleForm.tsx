import React from "react";
import { Sale, User } from "../../types";
import { Combobox } from "../common/Combobox";
import { formatDate } from "../../utils/format";

interface SaleFormProps {
  formData: {
    clientId: string;
    secondBuyerId: string | null;
    developmentId: string;
    brokerId: string;
    blockNumber: string;
    lotNumber: string;
    totalValue: number;
    downPaymentInstallments: string;
    purchaseDate: string;
    commissionValue: number;
    status: Sale["status"];
  };
  setFormData: (data: any) => void;
  clients: Array<{ id: string; name: string }>;
  developments: Array<{ id: string; name: string }>;
  brokers: User[];
  isEditing: boolean;
}

export function SaleForm({
  formData,
  setFormData,
  clients,
  developments,
  brokers,
  isEditing,
}: SaleFormProps) {
  const activeBrokers = brokers.filter(
    (broker) =>
      (broker.role === "broker" || broker.role === "teamLeader") &&
      broker.active
  );

  const statusOptions = [
    { value: "paid", label: "Pago" },
    { value: "canceled", label: "Cancelado" },
    { value: "waiting_contract", label: "Aguardando a Assinatura do Contrato" },
    { value: "waiting_down_payment", label: "Aguardando Pagamento da Entrada" },
    { value: "waiting_seven_days", label: "Aguardando Prazo de 07 dias" },
    { value: "waiting_invoice", label: "Aguardando a Emissão de Nota Fiscal" },
  ];

  const downPaymentOptions = [
    { value: "1", label: "À Vista" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
  ];

  const clientOptions = clients.map((client) => ({
    id: client.id,
    label: client.name,
  }));

  const developmentOptions = developments.map((development) => ({
    id: development.id,
    label: development.name,
  }));

  const brokerOptions = activeBrokers.map((broker) => ({
    id: broker.id,
    label: broker.name,
  }));

  return (
    <div className="space-y-4">
      <Combobox
        options={clientOptions}
        value={formData.clientId}
        onChange={(value) => setFormData({ ...formData, clientId: value })}
        placeholder="Selecione um cliente"
        label="Cliente"
        required
      />

      <Combobox
        options={clientOptions}
        value={formData.secondBuyerId || ""}
        onChange={(value) =>
          setFormData({ ...formData, secondBuyerId: value || null })
        }
        placeholder="Selecione um segundo comprador (opcional)"
        label="Segundo Comprador"
        allowClear
      />

      <Combobox
        options={developmentOptions}
        value={formData.developmentId}
        onChange={(value) => setFormData({ ...formData, developmentId: value })}
        placeholder="Selecione um empreendimento"
        label="Empreendimento"
        required
      />

      <Combobox
        options={brokerOptions}
        value={formData.brokerId}
        onChange={(value) => setFormData({ ...formData, brokerId: value })}
        placeholder="Selecione um corretor"
        label="Corretor"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Número da Quadra
        </label>
        <input
          type="text"
          value={formData.blockNumber}
          onChange={(e) =>
            setFormData({ ...formData, blockNumber: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Número do Lote
        </label>
        <input
          type="text"
          value={formData.lotNumber}
          onChange={(e) =>
            setFormData({ ...formData, lotNumber: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Data da Compra
        </label>
        <input
          type="date"
          value={formatDate(formData.purchaseDate)}
          onChange={(e) =>
            setFormData({ ...formData, purchaseDate: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Valor Total
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formData.totalValue}
          onChange={(e) =>
            setFormData({
              ...formData,
              totalValue: parseFloat(e.target.value) || 0,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Número de Parcelas da Entrada
        </label>
        <select
          value={formData.downPaymentInstallments}
          onChange={(e) =>
            setFormData({
              ...formData,
              downPaymentInstallments: e.target.value,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required>
          <option value="">Selecione o número de parcelas</option>
          {downPaymentOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Valor da Comissão
        </label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={formData.commissionValue}
          onChange={(e) =>
            setFormData({
              ...formData,
              commissionValue: parseFloat(e.target.value) || 0,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as Sale["status"],
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
