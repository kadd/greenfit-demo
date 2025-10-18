 import React from "react";
import TermsEditor from "@/components/Dashboard/Editors/terms/TermsEditor";

import { Terms } from "@/types/terms";
import { useTerms } from "@/hooks/useTerms";
import { useAuth } from "@/hooks/useAuth";

interface TermsTabProps {
  router: any;
  // content: { termsShort: Terms; termsLong: Terms }; --- IGNORE ---
  // setContent: (content: { termsShort: Terms; termsLong: Terms }) => void; --- IGNORE ---
  // handleSave: () => Promise<void>; --- IGNORE ---
}


export default function TermsTab({ router }: TermsTabProps) {
  const [msg, setMsg] = React.useState<string | null>(null);
  const { 
    terms, 
    loading, 
    saving,
    error, 
    lastSaved,
    // Terms Operations (neue Namen)
    updateTerms,
    createTerms,
    deleteTerms,
    // Section Operations (neue Namen)
    createSection,
    updateSection,
    deleteSection,
    // Utility
    reorderSections,
    exportTerms,
    importTerms,
    validateTerms,
    searchSections,
    getStatistics,
    // Management
    refetch,
    clearError,
    setTerms,
    
    // Alte Namen --- IGNORE ---
    // updateExistingTerms, --- IGNORE ---
    // createNewTermsSection, --- IGNORE ---
    // updateExistingTermsSectionById, --- IGNORE ---
    // deleteExistingTermsSectionById, --- IGNORE ---
    // fetchTerms, --- IGNORE ---
    // resetTermsToDefault, --- IGNORE ---
    // getTermsStatistics, --- IGNORE ---
    // exportTermsData, --- IGNORE ---
    // searchTermsSections, --- IGNORE ---
  } = useTerms();


  if(loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2">AGB werden geladen...</span>
      </div>
    );
  }
  if(error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Fehler beim Laden der AGB</h3>
        <p className="text-red-700 mt-2">{error.message}</p>
        <button 
          onClick={() => { clearError(); refetch(); }} 
         className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  if(!terms || !terms.sections || terms.sections.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-green-700 mb-4">AGB verwalten</h2>    
        <div className="text-gray-600">
          <p>Es sind noch keine AGB vorhanden.</p>
          <p className="mt-2">Klicke unten, um eine neue AGB zu erstellen.</p>
          <button
            onClick={async () => {
              try {
                await createTerms({
                  title: "Neue AGB",
                  effectiveDate: new Date().toISOString().split('T')[0],
                  sections: []
                });
                setMsg("✅ Neue AGB erstellt!");
              } catch (err: any) {
                setMsg("❌ " + err.message);
              }
              if(msg)
                setMsg(null);
            }}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Neue AGB erstellen
          </button>
        </div>
      </div>
    );
  }
 
  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-4">AGB verwalten</h2>
      <div className="flex items-center justify-between mb-4">
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
                  await exportTerms();
                  setMsg("AGB erfolgreich exportiert!");
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
                      await importTerms(file);
                      setMsg("AGB erfolgreich importiert!");
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
    
      {/* ✅ ANGEPASSTE TermsEditor Props */}
        <TermsEditor
          terms={terms}
          saving={saving}
          loading={loading}
          error={error}

          updateTerms={updateTerms}
          createSection={createSection}
          updateSection={updateSection}
          deleteSection={deleteSection}

          reorderSections={reorderSections}
          validateTerms={validateTerms}
          searchSections={searchSections}

          onError={(errorMsg: string) => setMsg(errorMsg)}
          onSuccess={(successMsg: string) => setMsg(successMsg)}

          // Alte Namen --- IGNORE ---
          // updateExistingTerms={updateExistingTerms} --- IGNORE ---
          // createNewTermsSection={createNewTermsSection} --- IGNORE ---
          // updateExistingTermsSectionById={updateExistingTermsSectionById} --- IGNORE ---
          // deleteExistingTermsSectionById={deleteExistingTermsSectionById} --- IGNORE ---
          // resetTermsToDefault={resetTermsToDefault} --- IGNORE ---

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