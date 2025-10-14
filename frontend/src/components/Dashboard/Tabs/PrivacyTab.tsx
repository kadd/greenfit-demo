// frontend/src/components/Dashboard/Tabs/PrivacyTab.tsx
import React from "react";
import PrivacyEditor from "@/components/Dashboard/Editors/privacy/PrivacyEditor";
import { Privacy, PrivacySection } from "@/types/privacy";
import { usePrivacy } from "@/hooks/usePrivacy";

interface PrivacyTabProps {
  router: any;
}

export default function PrivacyTab({ router }: PrivacyTabProps) {
  const [msg, setMsg] = React.useState<string | null>(null);
  
  // ✅ KORRIGIERTE Hook-Destructuring:
  const { 
    privacy, 
    loading, 
    saving,
    error, 
    lastSaved,
    // Privacy Operations (neue Namen)
    updatePrivacy,           // ✅ Nicht updateExistingPrivacy
    createPrivacy,
    deletePrivacy,
    // Section Operations (neue Namen)
    createSection,           // ✅ Nicht createNewPrivacySection
    updateSection,           // ✅ Nicht updateExistingPrivacySectionById
    deleteSection,           // ✅ Nicht deleteExistingPrivacySectionById
    fetchSection,
    // Utility
    reorderSections,
    exportPrivacy,
    importPrivacy,
    validatePrivacy,
    searchSections,
    getStatistics,
    // Management
    refetch,
    clearError,
    setPrivacy
  } = usePrivacy();

  // ✅ ENTFERNT - Unnötiger useEffect:
  // React.useEffect(() => {
  //   if (privacy && privacy.sections && privacy.sections.length > 0) {
  //     setPrivacy(privacy); // Das macht keinen Sinn
  //   }
  // }, [privacy]);

  // ✅ VERBESSERTE Loading States:
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2">Datenschutz wird geladen...</span>
      </div>
    );
  }

  // ✅ VERBESSERTE Error Handling:
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Fehler beim Laden des Datenschutzes</h3>
        <p className="text-red-600 mt-2">{error}</p>
        <button 
          onClick={() => {
            clearError();
            refetch();
          }}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  // ✅ VERBESSERTE Empty State:
  if (!privacy || !privacy.sections || privacy.sections.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Datenschutz verwalten</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <p className="text-gray-600 mb-4">Noch keine Datenschutz-Daten vorhanden.</p>
          <button 
            onClick={async () => {
              try {
                await createPrivacy({
                  title: "Datenschutzerklärung",
                  description: "Unsere Datenschutzbestimmungen"
                });
                setMsg("Datenschutzbestimmungen erstellt!");
              } catch (error) {
                setMsg("Fehler beim Erstellen der Datenschutzbestimmungen");
              }
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Datenschutzbestimmungen erstellen
          </button>
        </div>
        {msg && (
          <p className={`mt-4 ${msg.includes('Fehler') ? 'text-red-600' : 'text-green-600'}`}>
            {msg}
          </p>
        )}
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-green-700">Datenschutz verwalten</h2>
        
        {/* ✅ NEUE Status-Anzeige */}
        <div className="flex items-center space-x-4">
          {saving && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm">Wird gespeichert...</span>
            </div>
          )}
          
          {lastSaved && (
            <span className="text-sm text-gray-500">
              Zuletzt gespeichert: {lastSaved.toLocaleTimeString()}
            </span>
          )}
          
          {/* ✅ NEUE Utility-Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={async () => {
                try {
                  await exportPrivacy();
                  setMsg("Datenschutzbestimmungen erfolgreich exportiert!");
                } catch (error) {
                  setMsg("Fehler beim Export");
                }
              }}
              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Exportieren
            </button>
            
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = async (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    try {
                      await importPrivacy(file);
                      setMsg("Datenschutzbestimmungen erfolgreich importiert!");
                    } catch (error) {
                      setMsg("Fehler beim Import");
                    }
                  }
                };
                input.click();
              }}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Importieren
            </button>
          </div>
        </div>
      </div>

      {/* ✅ NEUE Statistics-Anzeige */}
      {(() => {
        const stats = getStatistics();
        return stats ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-700 mb-2">Statistiken</h3>
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Abschnitte:</span>
                <span className="ml-2 font-semibold">{stats.totalSections}</span>
              </div>
              <div>
                <span className="text-gray-500">Wörter:</span>
                <span className="ml-2 font-semibold">{stats.totalWords}</span>
              </div>
              <div>
                <span className="text-gray-500">Zeichen:</span>
                <span className="ml-2 font-semibold">{stats.totalCharacters}</span>
              </div>
              <div>
                <span className="text-gray-500">Ø Wörter/Abschnitt:</span>
                <span className="ml-2 font-semibold">{stats.averageWordsPerSection}</span>
              </div>
            </div>
          </div>
        ) : null;
      })()}
      
      {/* ✅ ANGEPASSTE PrivacyEditor Props */}
      <PrivacyEditor
        privacy={privacy}
        loading={loading}
        saving={saving}
        error={error}
        // Privacy Operations (neue Namen)
        updatePrivacy={updatePrivacy}
        // Section Operations (neue Namen)  
        createSection={createSection}
        updateSection={updateSection}
        deleteSection={deleteSection}
        // Neue Features
        reorderSections={reorderSections}
        validatePrivacy={validatePrivacy}
        searchSections={searchSections}
        // Management
        onError={(errorMsg) => setMsg(errorMsg)}
        onSuccess={(successMsg) => setMsg(successMsg)}
      />
       
      {/* ✅ VERBESSERTE Message-Anzeige */}
      {msg && (
        <div className={`p-4 rounded-lg ${
          msg.includes('Fehler') 
            ? 'bg-red-50 border border-red-200 text-red-800' 
            : 'bg-green-50 border border-green-200 text-green-800'
        }`}>
          <div className="flex justify-between items-center">
            <span>{msg}</span>
            <button 
              onClick={() => setMsg(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
}