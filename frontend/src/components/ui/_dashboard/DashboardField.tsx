import LabelInput from "./LabelInput";
import ContentInput from "./ContentInput";

type Field = {
  label: string;
  content: string;
};

type Props = {
  field: Field;
  onLabelChange: (value: string) => void;
  onContentChange: (value: string) => void;
};

export default function DashboardField({ field, onLabelChange, onContentChange }: Props) {
  return (
    <div className="mb-4">
      <LabelInput label={field.label} onChange={onLabelChange} />
      <ContentInput content={field.content} onChange={onContentChange} />
    </div>
  );
}