export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "R$ 0,00";
  }

  try {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error("Error formatting currency value:", error);
    return "R$ 0,00";
  }
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0%";
  }

  try {
    return value.toLocaleString("pt-BR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error("Error formatting percentage value:", error);
    return "0%";
  }
}

export function formatInterestRate(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0,00%";
  }

  try {
    return `${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}% a.a.`;
  } catch (error) {
    console.error("Error formatting interest rate value:", error);
    return "0,00%";
  }
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  try {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error("Error formatting number value:", error);
    return "0";
  }
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";

  try {
    // If the value is already in YYYY-MM-DD format, return it as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    // Convert from API format (if needed) and return YYYY-MM-DD
    const date = new Date(value);
    date.setHours(date.getHours() + 3);
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date value:", error);
    return "";
  }
}

export function formatDateDisplay(value: string | null | undefined): string {
  if (!value) return "";

  try {
    const date = new Date(value);
    date.setHours(date.getHours() + 3);
    return date.toLocaleDateString("pt-BR");
  } catch (error) {
    console.error("Error formatting date for display:", error);
    return "";
  }
}

export function formatDateTime(
  value: string | Date | null | undefined
): string {
  if (!value) return "";

  try {
    const date = value instanceof Date ? value : new Date(value);
    date.setHours(date.getHours());
    return date.toLocaleString("pt-BR");
  } catch (error) {
    console.error("Error formatting datetime value:", error);
    return "";
  }
}

export function formatDateTimeBusinessForm(
  value: string | Date | null | undefined
): string {
  if (!value) return "";
  try {
    const date = value instanceof Date ? value : new Date(value);
    date.setHours(date.getHours() - 3);
    return date.toISOString().slice(0, 19);
  } catch (error) {
    console.error("Error formatting datetime value:", error);
    return "";
  }
}

export function formatDisplayName(name: string | undefined | null): string {
  if (!name) return "";

  const words = name.trim().split(" ");
  return words.slice(0, 2).join(" ");
}

export function removeAcento(text: string | undefined | null): string {
  text = text?.toLowerCase();
  text = text?.replace(new RegExp("[ÁÀÂÃ]", "gi"), "a");
  text = text?.replace(new RegExp("[ÉÈÊ]", "gi"), "e");
  text = text?.replace(new RegExp("[ÍÌÎ]", "gi"), "i");
  text = text?.replace(new RegExp("[ÓÒÔÕ]", "gi"), "o");
  text = text?.replace(new RegExp("[ÚÙÛ]", "gi"), "u");
  return text || "";
}

export function formatLastDate(date: string | undefined) {
  if (!date) return "Nunca";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function detectPhoneCountry(phone: string): string {
  if (!phone) return "55"; // Default to Brazil if no phone number

  // Check if the number starts with '+'
  if (phone.startsWith("55")) return "55"; // Brazil
  if (phone.startsWith("1")) return "1"; // USA/Canada
  if (phone.startsWith("44")) return "44"; // UK
  if (phone.startsWith("351")) return "351"; // Portugal

  // If no country code is detected, default to Brazil
  return "55";
}

// Formatação para exibição em tabelas
export function formatPhoneDisplay(phone: string): string {
  if (!phone) return "";
  const countryCode = phone[0];
  const number = phone;

  switch (countryCode) {
    case "5": // Brasil
      if (number.length === 11) {
        return `(${number.slice(2, 4)}) ${number.slice(5, 9)}-${number.slice(
          9
        )}`;
      }
      return `(${number.slice(2, 4)}) ${number.slice(4, 9)}-${number.slice(9)}`;
    case "1": // EUA/Canadá
      return `+1 ${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(
        7
      )}`;
    case "4": // Reino Unido
      return `+44 ${number.slice(2, 4)} ${number.slice(4, 8)} ${number.slice(
        8
      )}`;
    case "3": // Portugal
      return `+351 ${number.slice(3, 6)} ${number.slice(6, 9)} ${number.slice(
        9
      )}`;
    default:
      return `+${countryCode} ${number}`;
  }
}

// Formatação para formulários
export function formatPhoneForm(phone: string): string {
  if (!phone) return "";
  const countryCode = phone[0];
  const number = phone;

  switch (countryCode) {
    case "5": // Brasil
      if (number.length === 11) {
        return `(${number.slice(2, 4)}) ${number.slice(5, 9)}-${number.slice(
          9
        )}`;
      }
      return `(${number.slice(2, 4)}) ${number.slice(4, 9)}-${number.slice(9)}`;
    case "1": // EUA/Canadá
      return `${number.slice(1, 4)} ${number.slice(4, 7)} ${number.slice(7)}`;
    case "4": // Reino Unido
      return `${number.slice(2, 4)} ${number.slice(4, 8)} ${number.slice(8)}`;
    case "3": // Portugal
      return `${number.slice(3, 6)} ${number.slice(6, 9)} ${number.slice(9)}`;
    default:
      return number;
  }
}
