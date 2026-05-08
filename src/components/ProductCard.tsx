'use client'
import Image from 'next/image'
import { useStore } from '@/lib/store-context'

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useStore()
  const discount = Math.round((1 - product.price / product.originalPrice) * 100)
  const outOfStock = !product.inStock

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 relative group">
      {discount > 0 && <span className="absolute top-3 left-3 bg-red-500 text-white px-2.5 py-1 rounded-md text-xs font-bold z-10 shadow">{discount}% OFF</span>}
      {outOfStock && <span className="absolute top-3 right-3 bg-gray-500 text-white px-2.5 py-1 rounded-md text-xs font-bold z-10">Out of Stock</span>}

      <div className="h-52 overflow-hidden relative">
        <img
          src={product.image && product.image.startsWith('http') ? product.image : `https://via.placeholder.com/300x220?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => (e.currentTarget.src = `https://via.placeholder.com/300x220?text=${encodeURIComponent(product.name)}`)}
        />
      </div>

      <div className="p-4">
        <p className="text-[0.7rem] text-primary-light font-bold uppercase tracking-wider">{product.category}</p>
        <h3 className="font-bold text-gray-900 mt-1">{product.name}</h3>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded inline-block mt-1">{product.weight}</span>
        <div className="flex items-center gap-2 mt-2 mb-3">
          <span className="text-xl font-bold text-primary">₹{product.price}</span>
          {product.originalPrice > product.price && <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>}
        </div>
        <button
          onClick={() => !outOfStock && addToCart(product)}
          disabled={outOfStock}
          className="w-full py-2.5 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-bold text-sm hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
