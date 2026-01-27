import posthog from "posthog-js"
import { getCookieConsent } from "@/utils/cookie_utils"

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

    // Initialize PostHog with capturing disabled by default
    Vue.prototype.$posthog = posthog.init(process.env.VUE_APP_POSTHOG_API_KEY, {
      api_host: "https://e.timeful.app",
      capture_pageview: false,
      autocapture: false,
      opt_out_capturing_by_default: true,
    })

    // If the user has previously given analytics consent in localStorage, opt-in
    const consent = getCookieConsent()
    if (consent && consent.preferences && consent.preferences.analytics) {
      Vue.prototype.$posthog.opt_in_capturing()
    }
  },
}
