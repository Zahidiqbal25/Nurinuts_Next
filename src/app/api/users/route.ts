import { supabase } from '@/lib/supabase'
import { sanitizeUser, jsonOk } from '@/lib/utils'

export async function GET() {
  const { data } = await supabase.from('users').select('*').order('id', { ascending: false })
  return jsonOk((data || []).map(sanitizeUser))
}
