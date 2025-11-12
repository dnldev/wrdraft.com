/**
 * @file A simple, environment-aware logger for client-side development.
 * This wrapper around the console object ensures that log messages are only
 * output during development, preventing verbose logs in production.
 * The ESLint rule `no-console` is enabled to enforce the use of this logger.
 */

/* eslint-disable no-console */
const performLog = (
  level: "debug" | "info" | "warn" | "error",
  component: string,
  ...args: unknown[]
) => {
  if (process.env.NODE_ENV === "development") {
    const logFunc = console[level] || console.log;
    logFunc(`[${level.toUpperCase()}] (${component}):`, ...args);
  }
};
/* eslint-enable no-console */

export const logger = {
  /**
   * Logs a debug message during development.
   * @param component - The name of the component or hook.
   * @param args - The messages or objects to log.
   */
  debug: (component: string, ...args: unknown[]) =>
    performLog("debug", component, ...args),

  /**
   * Logs an info message during development.
   * @param component - The name of the component or hook.
   * @param args - The messages or objects to log.
   */
  info: (component: string, ...args: unknown[]) =>
    performLog("info", component, ...args),

  /**
   * Logs a warning message during development.
   * @param component - The name of the component or hook.
   * @param args - The messages or objects to log.
   */
  warn: (component: string, ...args: unknown[]) =>
    performLog("warn", component, ...args),

  /**
   * Logs an error message during development.
   * @param component - The name of the component or hook.
   * @param args - The messages or objects to log.
   */
  error: (component: string, ...args: unknown[]) =>
    performLog("error", component, ...args),
};
