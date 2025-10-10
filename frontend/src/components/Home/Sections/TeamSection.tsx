import React from "react";
import { getPhotoUrl } from "@/utils/uploads";
import { useTeams } from "@/hooks/useTeams";

export default function TeamSection() {
  const token = process.env.NEXT_PUBLIC_API_TOKEN || "";
  const uploadFolder = "team";
  const { teams, loading } = useTeams(token);

  if (loading) return <p className="text-center">Lade Team-Mitglieder...</p>;
  if (!teams || teams.length === 0) return null;

  // Filtere nur Teams, die mindestens ein Mitglied haben
  const teamsWithMembers = teams.filter(team => team.members && team.members.length > 0);
  
  // Wenn keine Teams mit Mitgliedern vorhanden sind, zeige nichts an
  if (teamsWithMembers.length === 0) return null;

  return (
    <section id="team" className="py-16 bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        {teamsWithMembers.map(team => (
          <div key={team.id} className="mb-16">
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-extrabold text-green-800 mb-2">{team.label}</h3>
              <p className="text-gray-600 text-lg">{team.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {team.members.map((member, idx) => (
                <div
                  key={member.id || idx}
                  className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center transition hover:scale-105 hover:shadow-2xl"
                >
                  <div className="w-28 h-28 mb-4 rounded-full overflow-hidden border-4 border-green-200 shadow">
                    {member.photoSrc ? (
                      <img
                        src={member.photoSrc}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-green-900 mb-1">{member.name}</h4>
                  <p className="text-green-700 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-700 text-center text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}