import pino from "pino";

const isEdge = process.env.NEXT_RUNTIME === "edge";
const isProduction = process.env.NODE_ENV === "production";

declare global {
  // Using a global singleton avoids creating multiple transports/streams during HMR,
  // which can cause MaxListenersExceededWarning on WriteStream "finish" events.

  var __devFlowLogger: ReturnType<typeof pino> | undefined;
}

const loggerInstance = ((): ReturnType<typeof pino> => {
  const existing = globalThis.__devFlowLogger;
  if (existing) return existing;

  const created = pino({
    level: process.env.LOG_LEVEL || "info",
    transport:
      !isEdge && !isProduction
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              ignore: "pid,hostname",
              translateTime: "SYS:standard",
            },
          }
        : undefined,
    formatters: {
      level: (label) => ({ level: label.toUpperCase() }),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
  });

  if (!isProduction) {
    globalThis.__devFlowLogger = created as unknown as ReturnType<typeof pino>;
  }

  return created as unknown as ReturnType<typeof pino>;
})();

export default loggerInstance;
