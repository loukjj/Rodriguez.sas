export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-accent hover:text-accent-2 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al inicio
          </a>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-theme mb-4 enhanced-text-animated">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-theme-muted max-w-2xl mx-auto">
            Por favor, lee detenidamente nuestros términos antes de utilizar nuestros servicios
          </p>
        </div>

        <div className="space-y-8">
          <section className="card p-8">
            <h2 className="text-2xl font-semibold text-theme mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">1</div>
              Aceptación de los Términos
            </h2>
            <p className="text-theme-muted leading-relaxed">
              Al acceder y utilizar nuestros servicios de compra en línea, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio. El uso continuado de nuestro sitio web constituye la aceptación de estos términos.
            </p>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-semibold text-theme mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-2 flex items-center justify-center text-white font-bold text-sm">2</div>
              Descripción del Servicio
            </h2>
            <p className="text-theme-muted leading-relaxed mb-4">
              Rodriguez es una plataforma de comercio electrónico especializada en muebles y decoración de alta calidad. Nuestros servicios incluyen:
            </p>
            <ul className="space-y-2 text-theme-muted ml-6">
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>Catálogo completo de productos premium</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>Procesamiento seguro de pagos</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>Envío nacional e internacional</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>Soporte al cliente especializado</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-accent mt-1">•</span>
                <span>Rastreo de pedidos en tiempo real</span>
              </li>
            </ul>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-semibold text-theme mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-3 flex items-center justify-center text-white font-bold text-sm">3</div>
              Métodos de Pago
            </h2>
            <p className="text-theme-muted leading-relaxed mb-4">
              Aceptamos los siguientes métodos de pago seguros:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">💳</div>
                <div className="font-semibold text-theme">Tarjetas de Crédito/Débito</div>
                <div className="text-sm text-theme-muted">Visa, MasterCard, American Express</div>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">🏦</div>
                <div className="font-semibold text-theme">PSE</div>
                <div className="text-sm text-theme-muted">Pagos Seguros en Línea</div>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="font-semibold text-theme">Efecty</div>
                <div className="text-sm text-theme-muted">Pago en efectivo</div>
              </div>
            </div>
            <p className="text-theme-muted leading-relaxed">
              Todos los pagos son procesados de manera segura a través de proveedores certificados con encriptación SSL de 256 bits. No almacenamos información de tarjetas de crédito en nuestros servidores.
            </p>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-semibold text-theme mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white font-bold text-sm">4</div>
              Política de Envío
            </h2>
            <div className="space-y-4 text-theme-muted">
              <p>
                Los productos serán enviados a la dirección proporcionada por el cliente dentro de los 2-5 días hábiles siguientes a la confirmación del pago.
              </p>
              <div className="bg-accent/5 p-4 rounded-lg">
                <h4 className="font-semibold text-theme mb-2">Tiempos de entrega:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Ciudades principales: 2-3 días hábiles</li>
                  <li>• Ciudades intermedias: 3-5 días hábiles</li>
                  <li>• Zonas rurales: 5-7 días hábiles</li>
                </ul>
              </div>
              <p>
                No nos hacemos responsables por demoras causadas por servicios postales, condiciones climáticas, o situaciones de fuerza mayor. Ofrecemos seguimiento completo de todos los envíos.
              </p>
            </div>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-semibold text-theme mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center text-white font-bold text-sm">5</div>
              Política de Devoluciones
            </h2>
            <div className="space-y-4 text-theme-muted">
              <p>
                Aceptamos devoluciones dentro de los <strong>30 días</strong> siguientes a la recepción del producto, siempre y cuando cumpla con las siguientes condiciones:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span>El producto debe estar en su estado original</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span>Con empaque y etiquetas intactas</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span>Sin signos de uso o daño</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">✓</span>
                  <span>Con comprobante de compra</span>
                </li>
              </ul>
              <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                <p className="text-sm">
                  <strong>Nota:</strong> Los costos de envío de devolución corren por cuenta del cliente, salvo en casos de defecto de fábrica o error en el envío por nuestra parte.
                </p>
              </div>
            </div>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-semibold text-theme mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold text-sm">6</div>
              Privacidad y Protección de Datos
            </h2>
            <div className="space-y-4 text-theme-muted">
              <p>
                En Rodriguez, la privacidad de nuestros clientes es nuestra máxima prioridad. Recopilamos y utilizamos su información personal únicamente para:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">🔒</span>
                  <span>Procesar y entregar sus pedidos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">🔒</span>
                  <span>Comunicarnos sobre el estado de su orden</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">🔒</span>
                  <span>Mejorar nuestros servicios y productos</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-accent mt-1">🔒</span>
                  <span>Cumplir con obligaciones legales</span>
                </li>
              </ul>
              <p>
                No vendemos, alquilamos ni compartimos su información personal con terceros sin su consentimiento expreso, salvo cuando sea requerido por ley.
              </p>
            </div>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-semibold text-theme mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-2 flex items-center justify-center text-white font-bold text-sm">7</div>
              Seguridad de Pagos
            </h2>
            <div className="space-y-4 text-theme-muted">
              <p>
                Implementamos las más altas medidas de seguridad para proteger sus transacciones:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-accent/5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent">🔐</span>
                  </div>
                  <div>
                    <div className="font-semibold text-theme">SSL 256-bit</div>
                    <div className="text-sm">Encriptación de grado bancario</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-accent-2/5 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-accent-2/20 flex items-center justify-center">
                    <span className="text-accent-2">🛡️</span>
                  </div>
                  <div>
                    <div className="font-semibold text-theme">PCI DSS</div>
                    <div className="text-sm">Cumplimiento internacional</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-semibold text-theme mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-3 flex items-center justify-center text-white font-bold text-sm">8</div>
              Garantías y Responsabilidad
            </h2>
            <div className="space-y-4 text-theme-muted">
              <p>
                Todos nuestros productos cuentan con garantía del fabricante. Además, ofrecemos:
              </p>
              <div className="bg-success/10 p-4 rounded-lg border border-success/20">
                <h4 className="font-semibold text-theme mb-2">Garantía Extendida Rodriguez:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Cobertura contra defectos de fabricación por 1 año adicional</li>
                  <li>• Reparación o reemplazo sin costo</li>
                  <li>• Soporte técnico especializado</li>
                </ul>
              </div>
              <p>
                Nuestra responsabilidad máxima se limita al monto pagado por el producto. No somos responsables por daños indirectos o consecuentes.
              </p>
            </div>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-semibold text-theme mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-warning flex items-center justify-center text-white font-bold text-sm">9</div>
              Modificaciones y Actualizaciones
            </h2>
            <p className="text-theme-muted leading-relaxed">
              Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en nuestro sitio web. Le recomendamos revisar periódicamente estos términos para mantenerse informado de cualquier actualización.
            </p>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-semibold text-theme mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-danger flex items-center justify-center text-white font-bold text-sm">10</div>
              Ley Aplicable y Jurisdicción
            </h2>
            <p className="text-theme-muted leading-relaxed">
              Estos términos y condiciones se rigen por las leyes de la República de Colombia. Cualquier disputa o controversia que surja de la interpretación o cumplimiento de estos términos será resuelta en los tribunales competentes de Colombia.
            </p>
          </section>

          <section className="card p-8">
            <h2 className="text-2xl font-semibold text-theme mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white font-bold text-sm">11</div>
              Contacto y Soporte
            </h2>
            <div className="space-y-4 text-theme-muted">
              <p>
                Si tiene alguna pregunta sobre estos términos y condiciones, o necesita asistencia, puede contactarnos a través de:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <div className="text-2xl mb-2">📧</div>
                  <div className="font-semibold text-theme">Email</div>
                  <div className="text-sm">soporte@rodriguez.com</div>
                </div>
                <div className="text-center p-4 bg-accent-2/5 rounded-lg">
                  <div className="text-2xl mb-2">📞</div>
                  <div className="font-semibold text-theme">Teléfono</div>
                  <div className="text-sm">+57 601 123 4567</div>
                </div>
                <div className="text-center p-4 bg-accent-3/5 rounded-lg">
                  <div className="text-2xl mb-2">💬</div>
                  <div className="font-semibold text-theme">Chat en Vivo</div>
                  <div className="text-sm">Disponible 24/7</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-4 p-6 bg-card border border-border rounded-2xl">
            <div className="text-left">
              <div className="text-sm text-theme-muted">Última actualización</div>
              <div className="font-semibold text-theme">
                {new Date().toLocaleDateString('es-CO', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="text-left">
              <div className="text-sm text-theme-muted">Versión</div>
              <div className="font-semibold text-theme">2.1.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}