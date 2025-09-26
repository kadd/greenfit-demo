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
      {Object.entries(content).map(([key, value]) =>
        typeof value === "object" && value !== null && "label" in value && "content" in value ? (
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
        ) : (
          // Für verschachtelte Objekte wie services oder contact
          Object.entries(value as object).map(([subKey, subValue]) =>
            typeof subValue === "object" && subValue !== null && "label" in subValue && "content" in subValue ? (
              <DashboardField
                key={subKey}
                field={subValue}
                onLabelChange={label =>
                  setContent(prev => ({
                    ...prev,
                    [key]: {
                      ...prev[key],
                      [subKey]: {
                        ...(prev[key] as any)[subKey],
                        label,
                      },
                    },
                  }))
                }
                onContentChange={contentValue =>
                  setContent(prev => ({
                    ...prev,
                    [key]: {
                      ...prev[key],
                      [subKey]: {
                        ...(prev[key] as any)[subKey],
                        content: contentValue,
                      },
                    },
                  }))
                }
              />
            ) : null
          )
        )
      )}
      <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
        Speichern
      </button>
    </form>
  );
}