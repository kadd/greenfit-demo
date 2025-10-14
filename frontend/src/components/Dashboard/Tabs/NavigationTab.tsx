import React, { useState, useEffect } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import { NavigationData, NavigationCategory, NavigationItem } from '@/types/navigation';
import { Icon } from '@/components/ui/common/Icons';
import { IconSelect } from '@/components/ui/common/IconSelect'; 

const renderIcon = (iconName: string) => {
  return <Icon name={iconName as any} size={16} className="mr-2" />;
};

export function NavigationManagementTab() {
    const initialNavigation: NavigationData = {
        categories: [],
        settings: {
            showIcons: true,
            layout: "horizontal",
            mobileBreakpoint: 768,
        }
    };
  const { navigation, loading, error, updateNavigation } = useNavigation();
  const [editForm, setEditForm] = useState<NavigationData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (navigation) {
      setEditForm(navigation);
    }
  }, [navigation]);

  if (loading) return <div>Lädt Navigation...</div>;
  if (error) return <div className="text-red-500">Fehler: {error}</div>;
  if (!navigation || !editForm) return <div>Keine Navigation gefunden</div>;

  const handleSave = async () => {
    try {
      await updateNavigation(editForm);
      setIsEditing(false);
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    }
  };

  const updateCategory = (categoryId: string, updates: Partial<NavigationCategory>) => {
    setEditForm({
      ...editForm,
      categories: editForm.categories.map(cat =>
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    });
  };

  const updateItem = (categoryId: string, itemId: string, updates: Partial<NavigationItem>) => {
    setEditForm({
      ...editForm,
      categories: editForm.categories.map(cat =>
        cat.id === categoryId
          ? {
              ...cat,
              items: {
                ...cat.items,
                [itemId]: { ...cat.items[itemId], ...updates }
              }
            }
          : cat
      )
    });
  };

  const moveItem = (categoryId: string, itemId: string, direction: 'up' | 'down') => {
    const category = editForm.categories.find(cat => cat.id === categoryId);
    if (!category) return;

    const items = Object.entries(category.items);
    const currentIndex = items.findIndex(([id]) => id === itemId);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= items.length) return;

    // Items tauschen
    [items[currentIndex], items[newIndex]] = [items[newIndex], items[currentIndex]];

    updateCategory(categoryId, {
      items: Object.fromEntries(items)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Navigation verwalten</h2>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Speichern
              </button>
              <button
                onClick={() => {
                  setEditForm(navigation);
                  setIsEditing(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Abbrechen
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Bearbeiten
            </button>
          )}
        </div>
      </div>

      {/* Navigation Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Navigation Einstellungen</h3>
        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={editForm.settings?.showIcons}
              onChange={(e) => setEditForm({
                ...editForm,
                settings: { ...editForm.settings, showIcons: e.target.checked }
              })}
              disabled={!isEditing}
              className="mr-2"
            />
            Icons anzeigen
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={editForm.settings?.collapsible}
              onChange={(e) => setEditForm({
                ...editForm,
                settings: { ...editForm.settings, collapsible: e.target.checked }
              })}
              disabled={!isEditing}
              className="mr-2"
            />
            Einklappbar
          </label>
          <div>
            <label className="block text-sm font-medium mb-1">
              Mobile Breakpoint (px)
            </label>
            <input
              type="number"
              value={editForm.settings?.mobileBreakpoint}
              onChange={(e) => setEditForm({
                ...editForm,
                settings: { ...editForm.settings, mobileBreakpoint: parseInt(e.target.value) }
              })}
              disabled={!isEditing}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Layout</label>
            <select
              value={editForm.settings?.layout}
              onChange={(e) => setEditForm({
                ...editForm,
                settings: { ...editForm.settings, layout: e.target.value as 'horizontal' | 'vertical' }
              })}
              disabled={!isEditing}
              className="w-full border rounded px-3 py-2"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertikal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kategorien */}
      {editForm.categories && editForm.categories.map((category) => (
        <div key={category.id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{category.label}</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={category.visible !== false}
                onChange={(e) => updateCategory(category.id, { visible: e.target.checked })}
                disabled={!isEditing}
                className="mr-2"
              />
              Sichtbar
            </label>
          </div>

         {/* Navigation Items */}
          <div className="space-y-3">
            {Object.entries(category.items).map(([itemId, item], index) => (
              <div key={itemId} className="bg-gray-50 p-4 rounded border">
                <div className="flex items-start gap-4">
                  {/* Icon Preview */}
                  <div className="flex-shrink-0 mt-6">
                    {item.icon && (
                      <div className="w-8 h-8 flex items-center justify-center bg-white rounded border">
                        <Icon name={item.icon as any} size={20} />
                      </div>
                    )}
                    {!item.icon && (
                      <div className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded border text-xs">
                        ?
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1">Label</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateItem(category.id, itemId, { label: e.target.value })}
                        disabled={!isEditing}
                        className="w-full text-sm border rounded px-2 py-1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">URL</label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => updateItem(category.id, itemId, { href: e.target.value })}
                        disabled={!isEditing}
                        className="w-full text-sm border rounded px-2 py-1"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium mb-1">Icon</label>
                      <IconSelect
                        value={item.icon || ''}
                        onChange={(iconName) => updateItem(category.id, itemId, { icon: iconName })}
                        disabled={!isEditing}
                        className="w-full"
                      />
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          checked={item.isActive}
                          onChange={(e) => updateItem(category.id, itemId, { isActive: e.target.checked })}
                          disabled={!isEditing}
                          className="mr-1"
                        />
                        Aktiv
                      </label>
                      
                      <label className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          checked={item.external || false}
                          onChange={(e) => updateItem(category.id, itemId, { external: e.target.checked })}
                          disabled={!isEditing}
                          className="mr-1"
                        />
                        Extern
                      </label>
                    </div>
                  </div>

                  {/* Move Buttons */}
                  {isEditing && (
                    <div className="flex-shrink-0 flex flex-col space-y-1">
                      <button
                        onClick={() => moveItem(category.id, itemId, 'up')}
                        disabled={index === 0}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded disabled:bg-gray-300 hover:bg-blue-600"
                        title="Nach oben"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveItem(category.id, itemId, 'down')}
                        disabled={index === Object.keys(category.items).length - 1}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded disabled:bg-gray-300 hover:bg-blue-600"
                        title="Nach unten"
                      >
                        ↓
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}