import React from "react";
import PrivacyEditor from "@/components/Dashboard/Editors/privacy/PrivacyEditor";

import { Privacy, PrivacySection } from "@/types/privacy";
import { usePrivacy } from "@/hooks/usePrivacy";
import { useAuth } from "@/hooks/useAuth";

interface PrivacyTabProps {
  router: any;
}

export default function PrivacyTab({ router }: PrivacyTabProps) {
  const [msg, setMsg] = React.useState<string | null>(null);
  const { privacy, setPrivacy, 
    loading, error, 
    updateExistingPrivacy,
    createNewPrivacySection,
    updateExistingPrivacySectionById,
    deleteExistingPrivacySectionById,
  } = usePrivacy();

  React.useEffect(() => {
    if (privacy && privacy.sections && privacy.sections.length > 0) {
      setPrivacy(privacy);
    }
  }, [privacy]);

  if(loading) {
    return <p>Datenschutz wird geladen...</p>;
  }
  if(error) {
    return <p>Fehler beim Laden des Datenschutzes: {error}</p>;
  }

  if (!privacy || (privacy.sections && privacy.sections.length === 0)) {
    return <p>Keine Datenschutz-Daten verfügbar.</p>;
  }
  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-4">Datenschutz verwalten</h2>
    
        <PrivacyEditor
          privacy={privacy}
          setPrivacy={setPrivacy}
          loading={loading}
          error={error}
          updateExistingPrivacy={updateExistingPrivacy}
          createNewPrivacySection={createNewPrivacySection}
          updateExistingPrivacySectionById={updateExistingPrivacySectionById}
          deleteExistingPrivacySectionById={deleteExistingPrivacySectionById} 
        />
       
     
      {msg && <p className="mt-4">{msg}</p>}
    </section>
  );
}
