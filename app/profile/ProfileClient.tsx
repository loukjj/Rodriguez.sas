"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { motion } from "framer-motion"
import Image from "next/image"

interface User {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  isAdmin: boolean
  createdAt: Date
  shippingAddresses: ShippingAddress[]
  orders: Order[]
}

interface ShippingAddress {
  id: string
  fullName: string
  line1: string
  line2?: string | null
  city: string
  postal: string
  country: string
  phone?: string | null
}

interface Order {
  id: string
  totalCents: number
  status: string
  createdAt: Date
  items: OrderItem[]
}

interface OrderItem {
  id: string
  quantity: number
  priceCents: number
  product: {
    name: string
    imageUrl?: string | null
  }
}

export default function ProfileClient({ user }: { user: User }) {
  const { data: session, update } = useSession()
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'orders'>('profile')
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleAvatarUpload = async (file: File) => {
    setIsUploading(true)
    setMessage(null)

    try {
      // Upload image
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/admin/uploads', {
        method: 'POST',
        body: formData
      })

      if (!uploadRes.ok) {
        throw new Error('Error al subir imagen')
      }

      const uploadData = await uploadRes.json()

      // Update user profile
      const updateRes = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadData.path })
      })

      if (!updateRes.ok) {
        throw new Error('Error al actualizar perfil')
      }

      setMessage('Avatar actualizado exitosamente')
      // Update session
      await update({ image: uploadData.path })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error desconocido')
    } finally {
      setIsUploading(false)
    }
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: '👤' },
    { id: 'addresses', label: 'Direcciones', icon: '📍' },
    { id: 'orders', label: 'Pedidos', icon: '📦' }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-accent"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-accent to-accent-2 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-accent">
                  {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              )}

              {/* Upload button */}
              <label className="absolute bottom-0 right-0 bg-accent hover:bg-accent/90 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleAvatarUpload(file)
                  }}
                  disabled={isUploading}
                />
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </label>
            </div>

            {/* User Info */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">{user.name || 'Usuario'}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-muted-foreground">
                  Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES')}
                </span>
                {user.isAdmin && (
                  <span className="bg-accent text-white px-2 py-1 rounded-full text-xs font-medium">
                    Administrador
                  </span>
                )}
              </div>
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${message.includes('error') || message.includes('Error') ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex border-b border-border mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-accent border-b-2 border-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {/* Personal Information */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Información Personal
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre completo</label>
                    <input
                      type="text"
                      defaultValue={user.name || ''}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="Tu nombre completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Correo electrónico</label>
                    <input
                      type="email"
                      defaultValue={user.email || ''}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      disabled
                    />
                    <p className="text-xs text-muted-foreground mt-1">El correo no se puede cambiar</p>
                  </div>

                  <button className="bg-accent hover:bg-accent/90 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                    Guardar Cambios
                  </button>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="bg-card p-6 rounded-xl border border-border">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Estadísticas de Cuenta
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{user.orders.length}</div>
                    <div className="text-sm text-muted-foreground">Pedidos totales</div>
                  </div>

                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-accent">{user.shippingAddresses.length}</div>
                    <div className="text-sm text-muted-foreground">Direcciones</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Direcciones de Envío</h3>
                <button className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Agregar Dirección
                </button>
              </div>

              {user.shippingAddresses.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h4 className="text-lg font-medium mb-2">No tienes direcciones guardadas</h4>
                  <p className="text-muted-foreground">Agrega una dirección para facilitar tus compras</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  {user.shippingAddresses.map((address) => (
                    <div key={address.id} className="bg-card p-6 rounded-xl border border-border">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-semibold">{address.fullName}</h4>
                        <div className="flex gap-2">
                          <button className="text-accent hover:text-accent/80 text-sm">Editar</button>
                          <button className="text-danger hover:text-danger/80 text-sm">Eliminar</button>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p>{address.line1}</p>
                        {address.line2 && <p>{address.line2}</p>}
                        <p>{address.city}, {address.postal}</p>
                        <p>{address.country}</p>
                        {address.phone && <p>Tel: {address.phone}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold">Historial de Pedidos</h3>

              {user.orders.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 className="text-lg font-medium mb-2">No tienes pedidos aún</h4>
                  <p className="text-muted-foreground">Tus pedidos aparecerán aquí cuando realices tu primera compra</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {user.orders.map((order) => (
                    <div key={order.id} className="bg-card p-6 rounded-xl border border-border">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold">Pedido #{order.id.slice(-8)}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${(order.totalCents / 100).toFixed(2)}</div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.status === 'completed' ? 'bg-success/10 text-success' :
                            order.status === 'pending' ? 'bg-warning/10 text-warning' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {order.status === 'completed' ? 'Completado' :
                             order.status === 'pending' ? 'Pendiente' : order.status}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            {item.product.imageUrl && (
                              <img
                                src={item.product.imageUrl}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {item.quantity} × ${(item.priceCents / 100).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}

                        {order.items.length > 3 && (
                          <p className="text-sm text-muted-foreground">
                            +{order.items.length - 3} productos más
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-border">
                        <button className="text-accent hover:text-accent/80 text-sm font-medium">
                          Ver detalles completos →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}