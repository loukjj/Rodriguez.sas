import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import PurchaseButton from "./PurchaseButton"

interface EnhancedProduct {
  id: string;
  name: string;
  description?: string | null;
  shortDescription?: string | null;
  priceCents: number;
  originalPriceCents?: number | null;
  imageUrl?: string | null;
  images?: string | null;
  category?: string | null;
  brand?: string | null;
  widthCm?: number | null;
  heightCm?: number | null;
  depthCm?: number | null;
  weightKg?: number | null;
  material?: string | null;
  color?: string | null;
  size?: string | null;
  variants?: string | null;
  usage?: string | null;
  careInstructions?: string | null;
  warranty?: string | null;
  deliveryTime?: string | null;
  stock?: number;
  isActive?: boolean;
  isOnSale?: boolean;
  salePercentage?: number | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  tags?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function ProductCard({ product }: { product: EnhancedProduct }) {
  const router = useRouter();

  // Parse additional fields from the enhanced schema
  const images = product.images ? JSON.parse(product.images as string) : [product.imageUrl].filter(Boolean);
  const tags = product.tags ? JSON.parse(product.tags as string) : [];

  const currentPrice = product.priceCents / 100;
  const originalPrice = product.originalPriceCents ? product.originalPriceCents / 100 : null;
  const discountPercentage = product.salePercentage || (originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);
  const stock = product.stock || 0;

  return (
    <motion.article
      whileHover={{ scale: 1.03, translateY: -6 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="rounded-xl bg-white/90 backdrop-blur-md shadow-lg p-4 flex flex-col relative overflow-hidden group"
    >
      {/* Sale Badge */}
      {(product.isOnSale || discountPercentage > 0) && (
        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 animate-pulse">
          -{discountPercentage}%
        </div>
      )}

      {/* Stock Badge */}
      {stock > 0 && stock <= 5 && (
        <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
          ¡Solo {stock}!
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-32 sm:h-40 md:h-48 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        {images[0] ? (
          <img
            src={images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Multiple images indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            +{images.length - 1}
          </div>
        )}

        {/* Hover overlay with quick actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={() => router.push(`/products/${product.id}`)}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors transform scale-95 group-hover:scale-100"
          >
            Ver detalles
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 flex-1 space-y-2">
        {/* Category/Brand */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          {product.category && <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{product.category}</span>}
          {product.brand && <span className="text-gray-600">{product.brand}</span>}
        </div>

        {/* Title */}
        <h4 className="font-semibold text-gray-900 line-clamp-2 leading-tight">{product.name}</h4>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-sm text-gray-600 line-clamp-2">{product.shortDescription}</p>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 2).map((tag: string, index: number) => (
              <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {tags.length > 2 && (
              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                +{tags.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Specifications preview */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {product.size && <span>📏 {product.size}</span>}
          {product.color && <span>🎨 {product.color}</span>}
          {product.material && <span>🏗️ {product.material}</span>}
        </div>
      </div>

      {/* Price and Actions */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-col">
          {originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-xl font-bold text-gray-900">
            ${currentPrice.toLocaleString()}
          </span>
          {product.deliveryTime && (
            <span className="text-xs text-green-600 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {product.deliveryTime}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <PurchaseButton
            product={{
              id: product.id,
              name: product.name,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl
            }}
            className="btn btn-primary text-sm px-3 py-2 h-auto"
          />
          <button
            onClick={() => router.push(`/products/${product.id}`)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            Ver
          </button>
        </div>
      </div>

      {/* Stock indicator */}
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Stock disponible</span>
          <span className={`font-medium ${stock > 10 ? 'text-green-600' : stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
            {stock > 10 ? 'Disponible' : stock > 0 ? `${stock} unidades` : 'Agotado'}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-1 min-w-0">
          <div
            className={`h-1 rounded-full transition-all duration-500 ${
              stock > 10 ? 'bg-green-500' : stock > 0 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min((stock / 20) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
    </motion.article>
  )
}
