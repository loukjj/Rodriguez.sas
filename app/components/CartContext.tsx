"use client"
// This file existed as an older cart context implementation and some components
// still import `useCart` from './CartContext'. To avoid mismatches with the
// primary `CartProvider` in `CartProvider.tsx` we re-export the provider and
// hook from there so both import paths resolve to the same implementation.
export { useCart, CartProvider } from './CartProvider'