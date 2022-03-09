import * as Sentry from '@sentry/browser'
import { Vue as VueIntegration } from '@sentry/integrations'
import { Integrations } from '@sentry/tracing'

export default ({ Vue }) => {
  // Disable Sentry for development environment
  if (process.env.ENV_NAME?.toLowerCase() === 'development') {
    return
  }

  Sentry.init({
    dsn: process.env.VUE_APP_SENTRY_DSN,
    environment: process.env.ENV_NAME,
    release: `${process.env.VUE_APP_VERSION}`,
    integrations: [
      new VueIntegration({
        Vue,
        tracing: true,
        attachProps: true,
        logErrors: true
      }),
      new Integrations.BrowserTracing()
    ],
    tracesSampleRate: 1,
    beforeSend: function (body) {
      if (body?.exception?.values) {
        const newVals = []
        for (const exception of body.exception.values) {
          const { value, type } = exception
          if ((value === 'Non-Error promise rejection captured with value: undefined' && type === 'UnhandledRejection') ||
            type === 'NavigationDuplicated') {
            console.log('Ignoring known vue router error')
          } else {
            newVals.push(exception)
          }
        }
        if (newVals.length) {
          body.exception.values = newVals
        } else {
          return null
        }
      }
      return body
    }
  })
}
