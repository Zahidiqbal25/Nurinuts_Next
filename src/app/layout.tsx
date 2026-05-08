import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'NutriNuts — Premium Dry Fruits & Nuts',
  description: 'Handpicked premium quality dry fruits sourced directly from the world\'s best farms. Pure, fresh, and delivered to your doorstep.',
  keywords: ['dry fruits', 'nuts', 'almonds', 'cashews', 'pistachios', 'online store', 'premium quality'],
  openGraph: {
    title: 'NutriNuts — Premium Dry Fruits & Nuts',
    description: 'Nature\'s finest dry fruits delivered to your doorstep',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body>{children}</body>
    </html>
  )
}
