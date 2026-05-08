'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useStore } from '@/lib/store-context'

export default function Header({ onSearch, onOpenAuth, onOpenTrack, onOpenProfile, onOpenOrders }: {
  onSearch: (q: string) => void
  onOpenAuth: (mode: 'login' | 'register') => void
  onOpenTrack: () => void
  onOpenProfile: () => void
  onOpenOrders: () => void
}) {
  const { cart, user, logout } = useStore()
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [banner, setBanner] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  useEffect(() => {
    fetch('/api/settings/banner').then(r => r.json()).then(d => d.banner && setBanner(d.banner))
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false) }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  return (
    <header className="bg-primary-dark text-white sticky top-0 z-[100] shadow-md">
      {banner && (
        <div className="bg-gradient-to-r from-green-700 via-primary to-primary-dark text-accent py-3 overflow-hidden whitespace-nowrap border-b-2 border-accent">
          <span className="inline-block pl-[100%] animate-marquee font-bold tracking-wider uppercase text-sm">{banner}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-5">
        <Link href="/" className="font-display text-2xl font-bold">🥜 Nutri<span className="text-accent">Nuts</span></Link>

        <div className="flex-1 max-w-md relative hidden md:block">
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSearch(search)}
            placeholder="Search almonds, cashews, pistachios..."
            className="w-full px-4 py-2.5 pr-10 rounded-full bg-white/10 border-2 border-white/20 text-white placeholder:text-white/60 outline-none focus:border-accent text-sm"
          />
          <button onClick={() => onSearch(search)} className="absolute right-1 top-1/2 -translate-y-1/2 bg-accent text-primary-dark w-8 h-8 rounded-full text-sm">🔍</button>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm px-3 py-2 rounded-lg hover:bg-white/10 hidden sm:flex items-center gap-1">📊 Admin</Link>

          {!user ? (
            <>
              <button onClick={() => onOpenAuth('login')} className="text-sm px-3 py-2 rounded-lg hover:bg-white/10">👤 Login</button>
              <button onClick={onOpenTrack} className="text-sm px-3 py-2 rounded-lg hover:bg-white/10 hidden sm:block">📦 Track</button>
            </>
          ) : (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-sm px-3 py-2 rounded-lg hover:bg-white/10 flex items-center gap-1">
                👤 {user.name.split(' ')[0]} ▾
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 bg-white rounded-xl shadow-xl min-w-[180px] overflow-hidden z-50">
                  <button onClick={() => { onOpenOrders(); setMenuOpen(false) }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">📦 My Orders</button>
                  <button onClick={() => { onOpenProfile(); setMenuOpen(false) }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">⚙️ My Profile</button>
                  <button onClick={() => { logout(); setMenuOpen(false) }} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">🚪 Logout</button>
                </div>
              )}
            </div>
          )}

          <button onClick={() => { const e = document.getElementById('cartSidebar'); e?.classList.toggle('translate-x-0'); e?.classList.toggle('translate-x-full'); document.getElementById('cartOverlay')?.classList.toggle('hidden') }} className="relative text-sm px-3 py-2 rounded-lg hover:bg-white/10">
            🛒 Cart
            <span className="absolute -top-1 -right-1 bg-accent text-primary-dark text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
