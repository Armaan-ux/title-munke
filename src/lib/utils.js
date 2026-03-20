import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function valueFromStringifyObject(obj) {
  try {
    const parsed = JSON.parse(obj);

    const formatValue = (val) =>
      String(val).replace(/organisation/gi, "organization");

    return typeof parsed === "object" && parsed !== null
      ? Object.values(parsed).map(formatValue).join(", ")
      : formatValue(parsed);
  } catch {
    return String(obj).replace(/organisation/gi, "organization");
  }
}
