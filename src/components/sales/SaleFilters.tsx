import React from "react";
import { Development, User } from "../../types";
import { SearchInput } from "../common/SearchInput";
import { Combobox } from "../common/Combobox";
import { generateYearOptions } from "../../utils/yearFilter";

interface SaleFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDevelopment: string;
  onDevelopmentChange: (value: string) => void;
  selectedBroker: string;
  onBrokerChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  developments: Development[];
  brokers: User[];
  saleYear: number;
}

export function SaleFilters({
  searchTerm,
  onSearchChange,
  selectedDevelopment,
  onDevelopmentChange,
  selectedBroker,
  onBrokerChange,
  selectedStatus,
  onStatusChange,
  selectedYear,
  onYearChange,
  developments,
  brokers,
  saleYear,
}: SaleFiltersProps) {
  const statusOptions = [
    { id: "", label: "" },
    { id: "paid", label: "Pago" },
    { id: "canceled", label: "Cancelado" },
    { id: "waiting_contract", label: "Aguardando a Assinatura do Contrato" },
    { id: "waiting_down_payment", label: "Aguardando Pagamento da Entrada" },
    { id: "waiting_seven_days", label: "Aguardando Prazo de 07 dias" },
    { id: "waiting_invoice", label: "Aguardando a Emissão de Nota Fiscal" },
  ];

  const activeBrokers = brokers.filter(
    (broker) => broker.role === "broker" && broker.active
  );

  const developmentOptions = [
    { id: "", label: "" },
    ...developments.map((dev) => ({ id: dev.id, label: dev.name })),
  ];

  const brokerOptions = [
    { id: "", label: "" },
    ...activeBrokers.map((broker) => ({ id: broker.id, label: broker.name })),
  ];

  // Gerar opções de ano começando do ano de criação do usuário
  const yearOptions = [
    { value: "", label: "Todos os anos" },
    ...generateYearOptions(saleYear).map((year) => ({
      value: year.id,
      label: year.label,
    })),
  ];

  return (
    <div className="space-y-4">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Pesquisar por cliente, cônjuge/sócio, cpf, quadra ou lote..."
      />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Combobox
          options={developmentOptions}
          value={selectedDevelopment}
          onChange={onDevelopmentChange}
          placeholder="Todos os empreendimentos"
          label="Empreendimento"
          allowClear
        />

        <Combobox
          options={brokerOptions}
          value={selectedBroker}
          onChange={onBrokerChange}
          placeholder="Todos os corretores"
          label="Corretor"
          allowClear
        />

        <Combobox
          options={statusOptions}
          value={selectedStatus}
          onChange={onStatusChange}
          placeholder="Todos os status"
          label="Status"
          allowClear
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ano
          </label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            {yearOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
