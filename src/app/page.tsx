import { supabase } from '@/lib/supabase'
import StoreClient from '@/components/StoreClient'

// Server Component - fetches data at request time (SSR)
// This is a major Next.js advantage: SEO-friendly, fast initial load
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*').order('id'),
    supabase.from('categories').select('*').order('id'),
  ])

  return <StoreClient initialProducts={products || []} initialCategories={categories || []} />
}
