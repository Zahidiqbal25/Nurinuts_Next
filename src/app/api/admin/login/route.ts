import { NextRequest } from 'next/server'
import { jsonError, jsonOk } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password === process.env.ADMIN_PASSWORD) return jsonOk({ success: true })
  return jsonError('Invalid password', 401)
}
