import React from "react";
import TermsEditor from "@/components/ui/terms/TermsEditor";

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
  const { terms, setTerms, 
    loading, error, 
    updateExistingTerms,
    createNewTermsSection,
    updateExistingTermsSectionById,
    deleteExistingTermsSectionById,
  } = useTerms();

  React.useEffect(() => {
    if (terms && terms.sections && terms.sections.length > 0) {
      setTerms(terms);
    }
  }, [terms]);

  if(loading) {
    return <p>AGB werden geladen...</p>;
  }
  if(error) {
    return <p>Fehler beim Laden der AGB: {error}</p>;
  }

  if (!terms || (terms.sections && terms.sections.length === 0)) {
    return <p>Keine AGB-Daten verfügbar.</p>;
  }
 
  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-4">AGB verwalten</h2>
      
        <TermsEditor
          terms={terms}
          setTerms={setTerms}
          loading={loading}
          error={error}
          updateExistingTerms={updateExistingTerms}
          createNewTermsSection={createNewTermsSection}
          updateExistingTermsSectionById={updateExistingTermsSectionById}
          deleteExistingTermsSectionById={deleteExistingTermsSectionById}
          
        />
       
    
        {msg && <p className="mt-4">{msg}</p>}
    </section>
  );
}