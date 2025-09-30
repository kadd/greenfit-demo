import TeamEditor from "../ui/team/TeamEditor";

export default function TeamTab({ content, setContent, handleSave, msg }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-green-700 mb-4">Team verwalten</h2>
      <form onSubmit={handleSave}>
        <TeamEditor
            onUpload={(newMembers) => setContent(prev => ({
              ...prev,
              team: { ...prev.team, members: newMembers }
            }))} />
        <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold">
          Team speichern
        </button>
      </form>
      {msg && <p className="mt-4">{msg}</p>}
    </section>
  );
}