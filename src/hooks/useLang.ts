'use client'
import { useState, useEffect } from 'react'
import type { Lang } from '@/lib/types'

export function useLang(): [Lang, (l: Lang) => void] {
  const [lang, setLangState] = useState<Lang>('th')

  useEffect(() => {
    const stored = localStorage.getItem('tj_lang') as Lang | null
    if (stored === 'th' || stored === 'en') setLangState(stored)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('tj_lang', l)
  }

  return [lang, setLang]
}
