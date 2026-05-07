'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { IntlProvider as ReactIntlProvider } from 'react-intl'
import arMessages from '@/messages/ar.json'
import deMessages from '@/messages/de.json'
import enMessages from '@/messages/en.json'
import esMessages from '@/messages/es.json'
import frMessages from '@/messages/fr.json'
import jaMessages from '@/messages/ja.json'
import koMessages from '@/messages/ko.json'
import ptMessages from '@/messages/pt.json'
import trMessages from '@/messages/tr.json'
import zhMessages from '@/messages/zh.json'

export type Locale = 'en' | 'tr' | 'ar' | 'de' | 'es' | 'fr' | 'ja' | 'ko' | 'pt' | 'zh'

const VALID_LOCALES = new Set<Locale>(['en', 'tr', 'ar', 'de', 'es', 'fr', 'ja', 'ko', 'pt', 'zh'])
const STORAGE_KEY = 'app-lang'

const allMessages: Record<Locale, Record<string, string>> = {
  ar: arMessages,
  de: deMessages,
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  ja: jaMessages,
  ko: koMessages,
  pt: ptMessages,
  tr: trMessages,
  zh: zhMessages,
}

type LocaleCtx = { locale: Locale; setLocale: (l: Locale) => void }

export const LocaleContext = createContext<LocaleCtx>({ locale: 'en', setLocale: () => {} })
export const useLocale = () => useContext(LocaleContext)

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && VALID_LOCALES.has(saved as Locale)) {
      setLocaleState(saved as Locale)
    }
  }, [])

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    localStorage.setItem(STORAGE_KEY, l)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <ReactIntlProvider locale={locale} messages={allMessages[locale]} defaultLocale="en">
        {children}
      </ReactIntlProvider>
    </LocaleContext.Provider>
  )
}
