"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import Draggable from "react-draggable"

interface Notification {
  id: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

interface Position {
  x: number
  y: number
}

const POLLING_INTERVAL = 30000 // 30 seconds
const DEFAULT_POSITION: Position = { x: 20, y: 20 }
const POSITION_STORAGE_KEY_PREFIX = 'floating-notification-position-'

export default function FloatingNotificationButton() {
  console.log('FloatingNotificationButton: Component rendered')

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [position, setPosition] = useState<Position>(DEFAULT_POSITION)
  const [isDragging, setIsDragging] = useState(false)
  const { data: session, status } = useSession()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const nodeRef = useRef(null)

  console.log('FloatingNotificationButton: Session status:', status)
  console.log('FloatingNotificationButton: Session data:', session)

  const userId = session?.user?.id
  const positionStorageKey = useMemo(() =>
    userId ? `${POSITION_STORAGE_KEY_PREFIX}${userId}` : null,
    [userId]
  )

  console.log('FloatingNotificationButton: User ID:', userId)
  console.log('FloatingNotificationButton: Position storage key:', positionStorageKey)

  // Load position from localStorage
  useEffect(() => {
    if (positionStorageKey && typeof window !== 'undefined') {
      try {
        const savedPosition = localStorage.getItem(positionStorageKey)
        if (savedPosition) {
          const parsed = JSON.parse(savedPosition)
          setPosition(parsed)
        }
      } catch (error) {
        console.error('Error loading position from localStorage:', error)
      }
    }
  }, [positionStorageKey])

  // Save position to localStorage
  const savePosition = useCallback((newPosition: Position) => {
    if (positionStorageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(positionStorageKey, JSON.stringify(newPosition))
      } catch (error) {
        console.error('Error saving position to localStorage:', error)
      }
    }
  }, [positionStorageKey])

  // Handle drag stop
  const handleDragStop = useCallback((e: any, data: { x: number; y: number }) => {
    const newPosition = { x: data.x, y: data.y }
    setPosition(newPosition)
    savePosition(newPosition)
    setIsDragging(false)
  }, [savePosition])

  // Handle drag start
  const handleDragStart = useCallback(() => {
    setIsDragging(true)
    setIsOpen(false) // Close dropdown when dragging starts
  }, [])

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!session) return

    try {
      setIsLoading(true)
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.isRead).length)
      } else {
        console.error('Failed to fetch notifications:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [session])

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isRead: true }),
      })
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      } else {
        console.error('Failed to mark notification as read:', response.statusText)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }, [])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead)
    if (unreadNotifications.length === 0) return

    try {
      await Promise.all(
        unreadNotifications.map(n =>
          fetch('/api/notifications', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: n.id, isRead: true }),
          })
        )
      )

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }, [notifications])

  // Initial fetch and polling setup
  useEffect(() => {
    if (status === 'authenticated' && session) {
      fetchNotifications()

      // Start polling
      pollingIntervalRef.current = setInterval(fetchNotifications, POLLING_INTERVAL)
    }

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [status, session, fetchNotifications])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }, [])

  // Don't render if not authenticated or still loading
  console.log('FloatingNotificationButton: Checking render condition')
  console.log('FloatingNotificationButton: Status === loading:', status === 'loading')
  console.log('FloatingNotificationButton: !session:', !session)

  if (status === 'loading' || !session) {
    console.log('FloatingNotificationButton: Not rendering - returning null')
    return null
  }

  console.log('FloatingNotificationButton: Rendering component')

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStart={handleDragStart}
      onStop={handleDragStop}
      handle=".drag-handle"
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className="fixed z-50"
        style={{ touchAction: 'none' }}
        onKeyDown={handleKeyDown}
      >
        <div ref={dropdownRef} className="relative">
          {/* Floating Notification Button */}
          <motion.button
            onClick={() => !isDragging && setIsOpen(!isOpen)}
            className={`drag-handle relative p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-card ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Notificaciones${unreadCount > 0 ? `, ${unreadCount} sin leer` : ''}`}
            aria-expanded={isOpen}
            aria-haspopup="true"
            disabled={isDragging}
          >
            {/* Bell Icon with Gradient */}
            <svg
              className="h-5 w-5 drop-shadow-sm"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
              />
            </svg>

            {/* Animated Badge */}
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 -right-1 h-6 w-6 bg-danger rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg"
                >
                  <motion.span
                    key={unreadCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="block"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </motion.span>

                  {/* Pulse animation */}
                  <motion.div
                    className="absolute inset-0 bg-danger rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 0, 0.7]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 mt-3 w-80 glass border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
                role="dialog"
                aria-label="Notificaciones"
              >
                {/* Header */}
                <div className="p-4 border-b border-border bg-gradient-to-r from-accent/5 to-accent-2/5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <svg className="h-4 w-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                      </svg>
                      Notificaciones
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-accent hover:text-accent-2 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 rounded"
                        aria-label="Marcar todas como leídas"
                      >
                        Marcar todas como leídas
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-6 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-accent border-t-transparent"></div>
                      </div>
                      <p className="text-sm text-muted mt-2">Cargando...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-6 text-center">
                      <svg className="h-12 w-12 text-muted mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                      </svg>
                      <p className="text-muted">No tienes notificaciones</p>
                    </div>
                  ) : (
                    notifications.map((notification, index) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 border-b border-border last:border-b-0 transition-all duration-200 hover:bg-accent/5 ${
                          !notification.isRead ? 'bg-accent/10 border-l-4 border-l-accent' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm text-foreground truncate">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted mt-1 overflow-hidden"
                               style={{
                                 display: '-webkit-box',
                                 WebkitLineClamp: 2,
                                 WebkitBoxOrient: 'vertical'
                               }}>
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted mt-2">
                              {new Date(notification.createdAt).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <motion.button
                              onClick={() => markAsRead(notification.id)}
                              className="flex-shrink-0 px-2 py-1 text-xs bg-accent/10 hover:bg-accent/20 text-accent rounded-md transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              aria-label={`Marcar "${notification.title}" como leída`}
                            >
                              ✓ Leído
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Draggable>
  )
}