import React from "react";
import { Development, User, Team } from "../../types";
import { SearchInput } from "../common/SearchInput";
import { Combobox } from "../common/Combobox";
import { getCurrentYear, generateYearOptions } from "../../utils/yearFilter";

interface CommissionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDevelopment: string;
  onDevelopmentChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  developments: Development[];
  userCreationYear: number;
  showBrokerFilter?: boolean;
  selectedBroker?: string;
  onBrokerChange?: (value: string) => void;
  teamBrokers?: User[];
  // New props for admin filters
  showTeamFilter?: boolean;
  selectedTeam?: string;
  onTeamChange?: (value: string) => void;
  teams?: Team[];
  availableBrokers?: User[];
}

export function CommissionFilters({
  searchTerm,
  onSearchChange,
  selectedDevelopment,
  onDevelopmentChange,
  selectedStatus,
  onStatusChange,
  selectedYear,
  onYearChange,
  developments,
  userCreationYear,
  showBrokerFilter = false,
  selectedBroker = "",
  onBrokerChange,
  teamBrokers = [],
  showTeamFilter = false,
  selectedTeam = "",
  onTeamChange,
  teams = [],
  availableBrokers = [],
}: CommissionFiltersProps) {
  const statusOptions = [
    { value: "", label: "Todos os status" },
    { value: "paid", label: "Pago" },
    { value: "canceled", label: "Cancelado" },
    { value: "waiting_contract", label: "Aguardando a Assinatura do Contrato" },
    { value: "waiting_down_payment", label: "Aguardando Pagamento da Entrada" },
    { value: "waiting_seven_days", label: "Aguardando Prazo de 07 dias" },
    { value: "waiting_invoice", label: "Aguardando a Emissão de Nota Fiscal" },
  ];

  const developmentOptions = [
    { id: "", label: "" },
    ...developments.map((dev) => ({ id: dev.id, label: dev.name })),
  ];

  const teamOptions = [
    { id: "", label: "" },
    ...teams.map((team) => ({ id: team.id, label: team.name })),
  ];

  const brokerOptions = [
    { id: "", label: "" },
    ...(showTeamFilter ? availableBrokers : teamBrokers)
      .filter((broker) => broker.active)
      .map((broker) => ({ id: broker.id, label: broker.name })),
  ];

  // Gerar opções de ano começando do ano de criação do usuário
  const yearOptions = [
    { value: "", label: "Todos os anos" },
    ...generateYearOptions(userCreationYear).map((year) => ({
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
      <div
        className={`grid grid-cols-1 ${
          showTeamFilter
            ? "md:grid-cols-5"
            : showBrokerFilter
            ? "md:grid-cols-4"
            : "md:grid-cols-3"
        } gap-4`}>
        <Combobox
          options={developmentOptions}
          value={selectedDevelopment}
          onChange={onDevelopmentChange}
          placeholder="Todos os empreendimentos"
          label="Empreendimento"
          allowClear
        />

        {showTeamFilter && onTeamChange && (
          <Combobox
            options={teamOptions}
            value={selectedTeam}
            onChange={onTeamChange}
            placeholder="Todos os times"
            label="Time"
            allowClear
          />
        )}

        {(showBrokerFilter || showTeamFilter) && onBrokerChange && (
          <Combobox
            options={brokerOptions}
            value={selectedBroker}
            onChange={onBrokerChange}
            placeholder="Todos os corretores"
            label="Corretor"
            allowClear
          />
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

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
