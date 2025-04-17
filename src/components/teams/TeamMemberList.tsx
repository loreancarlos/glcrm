import React, { useEffect } from "react";
import { User } from "../../types";
import { UserMinus } from "lucide-react";

interface TeamMemberListProps {
  members: User[] | null;
  onRemoveMember: (userId: string) => void;
}

export function TeamMemberList({
  members,
  onRemoveMember,
}: TeamMemberListProps) {
  if (!members) {
    return <p className="text-gray-500">Carregando membros...</p>;
  }

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4 dark:text-white">
        Membros da Equipe
      </h3>
      <div className="space-y-2">
        {members.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-300">Nenhum membro na equipe</p>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm dark:bg-dark-hover">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-300">{member.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
              </div>
              <button
                onClick={() => onRemoveMember(member.id)}
                className="text-red-600 hover:text-red-900"
                title="Remover da equipe">
                <UserMinus className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
