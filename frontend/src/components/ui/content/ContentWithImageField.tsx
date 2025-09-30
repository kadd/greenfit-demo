import LabelInput from "./LabelInput";
import ContentInput from "./ContentInput";
import ImageInput from "../common/ImageInput";

type Field = {
  label: string;
  content: string;
  image: string;
};

type Props = {
  field: Field;
  folder: string | undefined;
  onLabelChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onImageChange: (value: string) => void;
};

export default function ContentWithImageField({ field, onLabelChange, onContentChange, onImageChange, imageFolder }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6 flex flex-col gap-4 border border-gray-200">
      <div className="flex items-center gap-4">
       
        <div className="flex-1">
          <LabelInput label={field.label} onChange={onLabelChange} />
        </div>
      </div>
      <ContentInput content={field.content} onChange={onContentChange} />
       <ImageInput image={field.image} onChange={onImageChange} folder={imageFolder} />
    </div>
  );
}