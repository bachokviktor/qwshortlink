import i18n from "i18next"
import { initReactI18next } from "react-i18next"

import translationEn from "./locale/en.json"
import translationUk from "./locale/uk.json"

i18n.use(initReactI18next).init({
  debug: import.meta.env.VITE_I18N_DEBUG === "t",
  fallbackLng: "en",

  resources: {
    en: {
      translation: translationEn
    },
    uk: {
      translation: translationUk
    }
  }
})

export default i18n
