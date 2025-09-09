import { useState } from 'react'
import { UserRole, type Product } from '@sellyourwine/shared/dist/types/database'
import './App.css'

function App() {
  const [userRole] = useState<UserRole>(UserRole.BUYER)
  
  // Esempio di utilizzo dei tipi condivisi
  const sampleProduct: Product = {
    id: "123",
    sellerId: "456",
    name: "Chianti Classico DOCG",
    vintage: 2020,
    region: "Toscana",
    alcoholPct: 14,
    description: "Un elegante Chianti con note di ciliegia e spezie",
    priceCents: 2500,
    currency: "EUR",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-50 to-wine-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-6xl font-display font-bold text-wine-900 mb-4">
            🍷 SellYourWine
          </h1>
          <p className="text-xl text-wine-700 max-w-2xl mx-auto">
            Il marketplace per i migliori vini italiani
          </p>
          <div className="mt-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-wine-100 text-wine-800">
              Utente: {userRole}
            </span>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <div className="wine-card p-8 mb-8">
            <h2 className="text-3xl font-display font-semibold text-gray-900 mb-6">
              🏗️ Monorepo Setup Completo
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Backend NestJS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Frontend React + Vite</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Shared TypeScript Types</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Turborepo Build System</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">pnpm Workspaces</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Tailwind CSS + Design System</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">JWT Authentication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Cart System</span>
                </div>
              </div>
            </div>
          </div>

          <div className="wine-card p-8">
            <h3 className="text-2xl font-display font-semibold text-gray-900 mb-4">
              📦 Type Safety in Action
            </h3>
            <p className="text-gray-600 mb-6">
              Esempio di utilizzo dei tipi condivisi tra frontend e backend:
            </p>
            <div className="bg-gray-50 rounded-lg p-6 space-y-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Nome:</span>
                <span className="text-gray-900">{sampleProduct.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Annata:</span>
                <span className="text-gray-900">{sampleProduct.vintage}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Regione:</span>
                <span className="text-gray-900">{sampleProduct.region}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Prezzo:</span>
                <span className="text-wine-700 font-semibold">
                  €{(sampleProduct.priceCents / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  sampleProduct.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {sampleProduct.isActive ? 'Disponibile' : 'Non disponibile'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex space-x-4">
              <button className="btn-primary px-6 py-3">
                🚀 Inizia lo Shopping
              </button>
              <button className="btn-outline px-6 py-3">
                📚 Documentazione API
              </button>
            </div>
          </div>
        </main>

        <footer className="text-center mt-12 pt-8 border-t border-wine-200">
          <p className="text-wine-600">
            Powered by NestJS + React + TypeScript Monorepo
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App