import posthog from "posthog-js"

// No-op stub for self-hosted mode
const posthogStub = {
  capture: () => {},
  identify: () => {},
  opt_in_capturing: () => {},
  opt_out_capturing: () => {},
  get_distinct_id: () => null,
  isFeatureEnabled: () => false,
  getFeatureFlag: () => null,
  setPersonPropertiesForFlags: () => {},
  onFeatureFlags: () => {},
}

export default {
  install(Vue, options) {
    // In self-hosted mode, use a no-op stub to disable analytics
    if (process.env.VUE_APP_SELF_HOSTED_MODE === "true") {
      Vue.prototype.$posthog = posthogStub
      return
    }

    Vue.prototype.$posthog = posthog.init(process.env.VUE_APP_POSTHOG_API_KEY, {
      api_host: "https://e.timeful.app",
      capture_pageview: false,
      autocapture: false,
    })
  },
}
