import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { jsonOk } from '@/lib/utils'

export async function GET() {
  const { data } = await supabase.from('settings').select('value').eq('key', 'contact').single()
  const defaults = { name: '', email: 'hello@nutrinuts.com', phone: '+91 98765 43210', address: 'Mumbai, India', pincode: '' }
  return jsonOk(data ? { ...defaults, ...JSON.parse(data.value) } : defaults)
}

export async function PUT(req: NextRequest) {
  const { name, email, phone, address, pincode } = await req.json()
  const value = JSON.stringify({ name: name || '', email: email || '', phone: phone || '', address: address || '', pincode: pincode || '' })
  const { data: existing } = await supabase.from('settings').select('key').eq('key', 'contact').single()
  if (existing) await supabase.from('settings').update({ value }).eq('key', 'contact')
  else await supabase.from('settings').insert({ key: 'contact', value })
  return jsonOk({ name, email, phone, address, pincode })
}
