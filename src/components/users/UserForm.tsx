import React from "react";
import { User } from "../../types";

interface UserFormProps {
  formData: Partial<User>;
  setFormData: (data: Partial<User>) => void;
  isEditing: boolean;
}

export function UserForm({ formData, setFormData, isEditing }: UserFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nome
        </label>
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
          Email
        </label>
        <input
          type="email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          disabled={isEditing}
        />
      </div>
      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Senha
          </label>
          <input
            type="password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Perfil
        </label>
        <select
          value={formData.role || "user"}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value as User["role"],
            })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:border-gray-600 dark:bg-dark-secondary dark:text-white dark:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required>
          <option value="user">Usuário</option>
          <option value="broker">Corretor</option>
          <option value="teamLeader">Supervisor de Equipe</option>
          <option value="admin">Administrador</option>
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="active"
          checked={formData.active}
          onChange={(e) =>
            setFormData({ ...formData, active: e.target.checked })
          }
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label
          htmlFor="active"
          className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
          Usuário Ativo
        </label>
      </div>
    </div>
  );
}