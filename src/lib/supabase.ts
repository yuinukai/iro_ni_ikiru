import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// データベーステーブルの型定義
export interface Article {
  id?: string
  title: string
  content: string
  excerpt?: string
  slug: string
  published: boolean
  category?: string
  author: string
  created_at?: string
  updated_at?: string
  published_at?: string
}