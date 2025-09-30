import ServiceEditor from "@/components/ui/services/ServiceEditor";

export default function ServicesTab() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dienstleistungen bearbeiten</h2>
      <ServiceEditor />
    </div>
  );
}