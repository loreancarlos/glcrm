import React, { useState, useEffect } from "react";
import { Client } from "../../types";
import { MaskedInput } from "../common/MaskedInput";
import { countryOptions, cpfMask, getPhoneMask } from "../../utils/masks";
import { detectPhoneCountry } from "../../utils/format";

interface ClientFormProps {
  formData: Partial<Client>;
  setFormData: (data: Partial<Client>) => void;
  isEditing: boolean;
}

export function ClientForm({
  formData,
  setFormData,
  isEditing,
}: ClientFormProps) {
  const [countryCode, setCountryCode] = useState(
    detectPhoneCountry(formData.phone || "")
  );

  useEffect(() => {
    if (isEditing && formData.phone) {
      const detectedCountry = detectPhoneCountry(formData.phone);
      setCountryCode(detectedCountry);
    }
  }, [isEditing, formData.phone]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">CPF</label>
        <MaskedInput
          mask={cpfMask}
          value={formData.cpf || ""}
          onChange={(value) => setFormData({ ...formData, cpf: value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
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
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
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
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Endereço
        </label>
        <input
          type="text"
          value={formData.address || ""}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
    </div>
  );
}
