// src/libs/authLogger.ts
type AuthLogMeta = Record<string, unknown>;

const write = (level: "INFO" | "WARN" | "ERROR", event: string, meta?: AuthLogMeta) => {
  const payload = {
    ts: new Date().toISOString(),
    level,
    event,
    ...(meta ?? {}),
  };

  console.log(JSON.stringify(payload));
};

export const authLogger = {
  info: (event: string, meta?: AuthLogMeta) => write("INFO", event, meta),
  warn: (event: string, meta?: AuthLogMeta) => write("WARN", event, meta),
  error: (event: string, meta?: AuthLogMeta) => write("ERROR", event, meta),
};