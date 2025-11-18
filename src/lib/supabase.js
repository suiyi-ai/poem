import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 检查环境变量是否设置
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 环境变量未设置！')
  console.error('请在 Netlify 控制台设置以下环境变量：')
  console.error('- VITE_SUPABASE_URL')
  console.error('- VITE_SUPABASE_ANON_KEY')
  throw new Error('Supabase 配置缺失：请设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 环境变量')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

