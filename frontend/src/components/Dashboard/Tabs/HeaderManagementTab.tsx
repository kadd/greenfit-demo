import React from "react";
import { useHeader, addNavigationItem, removeNavigationItemById, updateNavigationItemById } from "@/hooks/useHeader";
import { HeaderData } from "@/types/header";
import { NavigationItem } from "@/types/navigation";

import { findNavigationItemById } from "@/hooks/useHeader";
import { getEmptyHeaderData, mapHeaderData } from "@/utils/mapHeaderData";

interface HeaderManagementTabProps {
  router: any;
}

export function HeaderManagementTab({ router }: HeaderManagementTabProps) {
  // Fallback-Header mit leerer Navigation
  const defaultHeader: HeaderData = getEmptyHeaderData();

  const { header, updateHeader, resetHeader } = useHeader(defaultHeader);
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState(header);

  // editForm aktualisieren wenn sich header ändert
  React.useEffect(() => {
    setEditForm(header);
  }, [header]);

  const handleSave = async () => {
    try {
      await updateHeader(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
  };

  const handleCancel = () => {
    setEditForm(header);
    setIsEditing(false);
  };

  const addNewNavigationItem = () => {
    const newItem: NavigationItem = {
      id: Date.now().toString(),
      label: "Neuer Link",
      href: "#",
      isActive: false
    };
    const updatedNavigation = addNavigationItem(mapHeaderData(editForm).navigation || [], newItem);
    setEditForm({ ...editForm, navigation: updatedNavigation });
  };

  const removeNavigationItem = (id: string) => {
    const updatedNavigation = removeNavigationItemById(mapHeaderData(editForm).navigation || [], id);
    setEditForm({ ...editForm, navigation: updatedNavigation });
  };

  const updateNavigationItem = (id: string, updates: Partial<NavigationItem>) => {
    const updatedNavigation = updateNavigationItemById(mapHeaderData(editForm).navigation || [], id, updates);
    setEditForm({ ...editForm, navigation: updatedNavigation });
  };

  // Sichere Navigation für das Rendering - entweder aus dem editForm (wenn im Bearbeitungsmodus) oder aus dem gespeicherten Header
  const currentNavigation = isEditing
    ? (mapHeaderData(editForm).navigation || [])
    : (mapHeaderData(header).navigation || []);

  return (
    <div className="header-management">
     <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Header Verwaltung</h2>
        <div className="space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Bearbeiten
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Speichern
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Abbrechen
              </button>
            </>
          )}
          <button
            onClick={resetHeader}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Zurücksetzen
          </button>
        </div>
      </div>

      {/* Header Grunddaten */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Grunddaten</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titel</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="text-gray-700">{header.title}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Untertitel</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.subtitle}
                onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="text-gray-700">{header.subtitle}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">CTA Button</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.cta}
                onChange={(e) => setEditForm({ ...editForm, cta: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="text-gray-700">{header.cta}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hintergrundbild URL</label>
            {isEditing ? (
              <input
                type="text"
                value={editForm.backgroundImage || ""}
                onChange={(e) => setEditForm({ ...editForm, backgroundImage: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            ) : (
              <p className="text-gray-700">{header.backgroundImage || "Nicht gesetzt"}</p>
            )}
          </div>
        </div>
      </div>

            {/* Navigation */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Navigation</h3>
          {isEditing && (
            <button
              onClick={addNewNavigationItem}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              + Navigation hinzufügen
            </button>
          )}
        </div>

        {/* Überschriften für Navigation-Felder - Feste Spaltenbreiten */}
        {currentNavigation.length > 0 && (
          <div className="flex items-center p-3 bg-gray-50 border-b font-medium text-sm text-gray-700">
            <div className="w-48">Label</div>
            <div className="w-48">URL</div>
            <div className="w-20 text-center">Status</div>
            <div className="w-20 text-center">Icon</div>
            <div className="w-20 text-center">Typ</div>
            <div className="w-24 text-center">Aktionen</div>
          </div>
        )}

        <div className="space-y-0">
          {currentNavigation.map((item) => (
            <div key={item.id} className="flex items-center p-3 border-b hover:bg-gray-50">
              {isEditing ? (
                <>
                  <div className="w-48 pr-2">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateNavigationItem(item.id, { label: e.target.value })}
                      className="w-full border rounded px-2 py-1 text-sm"
                      placeholder="Label"
                    />
                  </div>
                  <div className="w-48 pr-2">
                    <input
                      type="text"
                      value={item.href}
                      onChange={(e) => updateNavigationItem(item.id, { href: e.target.value })}
                      className="w-full border rounded px-2 py-1 text-sm"
                      placeholder="URL"
                    />
                  </div>
                  <div className="w-20 flex justify-center">
                    <input
                      type="checkbox"
                      checked={item.isActive || false}
                      onChange={(e) => updateNavigationItem(item.id, { isActive: e.target.checked })}
                      className="rounded"
                    />
                  </div>
                  <div className="w-20 pr-2">
                    <input
                      type="text"
                      value={item.icon || ''}
                      onChange={(e) => updateNavigationItem(item.id, { icon: e.target.value })}
                      className="w-full border rounded px-2 py-1 text-sm text-center"
                      placeholder="🏠"
                    />
                  </div>
                  <div className="w-20 flex justify-center">
                    <input
                      type="checkbox"
                      checked={item.external || false}
                      onChange={(e) => updateNavigationItem(item.id, { external: e.target.checked })}
                      className="rounded"
                    />
                  </div>
                  <div className="w-24 flex justify-center">
                    <button
                      onClick={() => removeNavigationItem(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Löschen
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-48 pr-2">
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  <div className="w-48 pr-2">
                    <span className="text-gray-600 text-sm">{item.href}</span>
                  </div>
                  <div className="w-20 flex justify-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.isActive ? 'Aktiv' : 'Inaktiv'}
                    </span>
                  </div>
                  <div className="w-20 text-center">
                    <span className="text-gray-600 text-sm">{item.icon || '-'}</span>
                  </div>
                  <div className="w-20 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.external ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {item.external ? 'Extern' : 'Intern'}
                    </span>
                  </div>
                  <div className="w-24 flex justify-center">
                    <span className="text-gray-400 text-xs">-</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}