"use client"
import { SessionProvider } from 'next-auth/react'
import CartProvider from './CartProvider'
import React from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth">
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  )
}
