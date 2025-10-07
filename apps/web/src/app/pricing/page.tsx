'use client'

import Navbar from '../../components/Navbar'
import {
  ShieldCheckIcon,
  CreditCardIcon,
  TruckIcon,
  ScaleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tariffe Trasparenti
          </h1>
          <p className="text-xl text-gray-600">
            La nostra struttura di commissioni garantisce un marketplace sicuro e affidabile
          </p>
        </div>

        {/* Fee Breakdown Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Platform Fee */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-wine-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ScaleIcon className="h-8 w-8 text-wine-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Commissione Piattaforma
                </h3>
                <p className="text-3xl font-bold text-wine-600 mb-2">8%</p>
                <p className="text-sm text-gray-600 mb-3">
                  Calcolata sul valore degli articoli (esclusa spedizione)
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Manutenzione e sviluppo della piattaforma</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Assistenza clienti dedicata</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Sistema di messaggistica sicura</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Prevenzione frodi e controllo qualità</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Buyer Protection Fee */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-wine-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="h-8 w-8 text-wine-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Protezione Acquirente
                </h3>
                <p className="text-3xl font-bold text-wine-600 mb-2">€1,50</p>
                <p className="text-sm text-gray-600 mb-3">
                  Tariffa fissa per ordine
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Servizio escrow per pagamenti sicuri</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Rimborso garantito in caso di problemi</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Assicurazione su transazioni</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Risoluzione dispute professionale</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Processing Fee */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-wine-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CreditCardIcon className="h-8 w-8 text-wine-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Costi di Gestione
                </h3>
                <p className="text-3xl font-bold text-wine-600 mb-2">€0,50</p>
                <p className="text-sm text-gray-600 mb-3">
                  Tariffa fissa per ordine
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Copertura commissioni Stripe/PayPal</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Elaborazione pagamenti sicura</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Pagamenti ai venditori automatizzati</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-wine-100">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <TruckIcon className="h-8 w-8 text-wine-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Spedizione
                </h3>
                <p className="text-3xl font-bold text-wine-600 mb-2">Variabile</p>
                <p className="text-sm text-gray-600 mb-3">
                  Basata sul valore dell&apos;ordine e quantità
                </p>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span><strong>Gratuita</strong> per ordini oltre €100</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>€5 base + €2 per articolo aggiuntivo</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Tracciamento incluso</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Imballaggio professionale</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Example Calculation */}
        <div className="bg-wine-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Esempio di Calcolo
          </h2>

          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">
              Ordine di 1 bottiglia da €80
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Prezzo bottiglia</span>
                <span className="font-medium">€80,00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Spedizione</span>
                <span className="font-medium">€5,00</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Commissione piattaforma (8%)</span>
                <span>€6,40</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Protezione acquirente</span>
                <span>€1,50</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Costi di gestione</span>
                <span>€0,50</span>
              </div>

              <hr className="my-3" />

              <div className="flex justify-between font-bold text-lg">
                <span>Totale da pagare</span>
                <span className="text-wine-600">€93,40</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Il venditore riceve</span>
                <span className="font-semibold text-green-600">€73,60</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                (€80 - 8% commissione)
              </p>
            </div>
          </div>
        </div>

        {/* Why These Fees */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Perché queste commissioni?
          </h2>

          <div className="space-y-6 text-gray-700">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                💎 Marketplace Premium per Vini
              </h3>
              <p>
                Le nostre commissioni riflettono il valore di un marketplace specializzato per vini pregiati,
                con funzionalità avanzate di catalogazione, autenticazione e conservazione delle informazioni.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                🛡️ Protezione Escrow
              </h3>
              <p>
                A differenza di altri marketplace, tratteniamo i fondi in escrow fino alla conferma di consegna,
                proteggendo sia acquirenti che venditori. Questo servizio ha costi significativi che copriamo
                con le nostre commissioni.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                💳 Copertura Commissioni Stripe
              </h3>
              <p>
                Stripe addebita 1,5% + €0,25 per transazioni EU e 2,9% + €0,25 per transazioni internazionali,
                oltre a €0,25 per ogni bonifico ai venditori. Le nostre commissioni coprono questi costi.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                📊 Confronto con la Concorrenza
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="font-semibold">Vinted</p>
                  <p className="text-wine-600">5%</p>
                </div>
                <div className="text-center p-3 bg-wine-50 rounded border-2 border-wine-600">
                  <p className="font-semibold">Il Nostro Marketplace</p>
                  <p className="text-wine-600">8%</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="font-semibold">Catawiki Vini</p>
                  <p className="text-wine-600">9%</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <p className="font-semibold">eBay</p>
                  <p className="text-wine-600">12,9%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Hai domande sulle nostre tariffe?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="bg-wine-600 text-white px-8 py-3 rounded-md font-medium hover:bg-wine-700 transition-colors"
            >
              Inizia a Comprare
            </Link>
            <Link
              href="/sell"
              className="bg-white text-wine-600 px-8 py-3 rounded-md font-medium border-2 border-wine-600 hover:bg-wine-50 transition-colors"
            >
              Inizia a Vendere
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
