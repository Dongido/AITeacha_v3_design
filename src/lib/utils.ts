import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const isProd = process.env.NODE_ENV === "production";
const BACKEND_URL =
  window.location.hostname === "localhost"
    ? "https://api.aiteacha.com/api/"
    : "https://vd.aiteacha.com/api/";
const FLUTTERWAVE_PUBLIC = "FLWPUBK-b2c02bd79a3fe83eaa70fa2e53f69432-X";
export { BACKEND_URL, FLUTTERWAVE_PUBLIC };
