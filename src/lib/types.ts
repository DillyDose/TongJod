export interface Profile {
  id: string
  email: string
  display_name: string | null
  language: 'th' | 'en'
  created_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  type: 'income' | 'expense'
  is_deleted: boolean
  usage_count: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'income' | 'expense'
  amount: number
  category_id: string
  note: string | null
  date: string
  created_at: string
}

export interface Budget {
  id: string
  user_id: string
  category_id: string
  amount: number
  updated_at: string
}

export type Lang = 'th' | 'en'
export type StatusKey = 'excellent' | 'onTrack' | 'over' | 'default'

export interface Theme {
  key: StatusKey
  gradient: string
  accent: string
  accentLight: string
  shadow: string
  cardTint: string
  bar: string
  pillBg: string
  pillText: string
  focusRing: string
}
