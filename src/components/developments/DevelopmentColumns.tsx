import { Development } from "../../types";

export const getDevelopmentColumns = () => [
  { header: "Nome", accessor: "name" as const },
  { header: "Localização", accessor: "location" as const },
];