import React, { useEffect } from "react";

import { Team } from "@/types/team";
import { Member } from "@/types/member";

import {  getPhotoUrl } from "@/utils/uploads";

import { useTeam } from "@/hooks/useTeam";

interface TeamSectionProps {
  team: Team;
}

export default function TeamSection({ team }: TeamSectionProps) {
  const token = process.env.NEXT_PUBLIC_API_TOKEN || "";

  const { members, getMembers, loading } = useTeam(token);

  if (loading) return <p className="text-center">Lade Team-Mitglieder...</p>;
  if (!team || !team.members) return null;

  return (
    <section id="team" className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">{team.label}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, idx) => (
            <div key={idx} className="bg-gray-100 rounded-lg p-6 flex flex-col items-center shadow">
              {member.photoSrc && (
                <img
                  src={getPhotoUrl(member.photoSrc)}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
              )}
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-green-700 font-medium mb-2">{member.role}</p>
              <p className="text-gray-700 text-center">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}