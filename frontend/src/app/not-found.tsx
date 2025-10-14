import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">404 - Seite nicht gefunden</h2>
        <p className="text-gray-600 mb-6">
          Die angeforderte Seite konnte nicht gefunden werden.
        </p>
        <Link 
          href="/"
          className="inline-block bg-green-500 text-white py-2 px-6 rounded hover:bg-green-600 transition"
        >
          Zur Startseite
        </Link>
      </div>
    </div>
  )
}