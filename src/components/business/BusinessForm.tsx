import React, { useState, useEffect } from "react";
import { Business, Development, Lead, User, Team } from "../../types";
import { Combobox } from "../common/Combobox";
import { formatDateTimeBusinessForm } from "../../utils/format";
import { useBusinessStore } from "../../store/businessStore";
import { useAuthStore } from "../../store/authStore";

interface BusinessFormProps {
  formData: Partial<Business>;
  setFormData: (data: Partial<Business>) => void;
  leads: Lead[];
  developments: Development[];
  isEditing: boolean;
  brokers?: User[];
  showBrokerField?: boolean;
}

export function BusinessForm({
  formData,
  setFormData,
  leads,
  developments,
  isEditing,
  brokers = [],
  showBrokerField = false,
}: BusinessFormProps) {
  const { businesses } = useBusinessStore();
  const { user } = useAuthStore();

  const sourceOptions = [
    { value: "paidTraffic", label: "Tráfego Pago" },
    { value: "indication", label: "Indicação" },
    { value: "organic", label: "Orgânico" },
    { value: "tent", label: "Tenda" },
    { value: "doorToDoor", label: "Porta a Porta" },
    { value: "website", label: "Site" },
    { value: "importedList", label: "Lista Importada" },
  ];

  const statusOptions = [
    { value: "new", label: "Novo" },
    { value: "scheduled", label: "Agendado" },
    { value: "recall", label: "Retornar" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "lost", label: "Perdido" },
  ];

  const leadOptions = [
    { id: "", label: "" },
    ...leads.map((lead) => ({
      id: lead.id,
      label: lead.name,
    })),
  ];

  const brokerOptions = [
    { id: "", label: "" },
    ...brokers
      .filter((broker) => broker.active)
      .map((broker) => ({
        id: broker.id,
        label: broker.name,
      })),
  ];

  // Filtra os empreendimentos disponíveis com base nos negócios existentes do lead
  const availableDevelopments = developments.filter((development) => {
    // Se não houver lead selecionado, mostra todos os empreendimentos
    if (!formData.leadId) return true;

    // Se estiver editando, permite manter o empreendimento atual
    if (isEditing && development.id === formData.developmentId) return true;

    // Verifica se o lead já tem um negócio com este empreendimento
    const hasExistingBusiness = businesses.some(
      (business) =>
        business.leadId === formData.leadId &&
        business.developmentId === development.id
    );

    // Retorna true apenas se o lead NÃO tiver um negócio com este empreendimento
    return !hasExistingBusiness;
  });

  const developmentOptions = [
    { id: "", label: "" },
    ...availableDevelopments.map((development) => ({
      id: development.id,
      label: development.name,
    })),
  ];

  return (
    <div className="space-y-4">
      <Combobox
        options={leadOptions}
        value={formData.leadId || ""}
        onChange={(value) => {
          setFormData({
            ...formData,
            leadId: value,
            // Limpa o empreendimento selecionado quando trocar de lead
            developmentId: "",
          });
        }}
        placeholder="Selecione um lead"
        label="Lead"
        disabled={isEditing}
        required
      />

      <Combobox
        options={developmentOptions}
        value={formData.developmentId || ""}
        onChange={(value) => setFormData({ ...formData, developmentId: value })}
        placeholder="Selecione um empreendimento"
        label="Empreendimento"
        disabled={isEditing}
        required
      />

      {showBrokerField && (
        <Combobox
          options={brokerOptions}
          value={formData.brokerId || user?.id || ""}
          onChange={(value) => setFormData({ ...formData, brokerId: value })}
          placeholder="Selecione um corretor"
          label="Corretor"
          required
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Origem
        </label>
        <select
          value={formData.source || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              source: e.target.value as Business["source"],
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required>
          <option value="">Selecione a origem</option>
          {sourceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Status
        </label>
        <select
          value={formData.status || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as Business["status"],
              scheduledAt: null,
              recallAt: null,
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required>
          <option value="">Selecione o status</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {formData.status === "scheduled" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Data do Agendamento
          </label>
          <input
            type="datetime-local"
            value={formatDateTimeBusinessForm(formData.scheduledAt)}
            onChange={(e) =>
              setFormData({ ...formData, scheduledAt: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      )}

      {formData.status === "recall" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Data do Retorno
          </label>
          <input
            type="datetime-local"
            value={formatDateTimeBusinessForm(formData.recallAt)}
            onChange={(e) =>
              setFormData({ ...formData, recallAt: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Observações
        </label>
        <textarea
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
}