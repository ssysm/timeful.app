import Vue from "vue"
import VueWorker from "vue-worker"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import vuetify from "./plugins/vuetify"
import posthogPlugin from "./plugins/posthog"
import VueGtm from "@gtm-support/vue2-gtm"
import VueMeta from "vue-meta"
import { initializeGTMConsent, hasAnalyticsConsent } from "./utils/cookie_utils"
import "./index.css"

const selfHostedMode = process.env.VUE_APP_SELF_HOSTED_MODE === "true"

// Skip analytics initialization in self-hosted mode
if (!selfHostedMode) {
  initializeGTMConsent()
}

// Posthog (handles self-hosted mode internally)
Vue.use(posthogPlugin)

// Google Analytics - disabled in self-hosted mode
if (!selfHostedMode) {
  Vue.use(VueGtm, {
    id: "GTM-M677X6V",
    vueRouter: router,
    enabled: hasAnalyticsConsent(),
  })
}

// Site Metadata
Vue.use(VueMeta)

// Workers
Vue.use(VueWorker)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app")
