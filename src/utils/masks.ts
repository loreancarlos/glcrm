import IMask from "imask";

export const cpfMask: IMask.MaskedPatternOptions = {
  mask: "000.000.000-00",
  lazy: false,
};

export interface PhoneFormat {
  mask: string;
  placeholder: string;
}

export const phoneFormats: { [key: string]: PhoneFormat } = {
  "55": {
    // Brasil
    mask: "(00) 00000-0000",
    placeholder: "(11) 98765-4321",
  },
  "1": {
    // EUA e Canadá
    mask: "000-000-0000",
    placeholder: "123-456-7890",
  },
  "44": {
    // Reino Unido
    mask: "00 0000 0000",
    placeholder: "20 7123 4567",
  },
  "351": {
    // Portugal
    mask: "000 000 000",
    placeholder: "912 345 678",
  },
  default: {
    mask: "000 000 000 000",
    placeholder: "123 456 789 012",
  },
};

export const getPhoneMask = (
  countryCode: string
): IMask.MaskedPatternOptions => {
  const format = phoneFormats[countryCode] || phoneFormats.default;
  return {
    mask: format.mask,
    lazy: false,
  };
};

export const unmaskValue = (value: string): string => {
  return (value || "").replace(/\D/g, "");
};

export const formatCPF = (value: string): string => {
  if (!value) return "";
  const unmasked = unmaskValue(value);
  const masked = IMask.createPipe(cpfMask);
  return masked(unmasked);
};

export const formatPhone = (value: string, countryCode: string): string => {
  if (!value) return "";
  const unmasked = unmaskValue(value);
  const masked = IMask.createPipe(getPhoneMask(countryCode));
  return masked(unmasked);
};

export const countryOptions = [
  { code: "55", name: "Brasil (+55)" },
  { code: "1", name: "Estados Unidos/Canadá (+1)" },
  { code: "44", name: "Reino Unido (+44)" },
  { code: "351", name: "Portugal (+351)" },
];
