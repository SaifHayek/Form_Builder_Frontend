import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "This field is required": "This field is required",
          "Please enter a valid email address": "Please enter a valid email address",
          "Minimum length is {{min}} characters": "Minimum length is {{min}} characters",
          "Maximum length is {{max}} characters": "Maximum length is {{max}} characters",
          "Minimum value is {{min}}": "Minimum value is {{min}}",
          "Maximum value is {{max}}": "Maximum value is {{max}}",
          "Please select an option": "Please select an option",
          "None": "None",
          "Select an option": "Select an option",
          "Submit": "Submit"
        }
      },
      ar: {
        translation: {
          "This field is required": "هذا الحقل مطلوب",
          "Please enter a valid email address": "يرجى إدخال عنوان بريد إلكتروني صالح",
          "Minimum length is {{min}} characters": "الحد الأدنى للطول هو {{min}} حرف",
          "Maximum length is {{max}} characters": "الحد الأقصى للطول هو {{max}} حرف",
          "Minimum value is {{min}}": "الحد الأدنى للقيمة هو {{min}}",
          "Maximum value is {{max}}": "الحد الأقصى للقيمة هو {{max}}",
          "Please select an option": "يرجى اختيار خيار",
          "None": "لا شيء",
          "Select an option": "اختر خيارًا",
          "Submit": "إرسال"
        }
      }
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  })

export default i18n

