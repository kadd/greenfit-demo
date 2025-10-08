export default function ContactRequestsTab({ contacts, onDelete }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-2">Kontaktanfragen</h2>
      <p className="text-gray-600 mb-4">Hier sind alle eingegangenen Kontaktanfragen:</p>
      <ul className="space-y-6">
        {Object.entries(contacts).map(([email, messages]) => (
          <li key={email} className="border border-gray-300 rounded p-4 bg-white">
            <h3 className="font-bold text-green-700 mb-2">{email}</h3>
            <ul className="space-y-2">
              {messages.map((msg, idx) => (
                <li key={msg.date + idx} className="flex items-center">
                  <div className="flex-1">
                    <div className="text-gray-800">{msg.message}</div>
                    <div className="text-gray-500 text-sm">{new Date(msg.date).toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">Name: {msg.name}</div>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                      onClick={(e) => onDelete(msg.date, e)}
                      title="Nachricht löschen"
                    >
                      Löschen
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}