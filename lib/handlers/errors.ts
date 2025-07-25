import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { RESPONSE_SOURCE } from "@/constants";

import { RequestError, ValidationError } from "../http-errors";
import logger from "../logger";

const formatResponse = (
  responseSource: ResponseSource,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseSource === RESPONSE_SOURCE.API
    ? (NextResponse.json(responseContent, { status }) as APIResponse)
    : { status, ...responseContent };
};

const handleError = (
  error: unknown,
  responseSource: ResponseSource = "server"
) => {
  if (error instanceof RequestError) {
    logger.error(
      { err: error },
      `${responseSource.toUpperCase()} Error: ${error.message}`
    );

    return formatResponse(
      responseSource,
      error.statusCode,
      error.message,
      error.errors
    );
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      error.flatten().fieldErrors as Record<string, string[]>
    );

    logger.error(
      { err: error },
      `Validation Error: ${validationError.message}`
    );

    return formatResponse(
      responseSource,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    );
  }

  if (error instanceof Error) {
    logger.error(error.message);
    return formatResponse(responseSource, 500, error.message);
  }

  logger.error({ err: error }, "An unexpected error occurred");
  return formatResponse(responseSource, 500, "An unexpected error occurred");
};

export default handleError;
