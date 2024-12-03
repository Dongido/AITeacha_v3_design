import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BACKEND_URL = "https://vd.aiteacha.com/api/";
const FLUTTERWAVE_PUBLIC = "FLWPUBK_TEST-e07cc0c70e89b216736f6488811eb24f-X";
export { BACKEND_URL, FLUTTERWAVE_PUBLIC };
