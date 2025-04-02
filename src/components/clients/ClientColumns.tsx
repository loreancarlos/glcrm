import { Client } from "../../types";
import { formatPhoneDisplay } from "../../utils/format";

export const getClientColumns = () => [
  { header: "Nome", accessor: "name" as const },
  { header: "Email", accessor: "email" as const },
  {
    header: "CPF",
    accessor: "cpf" as const,
    render: (value: string) => value,
  },
  {
    header: "Telefone",
    accessor: "phone" as const,
    render: (value: string) => formatPhoneDisplay(value),
  },
];
