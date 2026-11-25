import type { Instrumentation } from "next";

export const register = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initializeErrorTracking } = await import("./lib/error-tracking");
    initializeErrorTracking();
  }
};

export const onRequestError: Instrumentation.onRequestError = async () => {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { reportServerError } = await import("./lib/error-tracking");
    await reportServerError();
  }
};
