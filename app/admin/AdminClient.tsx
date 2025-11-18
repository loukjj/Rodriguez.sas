"use client"
import React, { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  description?: string
  shortDescription?: string
  priceCents: number
  originalPriceCents?: number
  imageUrl?: string
  images?: string
  category?: string
  brand?: string
  widthCm?: number
  heightCm?: number
  depthCm?: number
  weightKg?: number
  material?: string
  color?: string
  size?: string
  variants?: string
  usage?: string
  careInstructions?: string
  warranty?: string
  deliveryTime?: string
  stock: number
  isActive: boolean
  isOnSale: boolean
  salePercentage?: number
  seoTitle?: string
  seoDescription?: string
  tags?: string
  createdAt: string
  updatedAt: string
}

interface EnrichedUser {
  id: string
  name?: string
  email?: string
  isAdmin: boolean
  createdAt: string
  activeSessions: number
}

export default function AdminClient({ id, email, image }: { id?: string, email?: string, image?: string }) {
  const [currentTab, setCurrentTab] = useState<'perfil' | 'media' | 'productos' | 'usuarios' | 'notificaciones' | 'configuracion' | 'pedidos' | 'categorias'>('perfil')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  async function onUpload() {
    if (!file) return setMessage('Selecciona un archivo primero')
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file, file.name)

    try {
      const res = await fetch('/api/admin/uploads', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) setMessage('Subido: ' + data.path)
      else setMessage('Error: ' + (data?.error ?? res.status))
    } catch (err) {
      setMessage('Error: ' + String(err))
    } finally {
      setUploading(false)
    }
  }

  // products list and comprehensive CRUD
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    description: '',
    category: '',
    brand: '',
    widthCm: '',
    heightCm: '',
    depthCm: '',
    weightKg: '',
    material: '',
    color: '',
    size: '',
    usage: '',
    careInstructions: '',
    warranty: '',
    deliveryTime: '',
    stock: '0',
    isActive: true,
    isOnSale: false,
    salePercentage: '',
    seoTitle: '',
    seoDescription: '',
    tags: ''
  })

  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [variants, setVariants] = useState<any[]>([])

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
    } finally { setLoading(false) }
  }

  async function uploadImage(file: File) {
    const fd = new FormData()
    fd.append('file', file, file.name)
    const res = await fetch('/api/admin/uploads', { method: 'POST', body: fd })
    return res.json()
  }

  async function createProduct() {
    try {
      // Upload new images
      const uploadedImages: string[] = []
      for (const file of imageFiles) {
        const result = await uploadImage(file)
        if (result?.ok) {
          uploadedImages.push(result.path)
        }
      }

      // Combine existing and new images
      const allImages = [...existingImages, ...uploadedImages]

      const productData = {
        name: productForm.name,
        shortDescription: productForm.shortDescription,
        description: productForm.description,
        priceCents: Math.round(Number(productForm.price) * 100),
        originalPriceCents: productForm.originalPrice ? Math.round(Number(productForm.originalPrice) * 100) : null,
        images: JSON.stringify(allImages),
        category: productForm.category,
        brand: productForm.brand,
        widthCm: productForm.widthCm ? Number(productForm.widthCm) : null,
        heightCm: productForm.heightCm ? Number(productForm.heightCm) : null,
        depthCm: productForm.depthCm ? Number(productForm.depthCm) : null,
        weightKg: productForm.weightKg ? Number(productForm.weightKg) : null,
        material: productForm.material,
        color: productForm.color,
        size: productForm.size,
        variants: JSON.stringify(variants),
        usage: productForm.usage,
        careInstructions: productForm.careInstructions,
        warranty: productForm.warranty,
        deliveryTime: productForm.deliveryTime,
        stock: Number(productForm.stock),
        isActive: productForm.isActive,
        isOnSale: productForm.isOnSale,
        salePercentage: productForm.salePercentage ? Number(productForm.salePercentage) : null,
        seoTitle: productForm.seoTitle,
        seoDescription: productForm.seoDescription,
        tags: JSON.stringify(productForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag))
      }

      if (editingId) {
        const res = await fetch(`/api/admin/products/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        })
        const data = await res.json()
        if (res.ok) {
          resetForm()
          loadProducts()
          setMessage('Producto actualizado exitosamente')
        } else {
          setMessage('Error actualizando producto: ' + (data?.error ?? res.status))
        }
        return
      }

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })
      const data = await res.json()
      if (res.ok) {
        resetForm()
        loadProducts()
        setMessage('Producto creado exitosamente')
      } else {
        setMessage('Error creando producto: ' + (data?.error ?? res.status))
      }
    } catch (err) {
      setMessage(String(err))
    }
  }

  function resetForm() {
    setEditingId(null)
    setProductForm({
      name: '',
      shortDescription: '',
      price: '',
      originalPrice: '',
      description: '',
      category: '',
      brand: '',
      widthCm: '',
      heightCm: '',
      depthCm: '',
      weightKg: '',
      material: '',
      color: '',
      size: '',
      usage: '',
      careInstructions: '',
      warranty: '',
      deliveryTime: '',
      stock: '0',
      isActive: true,
      isOnSale: false,
      salePercentage: '',
      seoTitle: '',
      seoDescription: '',
      tags: ''
    })
    setImageFiles([])
    setExistingImages([])
    setVariants([])
  }

  async function deleteProduct(id: string) {
    if (!confirm('Eliminar producto?')) return
    const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    if (res.ok) loadProducts()
    else setMessage('Error eliminando')
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-4">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt="avatar" className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center">U</div>
        )}
        <div>
          <h2 className="text-2xl font-bold">Panel de administración</h2>
          <p className="text-sm text-muted-foreground">Usuario: {email ?? '—'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(['perfil','media','productos','usuarios','notificaciones','configuracion','pedidos','categorias'] as const).map((t, index) => (
          <button
            key={t}
            onClick={() => setCurrentTab(t)}
            className={`btn ${currentTab===t? 'btn-primary':'btn-secondary'} h-9 transition-all duration-300 hover:scale-105 relative overflow-hidden group`}
            style={{animationDelay: `${index * 50}ms`}}
          >
            <span className="relative z-10">{
              t === 'perfil' ? '👤 Perfil' :
              t === 'media' ? '📁 Media' :
              t === 'productos' ? '📦 Productos' :
              t === 'usuarios' ? '👥 Usuarios' :
              t === 'notificaciones' ? '🔔 Notificaciones' :
              t === 'configuracion' ? '⚙️ Configuración' :
              t === 'pedidos' ? '📋 Pedidos' :
              '🏷️ Categorías'
            }</span>
            {currentTab === t && (
              <div className="absolute inset-0 bg-gradient-to-r from-accent/20 via-accent-2/20 to-accent-3/20 animate-pulse"></div>
            )}
          </button>
        ))}
      </div>

      {/* Sección Perfil */}
      {currentTab === 'perfil' && (
        <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-300">
          <div className="card p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-accent">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Avatar
            </h3>
            <label className="text-xs block mb-1">Editar avatar</label>
            <input type="file" onChange={async (e) => {
              const f = e.target.files?.[0]
              if (!f) return
              setMessage(null)
              setUploading(true)
              try {
                const upRes = await uploadImage(f)
                if (!upRes?.ok) throw new Error(upRes?.error || 'upload failed')
                const imageUrl = upRes.path
                if (!id) throw new Error('user id missing')
                const r = await fetch(`/api/admin/users/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imageUrl }) })
                const jr = await r.json()
                if (!r.ok) throw new Error(jr?.error || 'update failed')
                setMessage('Avatar actualizado')
                const imgEl = document.querySelector('img[alt="avatar"]')
                if (imgEl) (imgEl as HTMLImageElement).src = imageUrl
              } catch (err) {
                setMessage('Error: ' + String(err))
              } finally { setUploading(false) }
            }} />
            {message && <p className="mt-2 text-sm">{message}</p>}
          </div>

          <div className="card p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-accent-2">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
              <svg className="w-5 h-5 text-accent-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Estado del Sistema
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Sistema operativo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                <span className="text-sm">Base de datos conectada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <span className="text-sm">Pagos configurados</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">Desde aquí puedes gestionar todos los apartados del panel usando las pestañas superiores.</p>
          </div>
        </div>
      )}

      {/* Sección Media (Uploads) */}
      {currentTab === 'media' && (
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Subir archivo (imagen o video)</h3>
          <input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          {file && (
            <div className="mt-2">
              {file.type.startsWith('image/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={URL.createObjectURL(file)} alt="preview" className="max-h-40 rounded" />
              ) : file.type.startsWith('video/') ? (
                <video src={URL.createObjectURL(file)} controls className="max-h-40 rounded" />
              ) : (
                <div className="text-sm">Archivo listo para subir: {file.name}</div>
              )}
            </div>
          )}
          <div className="mt-2">
            <button className="btn btn-primary" onClick={onUpload} disabled={uploading}>
              {uploading ? 'Subiendo...' : 'Subir'}
            </button>
          </div>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </div>
      )}

      {/* Sección Productos */}
      {currentTab === 'productos' && (
        <div className="space-y-6">
          {/* Product Form */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              {editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Información Básica</h4>

                <div>
                  <label className="block text-sm font-medium mb-1">Nombre del Producto *</label>
                  <input
                    className="input"
                    value={productForm.name}
                    onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                    placeholder="Ej: Silla Moderna de Oficina"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripción Corta</label>
                  <input
                    className="input"
                    value={productForm.shortDescription}
                    onChange={(e) => setProductForm({...productForm, shortDescription: e.target.value})}
                    placeholder="Breve descripción para mostrar en tarjetas"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Precio *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input"
                      value={productForm.price}
                      onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                      placeholder="99.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Precio Original</label>
                    <input
                      type="number"
                      step="0.01"
                      className="input"
                      value={productForm.originalPrice}
                      onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                      placeholder="129.99"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descripción Completa</label>
                  <textarea
                    className="input"
                    rows={4}
                    value={productForm.description}
                    onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                    placeholder="Descripción detallada del producto..."
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Imágenes del Producto</h4>

                <div>
                  <label className="block text-sm font-medium mb-1">Subir Imágenes</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                    className="input"
                  />
                  <p className="text-xs text-gray-500 mt-1">Puedes seleccionar múltiples imágenes</p>
                </div>

                {/* Existing Images Preview */}
                {existingImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Imágenes Actuales</label>
                    <div className="grid grid-cols-3 gap-2">
                      {existingImages.map((img, index) => (
                        <div key={index} className="relative">
                          <img src={img} alt={`Imagen ${index + 1}`} className="w-full h-20 object-cover rounded" />
                          <button
                            onClick={() => setExistingImages(existingImages.filter((_, i) => i !== index))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Specifications */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">Especificaciones Técnicas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ancho (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input"
                    value={productForm.widthCm}
                    onChange={(e) => setProductForm({...productForm, widthCm: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Alto (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input"
                    value={productForm.heightCm}
                    onChange={(e) => setProductForm({...productForm, heightCm: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Profundidad (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input"
                    value={productForm.depthCm}
                    onChange={(e) => setProductForm({...productForm, depthCm: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Peso (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input"
                    value={productForm.weightKg}
                    onChange={(e) => setProductForm({...productForm, weightKg: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Material</label>
                  <input
                    className="input"
                    value={productForm.material}
                    onChange={(e) => setProductForm({...productForm, material: e.target.value})}
                    placeholder="Ej: Madera, Metal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Color</label>
                  <input
                    className="input"
                    value={productForm.color}
                    onChange={(e) => setProductForm({...productForm, color: e.target.value})}
                    placeholder="Ej: Negro, Blanco"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tamaño</label>
                  <input
                    className="input"
                    value={productForm.size}
                    onChange={(e) => setProductForm({...productForm, size: e.target.value})}
                    placeholder="Ej: Grande, Mediano"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input
                    type="number"
                    className="input"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">Información Adicional</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Categoría</label>
                  <input
                    className="input"
                    value={productForm.category}
                    onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                    placeholder="Ej: Mobiliario, Iluminación"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Marca</label>
                  <input
                    className="input"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                    placeholder="Ej: IKEA, Local"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tiempo de Entrega</label>
                  <input
                    className="input"
                    value={productForm.deliveryTime}
                    onChange={(e) => setProductForm({...productForm, deliveryTime: e.target.value})}
                    placeholder="Ej: 3-5 días hábiles"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Garantía</label>
                  <input
                    className="input"
                    value={productForm.warranty}
                    onChange={(e) => setProductForm({...productForm, warranty: e.target.value})}
                    placeholder="Ej: 1 año"
                  />
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Uso Recomendado</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={productForm.usage}
                    onChange={(e) => setProductForm({...productForm, usage: e.target.value})}
                    placeholder="Describe cómo se recomienda usar el producto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Instrucciones de Cuidado</label>
                  <textarea
                    className="input"
                    rows={2}
                    value={productForm.careInstructions}
                    onChange={(e) => setProductForm({...productForm, careInstructions: e.target.value})}
                    placeholder="Instrucciones para el cuidado y mantenimiento"
                  />
                </div>
              </div>
            </div>

            {/* Sales & Status */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">Estado y Ofertas</h4>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productForm.isActive}
                    onChange={(e) => setProductForm({...productForm, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  Producto Activo
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={productForm.isOnSale}
                    onChange={(e) => setProductForm({...productForm, isOnSale: e.target.checked})}
                    className="mr-2"
                  />
                  En Oferta
                </label>
                {productForm.isOnSale && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Descuento (%):</label>
                    <input
                      type="number"
                      className="input w-20"
                      value={productForm.salePercentage}
                      onChange={(e) => setProductForm({...productForm, salePercentage: e.target.value})}
                      placeholder="20"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* SEO */}
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">SEO y Etiquetas</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Título SEO</label>
                  <input
                    className="input"
                    value={productForm.seoTitle}
                    onChange={(e) => setProductForm({...productForm, seoTitle: e.target.value})}
                    placeholder="Título para motores de búsqueda"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Descripción SEO</label>
                  <input
                    className="input"
                    value={productForm.seoDescription}
                    onChange={(e) => setProductForm({...productForm, seoDescription: e.target.value})}
                    placeholder="Descripción para motores de búsqueda"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Etiquetas (separadas por coma)</label>
                <input
                  className="input"
                  value={productForm.tags}
                  onChange={(e) => setProductForm({...productForm, tags: e.target.value})}
                  placeholder="muebles, oficina, ergonomico, moderno"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button className="btn btn-primary" onClick={createProduct}>
                {editingId ? 'Actualizar Producto' : 'Crear Producto'}
              </button>
              {editingId && (
                <button className="btn btn-ghost" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </div>

          {/* Products List */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-accent-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Productos Existentes
            </h3>

            {loading ? (
              <div className="text-center py-8">Cargando productos...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => {
                  const images = p.images ? JSON.parse(p.images) : [p.imageUrl].filter(Boolean);
                  const tags = p.tags ? JSON.parse(p.tags) : [];

                  return (
                    <div key={p.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                        {images[0] ? (
                          <img src={images[0]} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Sin imagen
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg">{p.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-green-600">
                            ${(p.priceCents / 100).toFixed(2)}
                          </span>
                          {p.originalPriceCents && (
                            <span className="text-sm text-gray-500 line-through">
                              ${(p.originalPriceCents / 100).toFixed(2)}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>Stock: {p.stock}</span>
                          {p.isOnSale && <span className="text-red-600 font-medium">En oferta</span>}
                        </div>

                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {tags.slice(0, 3).map((tag: string, index: number) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <button
                            className="btn btn-sm btn-primary flex-1"
                            onClick={() => {
                              // Load product data for editing
                              setEditingId(p.id);
                              setProductForm({
                                name: p.name,
                                shortDescription: p.shortDescription || '',
                                price: (p.priceCents / 100).toFixed(2),
                                originalPrice: p.originalPriceCents ? (p.originalPriceCents / 100).toFixed(2) : '',
                                description: p.description || '',
                                category: p.category || '',
                                brand: p.brand || '',
                                widthCm: p.widthCm?.toString() || '',
                                heightCm: p.heightCm?.toString() || '',
                                depthCm: p.depthCm?.toString() || '',
                                weightKg: p.weightKg?.toString() || '',
                                material: p.material || '',
                                color: p.color || '',
                                size: p.size || '',
                                usage: p.usage || '',
                                careInstructions: p.careInstructions || '',
                                warranty: p.warranty || '',
                                deliveryTime: p.deliveryTime || '',
                                stock: p.stock.toString(),
                                isActive: p.isActive,
                                isOnSale: p.isOnSale,
                                salePercentage: p.salePercentage?.toString() || '',
                                seoTitle: p.seoTitle || '',
                                seoDescription: p.seoDescription || '',
                                tags: tags.join(', ')
                              });
                              setExistingImages(images);
                              setVariants(p.variants ? JSON.parse(p.variants) : []);
                              setCurrentTab('productos');
                            }}
                          >
                            Editar
                          </button>
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => deleteProduct(p.id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sección Usuarios */}
      {currentTab === 'usuarios' && (
        <div className="card p-4">
          <h3 className="font-semibold mb-2">Usuarios</h3>
          <UsersManager />
        </div>
      )}

      {/* Sección Notificaciones */}
      {currentTab === 'notificaciones' && (
        <div className="card p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM15 7v5H9v-5h6zM4 12h6v5H4v-5z" />
            </svg>
            Enviar Notificaciones
          </h3>
          <NotificationsManager />
        </div>
      )}

      {/* Sección Configuración */}
      {currentTab === 'configuracion' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configuración del Sitio
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Título del Sitio</label>
                <input className="input" defaultValue="Rodriguez.sas - Tienda Online" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea className="input" rows={3} defaultValue="Tienda online con productos exclusivos y de calidad." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email de Contacto</label>
                <input className="input" type="email" defaultValue="contacto@rodriguez.sas" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Teléfono</label>
                <input className="input" defaultValue="+57 300 123 4567" />
              </div>
              <button className="btn btn-primary">Guardar Cambios</button>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-accent-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Configuración de Pagos
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Moneda</label>
                <select className="input">
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="USD">USD - Dólar Americano</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Impuestos (%)</label>
                <input className="input" type="number" defaultValue="19" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Envío Gratuito Mínimo</label>
                <input className="input" type="number" defaultValue="50000" />
              </div>
              <button className="btn btn-primary">Guardar Configuración</button>
            </div>
          </div>
        </div>
      )}

      {/* Sección Pedidos */}
      {currentTab === 'pedidos' && (
        <div className="card p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-accent-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Gestión de Pedidos
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-blue-800">Pendientes</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">45</div>
                <div className="text-sm text-green-800">Completados</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-600">3</div>
                <div className="text-sm text-yellow-800">En Proceso</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-600">1</div>
                <div className="text-sm text-red-800">Cancelados</div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">ID</th>
                    <th className="text-left p-2">Cliente</th>
                    <th className="text-left p-2">Total</th>
                    <th className="text-left p-2">Estado</th>
                    <th className="text-left p-2">Fecha</th>
                    <th className="text-left p-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-2">#001</td>
                    <td className="p-2">Juan Pérez</td>
                    <td className="p-2">$45.000</td>
                    <td className="p-2"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Pendiente</span></td>
                    <td className="p-2">2024-01-15</td>
                    <td className="p-2">
                      <button className="btn btn-sm mr-1">Ver</button>
                      <button className="btn btn-sm btn-ghost">Editar</button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">#002</td>
                    <td className="p-2">María García</td>
                    <td className="p-2">$78.000</td>
                    <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Completado</span></td>
                    <td className="p-2">2024-01-14</td>
                    <td className="p-2">
                      <button className="btn btn-sm mr-1">Ver</button>
                      <button className="btn btn-sm btn-ghost">Editar</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sección Categorías */}
      {currentTab === 'categorias' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="card p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Crear / Editar Categoría
            </h3>
            <div className="space-y-4">
              <input className="input" placeholder="Nombre de la categoría" />
              <textarea className="input" placeholder="Descripción" rows={3} />
              <input type="file" className="input" accept="image/*" />
              <div className="flex gap-2">
                <button className="btn btn-primary">Crear Categoría</button>
                <button className="btn btn-ghost">Limpiar</button>
              </div>
            </div>
          </div>

          <div className="card p-4">
            <h3 className="font-semibold mb-4">Categorías Existentes</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-bold">I</div>
                  <div>
                    <div className="font-medium">Iluminación</div>
                    <div className="text-sm text-muted-foreground">Productos de iluminación</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm">Editar</button>
                  <button className="btn btn-sm btn-ghost">Eliminar</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-2 rounded-full flex items-center justify-center text-white font-bold">M</div>
                  <div>
                    <div className="font-medium">Mobiliario</div>
                    <div className="text-sm text-muted-foreground">Muebles y decoración</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm">Editar</button>
                  <button className="btn btn-sm btn-ghost">Eliminar</button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-3 rounded-full flex items-center justify-center text-white font-bold">D</div>
                  <div>
                    <div className="font-medium">Decoración</div>
                    <div className="text-sm text-muted-foreground">Artículos decorativos</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-sm">Editar</button>
                  <button className="btn btn-sm btn-ghost">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function UsersManager() {
  const [users, setUsers] = React.useState<EnrichedUser[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  async function toggleAdmin(u: EnrichedUser) {
    const res = await fetch(`/api/admin/users/${u.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isAdmin: !u.isAdmin }) })
    if (res.ok) load()
    else alert('Error')
  }

  async function del(u: EnrichedUser) {
    if (!confirm('Eliminar usuario?')) return
    const res = await fetch(`/api/admin/users/${u.id}`, { method: 'DELETE' })
    if (res.ok) load()
  }

  return (
    <div>
      {loading ? <p>Cargando usuarios...</p> : (
        <ul>
          {users.map(u => (
            <li key={u.id} className="flex items-center justify-between mb-2">
              <div>
                <strong>{u.name ?? '—'}</strong> — {u.email}
                {u.isAdmin ? <span className="ml-2 text-sm text-green-600">admin</span> : null}
                {u.activeSessions && u.activeSessions > 0 ? <span className="ml-3 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">Activo</span> : <span className="ml-3 inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">Inactivo</span>}
              </div>
              <div>
                <button className="btn btn-sm mr-2" onClick={() => toggleAdmin(u)}>{u.isAdmin ? 'Quitar admin' : 'Hacer admin'}</button>
                <button className="btn btn-sm btn-ghost" onClick={() => del(u)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function NotificationsManager() {
  const [users, setUsers] = React.useState<EnrichedUser[]>([])
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([])
  const [title, setTitle] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [sending, setSending] = React.useState(false)

  React.useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users')
      const data = await res.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  async function sendNotifications() {
    if (!title.trim() || !message.trim()) {
      alert('Por favor ingresa título y mensaje')
      return
    }
    if (selectedUsers.length === 0) {
      alert('Selecciona al menos un usuario')
      return
    }

    setSending(true)
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: selectedUsers, title: title.trim(), message: message.trim() })
      })
      const data = await res.json()
      if (res.ok) {
        alert(`Notificaciones enviadas a ${data.count} usuarios`)
        setTitle('')
        setMessage('')
        setSelectedUsers([])
      } else {
        alert('Error: ' + (data?.error ?? res.status))
      }
    } catch (err) {
      alert('Error: ' + String(err))
    } finally { setSending(false) }
  }

  function toggleUser(userId: string) {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  function selectAll() {
    setSelectedUsers(users.map(u => u.id))
  }

  function deselectAll() {
    setSelectedUsers([])
  }

  return (
    <div className="space-y-6">
      {/* Formulario de notificación */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título de la notificación</label>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Nueva promoción disponible"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mensaje</label>
          <textarea
            className="input"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe el mensaje de la notificación..."
          />
        </div>
      </div>

      {/* Selección de usuarios */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Seleccionar usuarios ({selectedUsers.length} de {users.length})</h4>
          <div className="flex gap-2">
            <button className="btn btn-sm" onClick={selectAll}>Seleccionar todos</button>
            <button className="btn btn-sm btn-ghost" onClick={deselectAll}>Deseleccionar</button>
          </div>
        </div>

        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <div className="max-h-60 overflow-y-auto border rounded p-2">
            {users.map(u => (
              <label key={u.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(u.id)}
                  onChange={() => toggleUser(u.id)}
                  className="rounded"
                />
                <div>
                  <div className="font-medium">{u.name ?? 'Sin nombre'}</div>
                  <div className="text-sm text-gray-600">{u.email}</div>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Botón enviar */}
      <button
        className="btn btn-primary"
        onClick={sendNotifications}
        disabled={sending || !title.trim() || !message.trim() || selectedUsers.length === 0}
      >
        {sending ? 'Enviando...' : `Enviar a ${selectedUsers.length} usuarios`}
      </button>
    </div>
  )
}

