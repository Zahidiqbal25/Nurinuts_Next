import { supabase } from '@/lib/supabase'
import { jsonOk } from '@/lib/utils'

export async function GET() {
  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: totalUsers },
    { count: pending },
    { data: orders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
    supabase.from('orders').select('total'),
  ])
  const revenue = (orders || []).reduce((s: number, o: any) => s + (o.total || 0), 0)
  return jsonOk({ totalProducts: totalProducts || 0, totalOrders: totalOrders || 0, revenue, pending: pending || 0, totalUsers: totalUsers || 0 })
}
