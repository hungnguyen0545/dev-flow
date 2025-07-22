import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { techMap } from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDevIconClassName(name: string) {
  const normalizedTechName = name.toLowerCase().replace(/\s+/g, ""); // Remove spaces and convert to lowercase

  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain";
}
