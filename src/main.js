import { createApp } from "vue";
import {
  Quasar,
  QCard,
  QCardSection,
  QSeparator,
  QForm,
  QBtn,
  QStepper,
  QStep,
  QStepperNavigation,
  QBanner,
  QInput,
  QIcon,
  QPopupProxy,
  QDate,
  Ripple,
} from "quasar";
import "quasar/dist/quasar.css";
import "@quasar/extras/material-icons/material-icons.css";

import App from "./App.vue";

const app = createApp(App);
app.use(Quasar, {
  plugins: {},
  config: { dark: true },
  components: {
    QCard,
    QCardSection,
    QSeparator,
    QForm,
    QBtn,
    QStepper,
    QStep,
    QStepperNavigation,
    QBanner,
    QInput,
    QIcon,
    QPopupProxy,
    QDate,
  },
  directives: { Ripple },
});
app.mount("#app");
