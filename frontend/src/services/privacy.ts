const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function fetchPrivacy() {
  try {
    const response = await fetch(`${API_URL}/privacy`);
    if (!response.ok) {
      throw new Error("Fehler beim Laden der Datenschutzbestimmungen");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Laden der Datenschutzbestimmungen");
  }
}

export async function createPrivacy(token: string) {
  try {
    const response = await fetch(`${API_URL}/privacy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: "Neue Datenschutzerklärung", isPage: true, sections: [] }),
    });
    if (!response.ok) {
      throw new Error("Fehler beim Erstellen der Datenschutzbestimmungen");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Erstellen der Datenschutzbestimmungen");
  }
}

export async function updatePrivacy(token: string, privacyData: Partial<Privacy>) {
  try {
    const response = await fetch(`${API_URL}/privacy`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(privacyData),
    });
    if (!response.ok) {
      throw new Error("Fehler beim Aktualisieren der Datenschutzbestimmungen");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Aktualisieren der Datenschutzbestimmungen");
  }
}

export async function deletePrivacy(token: string) {
  try {
    const response = await fetch(`${API_URL}/privacy`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Fehler beim Löschen der Datenschutzbestimmungen");
    }
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Löschen der Datenschutzbestimmungen");
  }
}

// create new privacy section
export function createPrivacySection(privacy: Partial<Privacy>, heading = "Neue Überschrift", text = "Neuer Text") {
  const newSection = {
    id: `section-${privacy.sections.length + 1}`,
    heading,
    text,
  };
  return { ...privacy, sections: [...privacy.sections, newSection] };
}

//fetch single privacy section by ID
export async function fetchPrivacySectionById(sectionId: string) {
  try {
    const response = await fetch(`${API_URL}/privacy/sections/${sectionId}`);
    if (!response.ok) {
      throw new Error("Fehler beim Laden des Datenschutzabschnitts");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Laden des Datenschutzabschnitts");
  }
}

//delete single privacy section by ID
export async function deletePrivacySectionById(token: string, sectionId: string) {
  try {
    const response = await fetch(`${API_URL}/privacy/sections/${sectionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Fehler beim Löschen des Datenschutzabschnitts");
    }
    return true;
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Löschen des Datenschutzabschnitts");
  }
}

//update single privacy section by ID
export async function updatePrivacySectionById(token: string, sectionId: string, updatedSection: Partial<PrivacySection>) {
  try {
    const response = await fetch(`${API_URL}/privacy/sections/${sectionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedSection),
    });
    if (!response.ok) {
      throw new Error("Fehler beim Aktualisieren des Datenschutzabschnitts");
    }
    return response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Fehler beim Aktualisieren des Datenschutzabschnitts");
  }
}