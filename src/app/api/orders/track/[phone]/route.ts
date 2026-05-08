import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonError, jsonOk } from '@/lib/utils'

export async function GET(_: NextRequest, { params }: { params: { phone: string } }) {
  const phone = params.phone.trim()
  if (!phone) return jsonError('Phone number is required')
  const { data } = await supabase.from('orders').select('*').eq('customerPhone', phone).order('id', { ascending: false })
  return jsonOk(data || [])
}
