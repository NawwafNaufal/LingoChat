import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import id from "../locales/id.json";
import es from "../locales/es.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    id: { translation: id },
    es: { translation: es },
  },
  lng: "en", // default
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
