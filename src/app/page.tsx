'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import StoreClient from '@/components/StoreClient'

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      supabaseClient.from('products').select('*').order('id'),
      supabaseClient.from('categories').select('*').order('id'),
    ]).then(([{ data: p }, { data: c }]) => {
      setProducts(p || [])
      setCategories(c || [])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-primary">
        <div className="text-white text-center">
          <div className="text-4xl mb-4 animate-pulse">🌿</div>
          <p className="font-display text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return <StoreClient initialProducts={products} initialCategories={categories} />
}
