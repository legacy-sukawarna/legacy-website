import * as Sentry from "@sentry/node";

let client: Sentry.NodeClient | undefined;

export const sanitizeErrorEvent = (event: Sentry.ErrorEvent): Sentry.ErrorEvent => ({
  type: undefined,
  event_id: event.event_id,
  timestamp: event.timestamp,
  platform: "node",
  level: "error",
  environment: event.environment === "production" ? "production" : "development",
  exception: {
    values: [{ type: "UnhandledApplicationError", value: "Unhandled application error" }],
  },
  tags: { component: "public-site-server" },
});

export const initializeErrorTracking = () => {
  const dsn = process.env.SENTRY_DSN?.trim();
  if (!dsn || client) return;
  client = Sentry.init({
    dsn,
    environment: process.env.NODE_ENV === "production" ? "production" : "development",
    defaultIntegrations: false,
    beforeSend: sanitizeErrorEvent,
    beforeBreadcrumb: () => null,
    maxBreadcrumbs: 0,
    sendClientReports: false,
    tracesSampleRate: 0,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
      urlQueryParams: false,
      databaseQueryData: false,
      genAI: { inputs: false, outputs: false },
      graphQL: { document: false, variables: false },
    },
  });
};

export const reportServerError = async () => {
  if (!client) return;
  try {
    client.captureEvent({
      level: "error",
      exception: {
        values: [{ type: "UnhandledApplicationError", value: "Unhandled application error" }],
      },
    });
    await client.flush(2000);
  } catch {
    // Error reporting must not replace the application's error response.
  }
};
