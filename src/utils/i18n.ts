import { createI18n } from 'vue-i18n'
import type { Locales } from '@/types'

import en from '@/locales/en.json'
import zh from '@/locales/zh.json'
import es from '@/locales/es.json'

type MessageSchema = typeof en

const i18n = createI18n<[MessageSchema], Locales>({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
    es
  }
})

export default i18n
