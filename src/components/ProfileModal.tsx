'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store-context'

export default function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, setUser, showToast } = useStore()
  const [loading, setLoading] = useState(false)
  const [pwLoading, setPwLoading] = useState(false)
  const [error, setError] = useState('')
  const [pwError, setPwError] = useState('')

  async function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(''); setLoading(true)
    const fd = new FormData(e.currentTarget)
    const body = { name: fd.get('name'), phone: fd.get('phone'), address: fd.get('address'), city: fd.get('city'), pincode: fd.get('pincode') }
    const res = await fetch(`/api/users/${user!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    setLoading(false)
    if (res.ok) { setUser(data); showToast('Profile updated!'); onClose() }
    else setError(data.error)
  }

  async function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPwError(''); setPwLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await fetch(`/api/users/${user!.id}/password`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword: fd.get('currentPassword'), newPassword: fd.get('newPassword') }) })
    const data = await res.json()
    setPwLoading(false)
    if (res.ok) { showToast('Password updated!');(e.target as HTMLFormElement).reset() }
    else setPwError(data.error)
  }

  return (
    <div className="modal-overlay open" onMouseDown={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-primary-dark to-primary text-white rounded-t-xl shrink-0">
          <h2 className="font-display text-lg">⚙️ My Profile</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Profile Info */}
          <form onSubmit={handleProfile} className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary border-b-2 pb-2">👤 Personal Info</p>
            <input name="name" required placeholder="Full Name" defaultValue={user?.name || ''} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
            <div className="grid grid-cols-2 gap-3">
              <input name="phone" placeholder="Phone" defaultValue={user?.phone || ''} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
              <input value={user?.email || ''} disabled className="w-full px-4 py-2.5 border-2 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>
            <textarea name="address" placeholder="Address" defaultValue={user?.address || ''} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary resize-none h-16" />
            <div className="grid grid-cols-2 gap-3">
              <input name="city" placeholder="City" defaultValue={user?.city || ''} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
              <input name="pincode" placeholder="Pincode" defaultValue={user?.pincode || ''} className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full btn-primary">{loading ? 'Saving...' : 'Save Changes'}</button>
          </form>

          {/* Change Password */}
          <form onSubmit={handlePassword} className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-primary border-b-2 pb-2">🔒 Change Password</p>
            <input name="currentPassword" type="password" required placeholder="Current Password" className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
            <input name="newPassword" type="password" required minLength={6} placeholder="New Password (min 6 chars)" className="w-full px-4 py-2.5 border-2 rounded-lg outline-none focus:border-primary" />
            {pwError && <p className="text-red-500 text-sm">{pwError}</p>}
            <button type="submit" disabled={pwLoading} className="w-full btn-primary">{pwLoading ? 'Updating...' : 'Update Password'}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
