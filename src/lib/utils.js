import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export function valueFromStringifyObject(obj) {
  try {
    const parsed = JSON.parse(obj);
    return typeof parsed === "object" && parsed !== null
      ? Object.values(parsed).join(", ")
      : obj;
  } catch {
    return obj;
  }
}