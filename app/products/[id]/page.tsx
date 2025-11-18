"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PurchaseButton from '@/app/components/PurchaseButton';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  priceCents: number;
  originalPriceCents?: number;
  imageUrl?: string;
  images?: string; // JSON string from database
  category?: string;
  brand?: string;
  widthCm?: number;
  heightCm?: number;
  depthCm?: number;
  weightKg?: number;
  material?: string;
  color?: string;
  size?: string;
  variants?: string; // JSON string from database
  usage?: string;
  careInstructions?: string;
  warranty?: string;
  deliveryTime?: string;
  stock: number;
  isActive: boolean;
  isOnSale: boolean;
  salePercentage?: number;
  seoTitle?: string;
  seoDescription?: string;
  tags?: string; // JSON string from database
}

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
        if (data.images && JSON.parse(data.images).length > 0) {
          setSelectedImage(0);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
          <Link href="/products" className="btn btn-primary">
            Ver todos los productos
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images ? JSON.parse(product.images as string) : [product.imageUrl].filter(Boolean);
  const variants = product.variants ? JSON.parse(product.variants as string) : [];
  const tags = product.tags ? JSON.parse(product.tags as string) : [];

  const currentPrice = product.priceCents / 100;
  const originalPrice = product.originalPriceCents ? product.originalPriceCents / 100 : null;
  const discountPercentage = product.salePercentage || (originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link href="/" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600 transition-colors">Productos</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative group">
              <div className="aspect-square bg-white rounded-2xl shadow-xl overflow-hidden">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage]}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p>Sin imagen</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sale Badge */}
              {(product.isOnSale || discountPercentage > 0) && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                  -{discountPercentage}%
                </div>
              )}

              {/* Stock Badge */}
              {product.stock > 0 && product.stock <= 5 && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ¡Solo {product.stock} disponibles!
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      selectedImage === index
                        ? 'border-blue-500 shadow-lg scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                  {product.brand && (
                    <p className="text-lg text-gray-600 mt-1">por {product.brand}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    {originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-gray-900">
                      ${currentPrice.toLocaleString()}
                    </span>
                  </div>
                  {product.category && (
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>
              </div>

              {product.shortDescription && (
                <p className="text-lg text-gray-700 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Opciones disponibles</h3>
                <div className="grid grid-cols-2 gap-4">
                  {variants.map((variant: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`p-4 border-2 rounded-lg text-left transition-all duration-300 ${
                        selectedVariant?.id === variant.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="font-medium">{variant.name}</div>
                      <div className="text-sm text-gray-600">
                        ${((product.priceCents + (variant.priceModifier || 0)) / 100).toLocaleString()}
                      </div>
                      {variant.stock !== undefined && (
                        <div className="text-xs text-gray-500 mt-1">
                          Stock: {variant.stock}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Cantidad</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  {product.stock} disponibles
                </span>
              </div>
            </div>

            {/* Purchase Button */}
            <div className="space-y-4">
              <PurchaseButton
                product={{
                  ...product,
                  priceCents: selectedVariant
                    ? product.priceCents + (selectedVariant.priceModifier || 0)
                    : product.priceCents
                }}
                quantity={quantity}
                className="w-full btn btn-primary text-lg py-4 h-auto"
              />

              {/* Payment Methods Info */}
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Métodos de pago aceptados
                </h4>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">💳</span>
                    </div>
                    <span>Tarjetas</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-green-600">🏦</span>
                    </div>
                    <span>PSE</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                      <span className="text-xs font-bold text-yellow-600">💰</span>
                    </div>
                    <span>Efecty</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              {product.deliveryTime && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Información de envío
                  </h4>
                  <p className="text-blue-800">{product.deliveryTime}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-16 space-y-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'description', label: 'Descripción', active: true },
                { id: 'specifications', label: 'Especificaciones' },
                { id: 'usage', label: 'Uso recomendado' },
                { id: 'care', label: 'Cuidado' },
                { id: 'warranty', label: 'Garantía' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    tab.active
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              {product.description && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Descripción del producto</h3>
                  <div dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br>') }} />
                </div>
              )}

              {/* Specifications */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Especificaciones técnicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {product.widthCm && product.heightCm && product.depthCm && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Dimensiones</span>
                      <span className="text-gray-900">{product.widthCm} × {product.heightCm} × {product.depthCm} cm</span>
                    </div>
                  )}
                  {product.weightKg && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Peso</span>
                      <span className="text-gray-900">{product.weightKg} kg</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Material</span>
                      <span className="text-gray-900">{product.material}</span>
                    </div>
                  )}
                  {product.color && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Color</span>
                      <span className="text-gray-900">{product.color}</span>
                    </div>
                  )}
                  {product.size && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-100">
                      <span className="font-medium text-gray-700">Tamaño</span>
                      <span className="text-gray-900">{product.size}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-medium text-gray-700">Stock disponible</span>
                    <span className="text-gray-900">{product.stock} unidades</span>
                  </div>
                </div>
              </div>

              {/* Usage Recommendations */}
              {product.usage && (
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recomendaciones de uso
                  </h3>
                  <p className="text-green-800 leading-relaxed">{product.usage}</p>
                </div>
              )}

              {/* Care Instructions */}
              {product.careInstructions && (
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                    Instrucciones de cuidado
                  </h3>
                  <div className="text-blue-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: product.careInstructions.replace(/\n/g, '<br>') }} />
                </div>
              )}

              {/* Warranty */}
              {product.warranty && (
                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                  <h3 className="text-xl font-bold text-purple-900 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Garantía
                  </h3>
                  <p className="text-purple-800 leading-relaxed">{product.warranty}</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tags */}
              {tags.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-4">Etiquetas</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h4>
                <div className="space-y-3">
                  <button className="w-full btn btn-secondary flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Agregar a favoritos
                  </button>
                  <button className="w-full btn btn-secondary flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Compartir producto
                  </button>
                </div>
              </div>

              {/* Related Products Placeholder */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-4">Productos relacionados</h4>
                <p className="text-gray-600 text-sm">Próximamente: productos similares que te pueden interesar.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
