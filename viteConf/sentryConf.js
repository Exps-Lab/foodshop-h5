import * as Sentry from "@sentry/vue";

const initSentry = (app, routerConf) => {
  // 插件配置
  const integrations = [
    new Sentry.Replay()
  ]
  routerConf && integrations.push(
    new Sentry.BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(routerConf)
    })
  )

  Sentry.init({
    app,
    dsn: 'https://0c6f3bf85cf54294b240849a9ed21eff@o4505573165039616.ingest.sentry.io/4505573171200000',
    integrations,

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,

    // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost', /^http:\/\/www\.foodshop\.fun\//],

    // Capture Replay for 10% of all sessions,
    // plus for 100% of sessions with an error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0
  })
}

export {
  initSentry
}
