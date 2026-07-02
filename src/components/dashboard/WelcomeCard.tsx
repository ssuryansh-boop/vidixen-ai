'use client';

import { UserProfile } from '@/types';

interface WelcomeCardProps {
  greeting: string;
  profile: UserProfile | null;
}

export default function WelcomeCard({
  greeting,
  profile,
}: WelcomeCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-[#0B132B]/20 border border-white/5 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-[#00F2FE] to-[#7F00FF]" />

      <h2 className="text-sm font-bold md:text-base text-gray-200 tracking-tight leading-snug">
        {greeting}
      </h2>

      <p className="text-[11px] text-gray-500 font-medium mt-1 font-mono uppercase tracking-wider">
        Sector Deployment Area: {profile?.niche} • Mode: SECURE VAULT AUTH
      </p>
    </div>
);
}