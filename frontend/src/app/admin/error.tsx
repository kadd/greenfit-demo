'use client'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">Admin-Fehler</h2>
        <p className="text-gray-600 mb-4">
          Ein Fehler ist im Admin-Bereich aufgetreten.
        </p>
        <div className="space-y-2">
          <button
            onClick={() => reset()}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Erneut versuchen
          </button>
          <button
            onClick={() => window.location.href = '/admin/login'}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
          >
            Zum Login
          </button>
        </div>
      </div>
    </div>
  )
}