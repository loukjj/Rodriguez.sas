"use client"

import ProductsClient from "./ProductsClient"

export default function ProductsPage() {
  // Public listing page — users can browse products. Buying requires auth.
  return <ProductsClient />
}
