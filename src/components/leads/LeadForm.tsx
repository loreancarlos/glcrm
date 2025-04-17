import React, { useState, useEffect } from "react";
import { Lead, Development, User } from "../../types";
import { MaskedInput } from "../common/MaskedInput";
import { Search, X } from "lucide-react";
import { countryOptions, getPhoneMask } from "../../utils/masks";
import { detectPhoneCountry } from "../../utils/format";
import { Combobox } from "../common/Combobox";

interface LeadFormProps {
  formData: Partial<Lead>;
  setFormData: (data: Partial<Lead>) => void;
  isEditing: boolean;
  developments: Development[];
  showBrokerField?: boolean;
  brokers?: User[];
}

export function LeadForm({
  formData,
  setFormData,
  isEditing,
  developments,
  showBrokerField = false,
  brokers = [],
}: LeadFormProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [countryCode, setCountryCode] = useState(
    detectPhoneCountry(formData.phone || "")
  );

  useEffect(() => {
    if (isEditing && formData.phone) {
      const detectedCountry = detectPhoneCountry(formData.phone);
      setCountryCode(detectedCountry);
    }
  }, [isEditing, formData.phone]);

  const filteredDevelopments = developments.filter(
    (dev) =>
      dev.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !formData.developmentsInterest?.includes(dev.id)
  );

  const handleAddDevelopment = (developmentId: string) => {
    setFormData({
      ...formData,
      developmentsInterest: [
        ...(formData.developmentsInterest || []),
        developmentId,
      ],
    });
    setSearchTerm("");
  };

  const handleRemoveDevelopment = (developmentId: string) => {
    setFormData({
      ...formData,
      developmentsInterest: formData.developmentsInterest?.filter(
        (id) => id !== developmentId
      ),
    });
  };

  const getSelectedDevelopments = () => {
    return (formData.developmentsInterest || [])
      .map((id) => developments.find((dev) => dev.id === id))
      .filter((dev): dev is Development => dev !== undefined);
  };

  const sourceOptions = [
    { value: "indication", label: "Indicação" },
    { value: "organic", label: "Orgânico" },
    { value: "website", label: "Site" },
    { value: "paidTraffic", label: "Tráfego Pago" },
    { value: "doorToDoor", label: "Porta a Porta" },
    { value: "tent", label: "Tenda" },
    { value: "importedList", label: "Lista Importada" }
  ];

  const brokerOptions = [
    { id: "", label: "" },
    ...brokers.map((broker) => ({
      id: broker.id,
      label: broker.name,
    })),
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Telefone
        </label>
        <div className="mt-1 flex gap-2">
          <select
            value={countryCode}
            onChange={(e) => {
              const newCountryCode = e.target.value;
              setCountryCode(newCountryCode);
              setFormData((prev) => ({ ...prev, phone: "" }));
            }}
            className="rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            {countryOptions.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
          <div className="flex-1">
            <MaskedInput
              mask={getPhoneMask(countryCode)}
              value={
                formData.phone ? formData.phone.replace(countryCode, "") : ""
              }
              onChange={(value) => {
                const cleanValue = value.replace(/\D/g, "");
                setFormData((prev) => ({
                  ...prev,
                  phone: cleanValue ? `${countryCode}${cleanValue}` : "",
                }));
              }}
              className="block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
      </div>

      {!isEditing && (
        <>
          {showBrokerField && (
            <Combobox
              options={brokerOptions}
              value={formData.brokerId || ""}
              onChange={(value) => setFormData({ ...formData, brokerId: value })}
              placeholder="Selecione um corretor"
              label="Corretor Responsável"
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
                setFormData((prev) => ({ ...prev, source: e.target.value }))
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
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Empreendimentos de Interesse
        </label>
        <div className="relative mt-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Pesquisar empreendimentos..."
            className="block w-full rounded-md border-gray-300 pl-10 dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {isSearchFocused && filteredDevelopments.length > 0 && (
            <div className="absolute z-10 mt-1 max-h-20 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {filteredDevelopments.map((development) => (
                <div
                  key={development.id}
                  onClick={() => handleAddDevelopment(development.id)}
                  className="relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-50">
                  {development.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-2">
          {getSelectedDevelopments().map((development) => (
            <div
              key={development.id}
              className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
              {development.name}
              <button
                type="button"
                onClick={() => handleRemoveDevelopment(development.id)}
                className="ml-2 inline-flex items-center rounded-full p-0.5 text-indigo-800 hover:bg-indigo-200 hover:text-indigo-900">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        {formData.developmentsInterest?.length === 0 && (
          <p className="mt-2 text-sm text-red-600">
            Selecione pelo menos um empreendimento
          </p>
        )}
      </div>
    </div>
  );
}