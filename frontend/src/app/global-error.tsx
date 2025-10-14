'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-red-600 mb-4">Etwas ist schiefgelaufen!</h2>
        <p className="text-gray-600 mb-4">
          {error.message || 'Ein unerwarteter Fehler ist aufgetreten.'}
        </p>
        <button
          onClick={() => reset()}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Erneut versuchen
        </button>
      </div>
    </div>
  )
}