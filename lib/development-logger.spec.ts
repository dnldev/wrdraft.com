/**
 * @jest-environment jsdom
 */

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from "@jest/globals";

describe("development-logger", () => {
  let consoleSpies: {
    debug: jest.SpiedFunction<typeof console.debug>;
    info: jest.SpiedFunction<typeof console.info>;
    warn: jest.SpiedFunction<typeof console.warn>;
    error: jest.SpiedFunction<typeof console.error>;
  };

  beforeEach(() => {
    // This is crucial to force the logger module to be re-evaluated
    // with the new mocked process.env in each test.
    jest.resetModules();

    consoleSpies = {
      debug: jest.spyOn(console, "debug").mockImplementation(() => {
        // No-op
      }),
      info: jest.spyOn(console, "info").mockImplementation(() => {
        // No-op
      }),
      warn: jest.spyOn(console, "warn").mockImplementation(() => {
        // No-op
      }),
      error: jest.spyOn(console, "error").mockImplementation(() => {
        // No-op
      }),
    };
  });

  afterEach(() => {
    // While jest.replaceProperty restores itself, restoring all mocks is good practice.
    jest.restoreAllMocks();
  });

  describe("in development environment", () => {
    beforeEach(() => {
      // Use jest.replaceProperty to set NODE_ENV for all tests in this block.
      // It will be automatically restored after each test.
      jest.replaceProperty(process, "env", {
        ...process.env,
        NODE_ENV: "development",
      });
    });

    it("should call console.debug for logger.debug", async () => {
      const { logger } = await import("./development-logger");
      logger.debug("TestComponent", "Debug message", { data: 1 });
      expect(consoleSpies.debug).toHaveBeenCalledWith(
        "[DEBUG] (TestComponent):",
        "Debug message",
        { data: 1 }
      );
    });

    it("should call console.info for logger.info", async () => {
      const { logger } = await import("./development-logger");
      logger.info("TestComponent", "Info message");
      expect(consoleSpies.info).toHaveBeenCalledWith(
        "[INFO] (TestComponent):",
        "Info message"
      );
    });

    it("should call console.warn for logger.warn", async () => {
      const { logger } = await import("./development-logger");
      logger.warn("TestComponent", "Warn message");
      expect(consoleSpies.warn).toHaveBeenCalledWith(
        "[WARN] (TestComponent):",
        "Warn message"
      );
    });

    it("should call console.error for logger.error", async () => {
      const { logger } = await import("./development-logger");
      logger.error("TestComponent", "Error message");
      expect(consoleSpies.error).toHaveBeenCalledWith(
        "[ERROR] (TestComponent):",
        "Error message"
      );
    });
  });

  describe("in production environment", () => {
    beforeEach(() => {
      jest.replaceProperty(process, "env", {
        ...process.env,
        NODE_ENV: "production",
      });
    });

    it("should NOT call any console methods", async () => {
      const { logger: prodLogger } = await import("./development-logger");

      prodLogger.debug("TestComponent", "This should not be logged");
      prodLogger.info("TestComponent", "This should not be logged");
      prodLogger.warn("TestComponent", "This should not be logged");
      prodLogger.error("TestComponent", "This should not be logged");

      expect(consoleSpies.debug).not.toHaveBeenCalled();
      expect(consoleSpies.info).not.toHaveBeenCalled();
      expect(consoleSpies.warn).not.toHaveBeenCalled();
      expect(consoleSpies.error).not.toHaveBeenCalled();
    });
  });
});
