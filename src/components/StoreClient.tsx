'use client'
import { useState, useMemo } from 'react'
import { StoreProvider, useStore } from '@/lib/store-context'
import Header from '@/components/Header'
import CartSidebar from '@/components/CartSidebar'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import AuthModal from '@/components/AuthModal'
import CheckoutModal from '@/components/CheckoutModal'

function StoreContent({ initialProducts, initialCategories }: { initialProducts: any[]; initialCategories: any[] }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const filtered = useMemo(() => {
    let products = initialProducts
    if (category !== 'All') products = products.filter(p => p.category === category)
    if (search) {
      const q = search.toLowerCase()
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q))
    }
    return products
  }, [initialProducts, category, search])

  return (
    <>
      <Header
        onSearch={setSearch}
        onOpenAuth={setAuthMode}
        onOpenTrack={() => {}}
        onOpenProfile={() => {}}
        onOpenOrders={() => {}}
      />
      <CartSidebar onCheckout={() => setCheckoutOpen(true)} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white py-12 md:py-20 px-4 md:px-6 text-center relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block bg-accent/20 border border-accent/50 text-accent px-3 md:px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 md:mb-5">🌿 100% Natural & Premium</span>
          <h1 className="font-display text-3xl md:text-4xl lg:text-6xl font-bold mb-4 md:mb-5">Nature&apos;s Finest <span className="text-accent">Dry Fruits</span></h1>
          <p className="text-base md:text-lg opacity-90 max-w-xl mx-auto mb-6 md:mb-8">Handpicked premium quality dry fruits sourced directly from the world&apos;s best farms.</p>
          <div className="flex gap-3 md:gap-4 justify-center flex-wrap mb-8 md:mb-12">
            <a href="#products" className="bg-accent text-primary-dark px-6 md:px-8 py-3 md:py-3.5 rounded-full font-bold shadow-lg hover:-translate-y-1 transition-transform text-sm md:text-base">Shop Now →</a>
            <a href="#why-us" className="border-2 border-white/50 px-6 md:px-8 py-3 md:py-3.5 rounded-full font-semibold hover:bg-white/10 transition-colors text-sm md:text-base">Why NutriNuts?</a>
          </div>
          <div className="flex justify-center gap-2 md:gap-4 flex-wrap">
            {['🌿 100% Natural', '✅ Quality Tested', '🚚 Free Delivery', '↩️ Easy Returns'].map(f => (
              <span key={f} className="text-xs md:text-sm bg-white/10 border border-white/15 px-3 md:px-4 py-1.5 md:py-2 rounded-full">{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto py-5 px-6 flex justify-center items-center gap-10 flex-wrap">
          {[['10K+', 'Happy Customers'], ['50+', 'Premium Products'], ['24hr', 'Fast Delivery']].map(([num, label]) => (
            <div key={label} className="text-center px-6">
              <div className="text-2xl font-bold text-primary font-display">{num}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 md:pt-10 pb-5 flex gap-2 md:gap-2.5 flex-wrap justify-center">
        <button onClick={() => setCategory('All')} className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold border-2 transition-all ${category === 'All' ? 'bg-primary text-white border-primary shadow-md' : 'bg-white border-gray-200 hover:border-primary'}`}>All</button>
        {initialCategories.map(c => (
          <button key={c.id} onClick={() => setCategory(c.name)} className={`px-4 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold border-2 transition-all ${category === c.name ? 'bg-primary text-white border-primary shadow-md' : 'bg-white border-gray-200 hover:border-primary'}`}>
            {c.emoji ? `${c.emoji} ` : ''}{c.name}
          </button>
        ))}
      </div>

      {/* Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 md:px-6 pb-16">
        <h2 className="font-display text-2xl md:text-3xl text-center text-primary-dark mt-8 md:mt-10 mb-2">Our Products</h2>
        <p className="text-center text-gray-500 mb-6 md:mb-8 text-sm md:text-base">Premium quality, unbeatable prices</p>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400"><p className="text-4xl mb-2">🔍</p><p>No products found</p></div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section id="why-us" className="bg-gradient-to-br from-primary-dark to-primary py-12 md:py-16 px-4 md:px-6">
        <h2 className="font-display text-2xl md:text-3xl text-center text-white mb-2">Why Choose NutriNuts?</h2>
        <p className="text-center text-white/70 mb-8 md:mb-10 text-sm md:text-base">We go the extra mile to bring you the best</p>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            ['🌍', 'Globally Sourced', 'Directly sourced from farms in California, Afghanistan, Iran & Chile.'],
            ['🔬', 'Lab Tested', 'Every batch is tested for quality, purity and freshness.'],
            ['📦', 'Secure Packaging', 'Airtight, food-grade packaging that locks in freshness.'],
            ['💰', 'Best Prices', 'Farm-to-door supply chain cuts out middlemen.'],
          ].map(([icon, title, desc]) => (
            <div key={title} className="bg-white/10 border border-white/15 rounded-2xl p-4 md:p-8 text-center text-white hover:bg-white/15 hover:-translate-y-1 transition-all backdrop-blur-sm">
              <span className="text-3xl md:text-4xl block mb-2 md:mb-4">{icon}</span>
              <h3 className="font-bold text-accent mb-1 md:mb-2 text-sm md:text-base">{title}</h3>
              <p className="text-xs md:text-sm opacity-85 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />

      {/* Modals */}
      {authMode && <AuthModal mode={authMode} onClose={() => setAuthMode(null)} onSwitch={setAuthMode} />}
      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} />}
    </>
  )
}

export default function StoreClient({ initialProducts, initialCategories }: { initialProducts: any[]; initialCategories: any[] }) {
  return (
    <StoreProvider>
      <StoreContent initialProducts={initialProducts} initialCategories={initialCategories} />
    </StoreProvider>
  )
}
