import * as Sentry from "@sentry/vue";

const initSentry = (app, routerConf) => {
  Sentry.init({
    dsn: "https://41504a5930c186b7e84528715e4c104f@o4505573165039616.ingest.sentry.io/4506834430853120",
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ["localhost"],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
  });
}

export {
  initSentry
}
