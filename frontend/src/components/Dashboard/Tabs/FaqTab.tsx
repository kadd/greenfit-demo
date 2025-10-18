import React from "react";
import FAQEditor from "../Editors/faq/FAQEditor1.1";

import { FAQ } from "@/types/faq";
import { FAQItem } from "@/types/faq";

import { useFAQ } from "@/hooks/useFAQ";
import { updateTerms } from "@/services/content";

interface FaqTabProps {
  router: any;
  // faq: FAQ; --- IGNORE ---
  // setFaq: (faq: FAQ) => void; --- IGNORE ---
  // handleSave: () => Promise<void>; --- IGNORE ---
}

export default function FaqTab({  router }) {
  const [msg, setMsg] = React.useState<string | null>(null);
  const { 
    faq, 
    loading, 
    saving,
    error, 
    lastSaved,
    // FAQ Operations
    updateFAQ,
    createFAQ,
    deleteFAQ,
    // Item Operations
    createItem,
    updateItem,
    deleteItem,
    // Utility
    reorderItems,
    exportFAQ,
    importFAQ,
    validateFAQ,
    searchItems,
    getStatistics,
    //Management
    refetch,
    clearError,
    setFaq
  } = useFAQ();
 
  
  if(loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="ml-2">FAQ werden geladen...</span>
      </div>
    );
  }
  if(error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="text-red-800 font-semibold">Fehler beim Laden der FAQ</h3>
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

  if(!faq || !faq.items || faq.items.length === 0) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-green-700 mb-4">FAQ verwalten</h2>    
        <div className="text-gray-600">
          <p>Es sind noch keine FAQ vorhanden.</p>
          <p className="mt-2">Klicke unten, um eine neue FAQ zu erstellen.</p>
          <button
            onClick={async () => {
              try {
                await createFAQ({
                  title: "Neue FAQ",
                  effectiveDate: new Date().toISOString().split('T')[0],
                  items: []
                });
                setMsg("✅ Neue FAQ erstellt!");
              } catch (err: any) {
                setMsg("❌ " + err.message);
              }
              if(msg)
                setMsg(null);
            }}
            className="mt-4 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
          >
            Neue FAQ erstellen
          </button>
        </div>
      </div>
    );
  }


 return (
     <section>
       <h2 className="text-2xl font-bold text-green-700 mb-4">FAQ verwalten</h2>
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
                   setMsg("FAQ erfolgreich exportiert!");
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
                       await importFAQ(file);
                       setMsg("FAQ erfolgreich importiert!");
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
                 <span className="text-gray-500">Items:</span>
                 <span className="ml-2 font-semibold">{stats.totalItems}</span>
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
                 <span className="ml-2 font-semibold">{stats.averageWordsPerItem}</span>
               </div>
             </div>
           </div>
         ) : null;
       })()}
     
       {/* ✅ ANGEPASSTE FAQEditor Props */}
         <FAQEditor
           faq={faq}
           saving={saving}
           loading={loading}
           error={error}

           updateFAQ={updateFAQ}
           createItem={createItem}
           updateItem={updateItem}
           deleteItem={deleteItem}
 
           reorderItems={reorderItems}
           validateFAQ={validateFAQ}
           searchItems={searchItems}
 
           onError={(errorMsg: string) => setMsg(errorMsg)}
           onSuccess={(successMsg: string) => setMsg(successMsg)}
 
           // Alte Namen --- IGNORE ---
           // updateExistingFAQ={updateExistingFAQ} --- IGNORE ---
           // createNewFAQItem={createNewFAQItem} --- IGNORE ---
           // updateExistingFAQItemById={updateExistingFAQItemById} --- IGNORE ---
           // deleteExistingFAQItemById={deleteExistingFAQItemById} --- IGNORE ---
           // resetFAQToDefault={resetFAQToDefault} --- IGNORE ---
 
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