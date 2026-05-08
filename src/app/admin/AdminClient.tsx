'use client'
import { useState, useEffect } from 'react'

export default function AdminClient() {
  const [authed, setAuthed] = useState(false)
  const [section, setSection] = useState('dashboard')
  const [stats, setStats] = useState<any>({})
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [banner, setBanner] = useState('')
  const [contact, setContact] = useState({ email: '', phone: '', address: '', pincode: '' })
  const [editProduct, setEditProduct] = useState<any>(null)
  const [showProductModal, setShowProductModal] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('df_admin') === 'true') setAuthed(true)
  }, [])

  useEffect(() => { if (authed) loadAll() }, [authed])

  async function loadAll() {
    const [s, p, o, c, u, b, ct] = await Promise.all([
      fetch('/api/stats').then(r => r.json()),
      fetch('/api/products').then(r => r.json()),
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/users').then(r => r.json()),
      fetch('/api/settings/banner').then(r => r.json()),
      fetch('/api/settings/contact').then(r => r.json()),
    ])
    setStats(s); setProducts(p); setOrders(o); setCategories(c); setUsers(u); setBanner(b.banner || ''); setContact(ct)
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: fd.get('password') }) })
    if (res.ok) { sessionStorage.setItem('df_admin', 'true'); setAuthed(true) }
    else alert('Invalid password')
  }

  async function updateOrderStatus(id: number, status: string) {
    await fetch(`/api/orders/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    loadAll()
  }

  async function deleteOrder(id: number) {
    if (!confirm('Delete this order?')) return
    await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    loadAll()
  }

  async function deleteProduct(id: number) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    loadAll()
  }

  async function uploadImage(file: File): Promise<string> {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    return data.url || ''
  }

  async function saveProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const fileInput = (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement)
    let image = imagePreview || editProduct?.image || ''

    if (fileInput?.files?.[0]) {
      image = await uploadImage(fileInput.files[0])
    }

    const body = { name: fd.get('name'), category: fd.get('category'), price: Number(fd.get('price')), originalPrice: Number(fd.get('originalPrice')), weight: fd.get('weight'), description: fd.get('description'), rating: Number(fd.get('rating')) || 4.5, quantity: Number(fd.get('quantity')) || 0, image, inStock: Number(fd.get('quantity')) > 0 }

    if (editProduct) await fetch(`/api/products/${editProduct.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    else await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

    setShowProductModal(false); setEditProduct(null); setImagePreview(''); loadAll()
  }

  async function saveBanner() {
    await fetch('/api/settings/banner', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ banner }) })
    alert('Banner updated!')
  }

  async function saveContact() {
    await fetch('/api/settings/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(contact) })
    alert('Contact info updated!')
  }

  async function addCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fd.get('name'), emoji: fd.get('emoji') }) })
    e.currentTarget.reset(); loadAll()
  }

  async function deleteCategory(id: number) {
    if (!confirm('Delete this category?')) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    loadAll()
  }

  async function deleteUser(id: number) {
    if (!confirm('Delete this user?')) return
    await fetch(`/api/users/${id}`, { method: 'DELETE' })
    loadAll()
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-dark to-primary">
        <div className="bg-white p-10 rounded-xl w-full max-w-sm shadow-2xl text-center">
          <h1 className="font-display text-2xl text-primary mb-2">🥜 NutriNuts</h1>
          <p className="text-gray-500 text-sm mb-6">Admin Panel Login</p>
          <form onSubmit={handleLogin}>
            <input name="password" type="password" placeholder="Enter admin password" required className="w-full px-4 py-3 border-2 rounded-lg mb-4 outline-none focus:border-primary" />
            <button type="submit" className="w-full btn-primary">Login</button>
          </form>
        </div>
      </div>
    )
  }

  const nav = [['dashboard', '📊', 'Dashboard'], ['products', '📦', 'Products'], ['orders', '🧾', 'Orders'], ['categories', '🏷️', 'Categories'], ['users', '👥', 'Users']]
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-[99] lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`w-60 bg-primary-dark text-white py-5 fixed h-screen overflow-y-auto z-[100] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="px-5 pb-5 border-b border-white/10 font-display text-lg flex justify-between items-center">🥜 <span className="text-accent">NutriNuts</span><button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white/70 hover:text-white">✕</button></div>
        <nav className="mt-5 space-y-1">
          {nav.map(([key, icon, label]) => (
            <button key={key} onClick={() => { setSection(key); setSidebarOpen(false) }} className={`w-full text-left flex items-center gap-3 px-6 py-3 text-sm transition-colors ${section === key ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/5'}`}>
              <span>{icon}</span> {label}
            </button>
          ))}
          <a href="/" className="flex items-center gap-3 px-6 py-3 text-sm text-white/70 hover:bg-white/5"><span>🏪</span> View Store</a>
          <button onClick={() => { sessionStorage.removeItem('df_admin'); setAuthed(false) }} className="w-full text-left flex items-center gap-3 px-6 py-3 text-sm text-white/70 hover:bg-white/5"><span>🚪</span> Logout</button>
        </nav>
      </aside>

      {/* Main */}
      <main className="lg:ml-60 flex-1 p-4 md:p-6 bg-[#faf8f5] min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between mb-4 bg-white rounded-xl p-3 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="text-primary text-xl">☰</button>
          <span className="font-display text-primary">Admin Panel</span>
          <span></span>
        </div>
        {section === 'dashboard' && (
          <>
            <h1 className="font-display text-2xl mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[['📦', stats.totalProducts, 'Products'], ['🧾', stats.totalOrders, 'Orders'], ['💰', `₹${(stats.revenue || 0).toLocaleString()}`, 'Revenue'], ['⏳', stats.pending, 'Pending']].map(([icon, val, label]) => (
                <div key={label as string} className="bg-white p-6 rounded-xl shadow-sm"><span className="text-2xl">{icon}</span><div className="text-2xl font-bold text-primary mt-2">{val}</div><div className="text-sm text-gray-500">{label}</div></div>
              ))}
            </div>
            {/* Banner */}
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
              <h2 className="font-semibold mb-3">📢 Store Banner</h2>
              <div className="flex gap-3"><input value={banner} onChange={e => setBanner(e.target.value)} className="flex-1 px-4 py-2.5 border rounded-lg outline-none focus:border-primary" /><button onClick={saveBanner} className="btn-primary text-sm">Save</button></div>
            </div>
            {/* Contact */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <h2 className="font-semibold mb-3">📞 Contact Info</h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} placeholder="Email" className="px-4 py-2.5 border rounded-lg outline-none focus:border-primary" />
                <input value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })} placeholder="Phone" className="px-4 py-2.5 border rounded-lg outline-none focus:border-primary" />
                <input value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })} placeholder="Address" className="px-4 py-2.5 border rounded-lg outline-none focus:border-primary" />
                <input value={contact.pincode} onChange={e => setContact({ ...contact, pincode: e.target.value })} placeholder="Pincode" className="px-4 py-2.5 border rounded-lg outline-none focus:border-primary" />
              </div>
              <button onClick={saveContact} className="btn-primary text-sm">Save Contact</button>
            </div>
          </>
        )}

        {section === 'products' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-display text-2xl">Products</h1>
              <button onClick={() => { setEditProduct(null); setImagePreview(''); setShowProductModal(true) }} className="btn-primary text-sm">+ Add Product</button>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead><tr className="bg-gray-50 text-left text-xs uppercase text-gray-500"><th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Category</th><th className="p-3">Price</th><th className="p-3">Qty</th><th className="p-3">Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} className="border-t hover:bg-gray-50">
                      <td className="p-3"><img src={p.image} className="w-10 h-10 rounded-lg object-cover" onError={e => (e.currentTarget.src = 'https://via.placeholder.com/40')} /></td>
                      <td className="p-3 font-semibold">{p.name}</td>
                      <td className="p-3">{p.category}</td>
                      <td className="p-3">₹{p.price} <span className="text-gray-400 line-through text-xs">₹{p.originalPrice}</span></td>
                      <td className="p-3"><span className={p.quantity > 0 ? 'text-primary font-bold' : 'text-red-500 font-bold'}>{p.quantity ?? 0}</span></td>
                      <td className="p-3 flex gap-2">
                        <button onClick={() => { setEditProduct(p); setImagePreview(''); setShowProductModal(true) }} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200">✏️</button>
                        <button onClick={() => deleteProduct(p.id)} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-red-100 hover:text-red-600">🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {section === 'orders' && (
          <>
            <h1 className="font-display text-2xl mb-6">Orders ({orders.length})</h1>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead><tr className="bg-gray-50 text-left text-xs uppercase text-gray-500"><th className="p-3">#</th><th className="p-3">Customer</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Payment</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">#{o.id}</td>
                      <td className="p-3"><div className="font-semibold">{o.customerName}</div><div className="text-xs text-gray-400">{o.customerPhone}</div></td>
                      <td className="p-3 text-xs">{(Array.isArray(o.items) ? o.items : []).map((i: any) => `${i.name} ×${i.qty}`).join(', ')}</td>
                      <td className="p-3 font-bold">₹{o.total?.toLocaleString()}</td>
                      <td className="p-3">{o.payment}</td>
                      <td className="p-3">
                        <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} className="text-xs px-2 py-1 border rounded-lg">
                          {['Pending', 'Confirmed', 'Shipped', 'Dispatched', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="p-3"><button onClick={() => deleteOrder(o.id)} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-red-100">🗑</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {section === 'categories' && (
          <>
            <h1 className="font-display text-2xl mb-6">Categories</h1>
            <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
              <form onSubmit={addCategory} className="flex gap-3 items-end">
                <div><label className="text-xs font-semibold text-gray-500 block mb-1">Emoji</label><input name="emoji" placeholder="🌰" className="w-20 px-3 py-2.5 border rounded-lg outline-none focus:border-primary" /></div>
                <div className="flex-1"><label className="text-xs font-semibold text-gray-500 block mb-1">Name</label><input name="name" required placeholder="Category name" className="w-full px-4 py-2.5 border rounded-lg outline-none focus:border-primary" /></div>
                <button type="submit" className="btn-primary text-sm">+ Add</button>
              </form>
            </div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-left text-xs uppercase text-gray-500"><th className="p-3">Emoji</th><th className="p-3">Name</th><th className="p-3">Actions</th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-xl">{c.emoji || '—'}</td>
                      <td className="p-3 font-semibold">{c.name}</td>
                      <td className="p-3"><button onClick={() => deleteCategory(c.id)} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-red-100">🗑</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {section === 'users' && (
          <>
            <h1 className="font-display text-2xl mb-6">Users ({users.length})</h1>
            <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead><tr className="bg-gray-50 text-left text-xs uppercase text-gray-500"><th className="p-3">ID</th><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Phone</th><th className="p-3">City</th><th className="p-3">Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">#{u.id}</td>
                      <td className="p-3 font-semibold">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.phone || '—'}</td>
                      <td className="p-3">{u.city || '—'}</td>
                      <td className="p-3"><button onClick={() => deleteUser(u.id)} className="px-2 py-1 bg-gray-100 rounded text-xs hover:bg-red-100">🗑</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Product Modal */}
        {showProductModal && (
          <div className="modal-overlay open">
            <div className="bg-white rounded-xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
              <h2 className="font-display text-xl mb-5">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
              <form onSubmit={saveProduct} className="space-y-3">
                <input name="name" required placeholder="Product Name" defaultValue={editProduct?.name || ''} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
                <div className="grid grid-cols-2 gap-3">
                  <select name="category" required defaultValue={editProduct?.category || ''} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>)}
                  </select>
                  <input name="weight" required placeholder="Weight (e.g. 500g)" defaultValue={editProduct?.weight || ''} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input name="price" type="number" required placeholder="Selling Price" defaultValue={editProduct?.price || ''} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
                  <input name="originalPrice" type="number" required placeholder="Original Price" defaultValue={editProduct?.originalPrice || ''} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">Product Image</label>
                  {(imagePreview || editProduct?.image) && <img src={imagePreview || editProduct?.image} className="w-20 h-20 rounded-lg object-cover mb-2" />}
                  <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) setImagePreview(URL.createObjectURL(f)) }} className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-semibold file:cursor-pointer" />
                </div>
                <textarea name="description" placeholder="Description" defaultValue={editProduct?.description || ''} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary resize-none h-16" />
                <div className="grid grid-cols-2 gap-3">
                  <input name="rating" type="number" step="0.1" min="1" max="5" placeholder="Rating" defaultValue={editProduct?.rating || 4.5} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
                  <input name="quantity" type="number" min="0" placeholder="Stock Qty" defaultValue={editProduct?.quantity || 0} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={uploading} className="flex-1 btn-primary disabled:opacity-50">{uploading ? 'Uploading...' : 'Save Product'}</button>
                  <button type="button" onClick={() => { setShowProductModal(false); setEditProduct(null) }} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
