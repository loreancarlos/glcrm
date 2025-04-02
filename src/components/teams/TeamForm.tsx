import React from "react";
import { Team, User } from "../../types";
import { Combobox } from "../common/Combobox";

interface TeamFormProps {
  formData: Partial<Team>;
  setFormData: (data: Partial<Team>) => void;
  teamLeaders: User[];
  isEditing: boolean;
}

export function TeamForm({
  formData,
  setFormData,
  teamLeaders,
  isEditing,
}: TeamFormProps) {
  const teamLeaderOptions = teamLeaders.map((user) => ({
    id: user.id,
    label: user.name,
  }));

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nome da Equipe
        </label>
        <input
          type="text"
          value={formData.name || ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <Combobox
        options={teamLeaderOptions}
        value={formData.leaderId || ""}
        onChange={(value) => setFormData({ ...formData, leaderId: value })}
        placeholder="Selecione um líder"
        label="Líder da Equipe"
        required
      />
    </div>
  );
}
