"use client"
import { useCart } from './CartProvider';
import { useRouter } from 'next/navigation';

interface ProductForPurchase {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
}

export default function PurchaseButton({ product, quantity = 1, className = "" }: { product: ProductForPurchase; quantity?: number; className?: string }) {
  const { add } = useCart();
  const router = useRouter();

  const handlePurchase = () => {
    add({ productId: product.id, name: product.name, priceCents: product.priceCents, quantity, imageUrl: product.imageUrl || undefined })
    router.push('/checkout/payments');
  };

  return (
    <button onClick={handlePurchase} className={className || "rounded-md bg-slate-800 text-white px-3 py-1 hover:bg-slate-700"}>
      Comprar
    </button>
  );
}