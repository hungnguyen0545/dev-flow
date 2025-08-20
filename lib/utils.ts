import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { TECH_ICON_MAP, TECH_DESCRIPTION_MAP } from "@/constants/techMap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date) => {
  const date = new Date(createdAt);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const units = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(secondsAgo / unit.seconds);
    if (interval >= 1) {
      return `${interval} ${unit.label}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
};

export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

export const convertToJson = (data: unknown) => {
  if (typeof data === "object" && data !== null) {
    return JSON.parse(JSON.stringify(data));
  }

  return data;
};

export const formatNumber = (number: number) => {
  if (isNaN(number)) return "0";

  const formattedNumber = Number(number);
  if (formattedNumber >= 1000000) {
    return (formattedNumber / 1000000).toFixed(1) + "M";
  }
  if (formattedNumber >= 1000) {
    return (formattedNumber / 1000).toFixed(1) + "K";
  }
  return formattedNumber.toString();
};

export const getTechDescription = (techName: string) => {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
  return TECH_DESCRIPTION_MAP[normalizedTechName]
    ? TECH_DESCRIPTION_MAP[normalizedTechName]
    : `${techName} is a technology or tool widely used in web development, providing valuable features and capabilities.`;
};

export function getDevIconClassName(name: string) {
  const normalizedTechName = name.toLowerCase().replace(/\s+/g, ""); // Remove spaces and convert to lowercase

  return TECH_ICON_MAP[normalizedTechName]
    ? `${TECH_ICON_MAP[normalizedTechName]} colored`
    : "devicon-devicon-plain";
}
