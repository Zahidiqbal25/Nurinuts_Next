import { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import { hashPassword, jsonError, jsonOk } from '@/lib/utils'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { data: user } = await supabase.from('users').select('*').eq('id', Number(params.id)).single()
  if (!user) return jsonError('User not found', 404)

  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword) return jsonError('currentPassword and newPassword are required')
  if (user.password !== hashPassword(currentPassword)) return jsonError('Current password is incorrect', 401)
  if (newPassword.length < 6) return jsonError('New password must be at least 6 characters')

  await supabase.from('users').update({ password: hashPassword(newPassword) }).eq('id', user.id)
  return jsonOk({ message: 'Password updated successfully' })
}
