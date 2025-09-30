import DashboardField from "./DashboardField";
import { ContentData } from "@/types/contentData";

type Props = {
  content: ContentData;
  setContent: React.Dispatch<React.SetStateAction<ContentData>>;
  onSubmit: (e: React.FormEvent) => void;
};

export default function DashboardForm({ content, setContent, onSubmit }: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className="bg-white shadow-md rounded-xl p-6 w-full space-y-4"
    >

      {Object.entries(content).length === 0 && (
        <p className="text-center text-gray-500">Keine Inhalte zum Bearbeiten vorhanden.</p>
      )
      }
     {Object.entries(content).map(([key, value]) => {
        // Prüfe, ob value ein Objekt mit label und content ist
        if (
          typeof value === "object" &&
          value !== null &&
          "label" in value &&
          "content" in value
        ) {
          // Wenn content ein verschachteltes Objekt ist (z.B. services, contact)
          if (typeof value.content === "object" && value.content !== null) {
            return (
              <div key={key} className="mb-6">
                {/* Label des übergeordneten Feldes */}
                <input
                  type="text"
                  value={value.label}
                  onChange={e =>
                    setContent(prev => ({
                      ...prev,
                      [key]: {
                        ...prev[key],
                        label: e.target.value,
                      },
                    }))
                  }
                  className="block font-semibold mb-2 text-gray-700 uppercase w-full border rounded p-2"
                  placeholder="Label"
                />
                {/* Loop durch die Unterfelder */}
                {Object.entries(value.content).map(([subKey, subValue]) =>
                  typeof subValue === "object" &&
                  subValue !== null &&
                  "label" in subValue &&
                  "content" in subValue ? (
                    <DashboardField
                      key={subKey}
                      field={subValue}
                      onLabelChange={label =>
                        setContent(prev => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            content: {
                              ...prev[key].content,
                              [subKey]: {
                                ...prev[key].content[subKey],
                                label,
                              },
                            },
                          },
                        }))
                      }
                      onContentChange={contentValue =>
                        setContent(prev => ({
                          ...prev,
                          [key]: {
                            ...prev[key],
                            content: {
                              ...prev[key].content,
                              [subKey]: {
                                ...prev[key].content[subKey],
                                content: contentValue,
                              },
                            },
                          },
                        }))
                      }
                    />
                  ) : null
                )}
              </div>
            );
          }
          // Normales Feld (kein verschachteltes Objekt)
          return (
            <DashboardField
              key={key}
              field={value}
              onLabelChange={label =>
                setContent(prev => ({
                  ...prev,
                  [key]: {
                    ...prev[key],
                    label,
                  },
                }))
              }
              onContentChange={contentValue =>
                setContent(prev => ({
                  ...prev,
                  [key]: {
                    ...prev[key],
                    content: contentValue,
                  },
                }))
              }
            />
          );
        }
        return null;
      })}
      <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
        Speichern
      </button>
    </form>
  );
}