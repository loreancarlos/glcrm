import { Lead } from "../../types";
import { formatDateDisplay, formatDateTime, formatPhoneDisplay } from "../../utils/format";

export const getLeadColumns = () => [
  { header: "Nome", accessor: "name" as const },
  {
    header: "Telefone",
    accessor: "phone" as const,
    render: (value: string) => formatPhoneDisplay(value),
  },
  {
    header: "Último Contato",
    accessor: "lastContact" as const,
    render: (value: string) => (value ? formatDateTime(value) : "Sem contato"),
  },
];
