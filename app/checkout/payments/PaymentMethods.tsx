"use client";

import { useState } from "react";
// Iconos inline para evitar dependencias externas (lucide-react)

const paymentMethods = [
  {
    name: "Tarjeta de Crédito",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-blue-500 fill-current">
        <path d="M3 5h18a2 2 0 0 1 2 2v2H1V7a2 2 0 0 1 2-2zm-2 8h22v2a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-2zm4 1h6v2H5v-2z"/>
      </svg>
    ),
  },
  {
    name: "PSE",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-green-500 fill-current">
        <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm1 17h-2v-2h2Zm2.071-7.071A3.99 3.99 0 0 1 13 14h-2a2 2 0 0 0-2 2H7a4 4 0 0 1 4-4 2 2 0 1 0-2-2H7a4 4 0 1 1 8 0 3.961 3.961 0 0 1-0.929 2.929Z"/>
      </svg>
    ),
  },
  {
    name: "Efecty",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-yellow-500 fill-current">
        <path d="M12 1a11 11 0 1 0 11 11A11.013 11.013 0 0 0 12 1Zm1 17h-2v-2H8v-2h3v-2H8V9h3V7h2v2h2v2h-2v2h2v2h-2Z"/>
      </svg>
    ),
  },
];

export function PaymentMethods() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  function pay() {
    // Simula el pago y redirige a la página de agradecimiento
    window.location.href = '/checkout/thank-you'
  }

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <div
          key={method.name}
          className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
            selectedMethod === method.name
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => setSelectedMethod(method.name)}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">{method.icon}</div>
            <div className="ml-4">
              <p className="text-lg font-medium">{method.name}</p>
            </div>
          </div>
        </div>
      ))}
      {selectedMethod && (
        <div className="mt-6">
          <button onClick={pay} className="w-full btn btn-primary h-12">
            Pagar con {selectedMethod}
          </button>
        </div>
      )}
    </div>
  );
}
