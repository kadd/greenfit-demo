import React from "react";
import { ContactRequest,GroupedContactRequests } from "@/types/contactRequests";
import ContactRequestsEditor from "@/components/Dashboard/Editors/contactRequests/ContactRequestsEditor";
import { useContactRequests } from "@/hooks/useContactRequests";

type ContactRequestsTabProps = {
  router: any;
};

export default function ContactRequestsTab({ router }: ContactRequestsTabProps) {
  const { contactRequests, deleteContactRequestById: onDelete, loading, error, setContactRequests,
    fetchContactRequestsGroupedByEmail, deleteContactRequestById,replyMessage, replyToContactRequest,
    addCommentToContactRequestById, filterContactRequestsByEmail, exportContactRequestsToCSV, updateContactRequestStatusById
   } = useContactRequests();

  if (loading) return <p>Kontaktanfragen werden geladen...</p>;
  if (error) return <p className="text-red-600">Fehler: {error}</p>;

  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-2">Kontaktanfragen</h2>
     

      <ContactRequestsEditor
        contactRequests={contactRequests}
        deleteContactRequestById={deleteContactRequestById}
        updateContactRequestStatusById={updateContactRequestStatusById}
        setContactRequests={setContactRequests}
        addCommentToContactRequestById={addCommentToContactRequestById}
        filterContactRequestsByEmail={filterContactRequestsByEmail}
        exportContactRequestsToCSV={exportContactRequestsToCSV}
      />

   </section>
  );
}
