import React from "react";
import { Team, User, Business } from "../../types";
import { Combobox } from "../common/Combobox";

interface ReportFiltersProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  showTeamFilter?: boolean;
  selectedTeam?: string;
  onTeamChange?: (value: string) => void;
  teams?: Team[];
  showBrokerFilter?: boolean;
  selectedBroker?: string;
  onBrokerChange?: (value: string) => void;
  availableBrokers?: User[];
  selectedSource: string;
  onSourceChange: (value: string) => void;
}

export function ReportFilters({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  showTeamFilter = false,
  selectedTeam = "",
  onTeamChange,
  teams = [],
  showBrokerFilter = false,
  selectedBroker = "",
  onBrokerChange,
  availableBrokers = [],
  selectedSource,
  onSourceChange,
}: ReportFiltersProps) {
  const teamOptions = [
    { id: "", label: "" },
    ...teams.map((team) => ({ id: team.id, label: team.name })),
  ];

  const brokerOptions = [
    { id: "", label: "" },
    ...availableBrokers
      .filter((broker) => broker.active)
      .map((broker) => ({ id: broker.id, label: broker.name })),
  ];

  const sourceOptions = [
    { id: "", label: "" },
    { id: "indication", label: "Indicação" },
    { id: "organic", label: "Orgânico" },
    { id: "website", label: "Site" },
    { id: "paidTraffic", label: "Tráfego Pago" },
    { id: "doorToDoor", label: "Porta a Porta" },
    { id: "tent", label: "Tenda" },
    { id: "importedList", label: "Lista Importada" },
  ];

  return (
    <div className="space-y-4">
      <div
        className={`grid grid-cols-1 ${
          showTeamFilter ? "md:grid-cols-5" : "md:grid-cols-4"
        } gap-4`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Inicial
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Data Final
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

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

        {showBrokerFilter && onBrokerChange && (
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
          options={sourceOptions}
          value={selectedSource}
          onChange={onSourceChange}
          placeholder="Todas as origens"
          label="Origem"
          allowClear
        />
      </div>
    </div>
  );
}