import logger from "../logger";
import { isError } from "../utils";
import handleError from "./errors";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export const fetchHandler = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> => {
  const {
    timeout = 5000,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers = { ...defaultHeaders, ...customHeaders };
  const config = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data as ActionResponse<T>;
  } catch (err) {
    const error = isError(err) ? err : new Error("Unknow Error");

    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Request to ${url} failed: ${error.message}`);
    }

    return handleError(err) as ActionResponse<T>;
  }
};
