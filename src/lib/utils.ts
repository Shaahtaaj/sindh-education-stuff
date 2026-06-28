import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-PK", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}
export function sanitizeText(value: string) {
  return value.replace(/<[^>]*>?/gm, "").replace(/[<>]/g, "").trim();
}
