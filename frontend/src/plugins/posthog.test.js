import { afterEach, describe, expect, it, vi } from "vitest"
import posthog from "posthog-js"
import posthogPlugin from "./posthog"

vi.mock("posthog-js", () => ({ default: { init: vi.fn() } }))

afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe("self-hosted analytics", () => {
  it("does not initialize tracking and keeps analytics calls safe", () => {
    vi.stubEnv("VUE_APP_SELF_HOSTED_MODE", "true")
    const Vue = { prototype: {} }
    posthogPlugin.install(Vue)
    const analytics = Vue.prototype.$posthog

    expect(posthog.init).not.toHaveBeenCalled()
    expect(() => {
      analytics.capture("Event created")
      analytics.identify("user")
      analytics.opt_in_capturing()
    }).not.toThrow()
    expect(analytics.get_distinct_id()).toBeNull()
    expect(analytics.isFeatureEnabled("enable-paywall")).toBe(false)
  })
})
