import React from "react";
import { Development, User, Team } from "../../types";
import { SearchInput } from "../common/SearchInput";
import { Combobox } from "../common/Combobox";

interface BusinessFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDevelopment: string;
  onDevelopmentChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  developments: Development[];
  showTeamFilter?: boolean;
  selectedTeam?: string;
  onTeamChange?: (value: string) => void;
  teams?: Team[];
  showBrokerFilter?: boolean;
  selectedBroker?: string;
  onBrokerChange?: (value: string) => void;
  teamBrokers?: User[];
  availableBrokers?: User[];
  hasValidationErrors?: boolean;
}

export function BusinessFilters({
  searchTerm,
  onSearchChange,
  selectedDevelopment,
  onDevelopmentChange,
  selectedStatus,
  onStatusChange,
  developments,
  showTeamFilter = false,
  selectedTeam = "",
  onTeamChange,
  teams = [],
  showBrokerFilter = false,
  selectedBroker = "",
  onBrokerChange,
  teamBrokers = [],
  availableBrokers = [],
  hasValidationErrors = false,
}: BusinessFiltersProps) {
  const developmentOptions = [
    { id: "", label: "" },
    ...developments.map((dev) => ({
      id: dev.id,
      label: dev.name,
    })),
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

  const statusOptions = [
    { id: "", label: "" },
    { id: "new", label: "Novo" },
    { id: "scheduled", label: "Agendado" },
    { id: "recall", label: "Retornar" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "appear", label: "Compareceu" },
    { id: "unfinishedCad", label: "CAD Incompleta" },
    { id: "finishedCad", label: "CAD Completa" },
    { id: "sold", label: "Vendido" },
    { id: "lost", label: "Perdido" },
    { id: "lostWithCad", label: "Perdido com CAD" },
  ];

  const shouldShowError =
    hasValidationErrors && (!selectedDevelopment || selectedStatus !== "new");

  return (
    <div className="space-y-4">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Pesquisar por nome, telefone ou empreendimento..."
      />

      <div
        className={`grid grid-cols-1 ${
          showTeamFilter
            ? "md:grid-cols-4"
            : showBrokerFilter
            ? "md:grid-cols-3"
            : "md:grid-cols-2"
        } gap-4`}>
        <Combobox
          options={developmentOptions}
          value={selectedDevelopment}
          onChange={onDevelopmentChange}
          placeholder="Todos os empreendimentos"
          label="Empreendimento"
          allowClear
          error={shouldShowError && !selectedDevelopment}
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

        <Combobox
          options={statusOptions}
          value={selectedStatus}
          onChange={onStatusChange}
          placeholder="Todos os status"
          label="Status"
          allowClear
          error={shouldShowError && selectedStatus !== "new"}
        />
      </div>
    </div>
  );
}
