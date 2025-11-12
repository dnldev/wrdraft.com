/**
 * @file Centralized pino logger configuration.
 * This file exports a single logger instance to be used throughout the
 * server-side application code for consistent, structured logging.
 */

import pino from "pino";

/**
 * The application's singleton logger instance.
 * It is configured to have a default log level of 'info'.
 * In a production environment, you would typically lower this to 'warn' or 'error'
 * and use a log transport to send logs to a service.
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});
