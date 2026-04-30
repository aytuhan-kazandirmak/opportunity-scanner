'use client'

import { useEffect, useState } from 'react'
import { IntlProvider as ReactIntlProvider } from 'react-intl'
import trMessages from '@/messages/tr.json'
import enMessages from '@/messages/en.json'

type Locale = 'tr' | 'en'

const messages: Record<Locale, Record<string, string>> = {
  tr: trMessages,
  en: enMessages,
}

export function IntlProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('tr')

  useEffect(() => {
    const lang = navigator.language ?? ''
    setLocale(lang.startsWith('tr') ? 'tr' : 'en')
  }, [])

  return (
    <ReactIntlProvider locale={locale} messages={messages[locale]}>
      {children}
    </ReactIntlProvider>
  )
}
