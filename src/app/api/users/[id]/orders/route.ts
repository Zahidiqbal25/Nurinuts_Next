import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonOk } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const { data } = await supabase.from('orders').select('*').eq('userId', Number(params.id)).order('id', { ascending: false })
  return jsonOk(data || [])
}
