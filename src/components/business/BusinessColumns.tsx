import { Business } from "../../types";
import {
  formatDateDisplay,
  formatDateTime,
  formatPhoneDisplay,
} from "../../utils/format";
import { FaWhatsapp } from "react-icons/fa";

export const getBusinessColumns = () => [
  {
    header: "Lead",
    accessor: "leadName" as const,
    sortable: true,
  },
  {
    header: "Telefone",
    accessor: "leadPhone" as const,
    //render: (value: string) => formatPhoneDisplay(value),
    render: (value: string) => (
      <div className="flex gap-1">
        <a
          href={`tel:015 ${formatPhoneDisplay(value)}`}
          className="text-indigo-600 hover:underline font-medium"
          onClick={(e) => e.stopPropagation()} // Impede de acionar onRowClick
        >
          {`${formatPhoneDisplay(value)}`}
        </a>
        <a
          href={`https://api.whatsapp.com/send?phone=${value}`}
          className="text-green-600 hover:underline font-medium"
          target="_blank">
          <FaWhatsapp size={`1.5em`} />
        </a>
      </div>
    ),
    sortable: true,
  },
  {
    header: "Empreendimento",
    accessor: "developmentName" as const,
    sortable: true,
  },
  /* {
    header: "Origem",
    accessor: "source" as const,
    render: (value: Business["source"]) => {
      const sourceMap = {
        indication: "Indicação",
        organic: "Orgânico",
        website: "Site",
        paidTraffic: "Tráfego Pago",
        doorToDoor: "Porta a Porta",
        tent: "Tenda",
        importedList: "Lista Importada",
      };
      return sourceMap[value];
    },
    sortable: true,
  }, */
  {
    header: "Status",
    accessor: "status" as const,
    render: (value: Business["status"]) => {
      const statusMap = {
        new: "Novo",
        recall: "Retornar",
        whatsapp: "WhatsApp",
        scheduled: "Agendado",
        lost: "Perdido",
      };
      const colorMap = {
        new: "bg-blue-100 text-blue-800",
        recall: "bg-yellow-100 text-yellow-800",
        whatsapp: "bg-green-100 text-green-800",
        scheduled: "bg-purple-100 text-purple-800",
        lost: "bg-red-100 text-white-800",
      };
      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMap[value]}`}>
          {statusMap[value]}
        </span>
      );
    },
    sortable: true,
  },
  {
    header: "Agendamento",
    accessor: "scheduledAt" as const,
    render: (value: string) => (value ? formatDateTime(value) : "-"),
    sortable: true,
  },
  {
    header: "Retornar",
    accessor: "recallAt" as const,
    render: (value: string) => (value ? formatDateTime(value) : "-"),
    sortable: true,
  },
];
