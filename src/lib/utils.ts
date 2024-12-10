import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BACKEND_URL = "https://vd.aiteacha.com/api/";
const FLUTTERWAVE_PUBLIC = "FLWPUBK-cb7a2672748d7ec5b0306e59ab44e2ff-X";
export { BACKEND_URL, FLUTTERWAVE_PUBLIC };
