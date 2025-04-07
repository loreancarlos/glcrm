import { Client } from "../../types";
import { formatPhoneDisplay } from "../../utils/format";
import { formatCPF } from "../../utils/masks";

export const getClientColumns = () => [
  { header: "Nome", accessor: "name" as const },
  { header: "Email", accessor: "email" as const },
  {
    header: "CPF",
    accessor: "cpf" as const,
    render: (value: string) => formatCPF(value),
  },
  {
    header: "Telefone",
    accessor: "phone" as const,
    render: (value: string) => formatPhoneDisplay(value),
  },
];
