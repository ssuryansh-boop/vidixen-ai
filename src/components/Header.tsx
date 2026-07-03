'use client';

import { Menu, Video, LogOut, ArrowUpRight, Settings } from "lucide-react";
import { UserProfile } from "@/types";

interface HeaderProps {
  profile: UserProfile | null;
  credits: {
    remaining: number;
    plan: string;
    // Added reset/renewal string field to fit your SaaS look
    resetDate?: string; 
  };
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;

  PRESET_NICHES: string[];

  editingCustomNiche: boolean;
  setEditingCustomNiche: React.Dispatch<React.SetStateAction<boolean>>;

  customNicheValue: string;
  setCustomNicheValue: React.Dispatch<React.SetStateAction<string>>;

  modifyActiveProfileNiche: (niche: string) => void;
  triggerSessionHardReset: () => void;
}

// Map plans to their respective total credits for progress bar math
const PLAN_MAXIMA: Record<string, number> = {
  free: 5,
  creator: 80,
  pro: 200, // Fallback assumption
};

export default function Header({
  profile,
  credits,
  setSidebarOpen,
  PRESET_NICHES,
  editingCustomNiche,
  setEditingCustomNiche,
  customNicheValue,
  setCustomNicheValue,
  modifyActiveProfileNiche,
  triggerSessionHardReset,
}: HeaderProps) {
  
  const isFree = credits.plan === "free";
  const planLabel = isFree ? "Free Plan" : credits.plan === "creator" ? "Creator Plan" : "Pro Plan";
  const maxCredits = PLAN_MAXIMA[credits.plan] || 5;
  
  // Calculate width percentage safely between 0 and 100
  const percentage = Math.min(Math.max((credits.remaining / maxCredits) * 100, 0), 100);

  return (
    <header className="flex items-center justify-between p-4 rounded-2xl bg-[#0B132B]/30 backdrop-blur-md border border-white/5 shadow-2xl">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7F00FF] to-[#E100FF] flex items-center justify-center">
          <Video className="w-4 h-4" />
        </div>

        <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent">
          VIDIXEN AI
        </span>
      </div>

      <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-medium">
        <span className="text-gray-500">Core Focus:</span>

        <select
          value={
            editingCustomNiche
              ? "__other__"
              : PRESET_NICHES.includes(profile?.niche || "")
              ? profile?.niche
              : "__other__"
          }
          onChange={(e) => {
            if (e.target.value === "__other__") {
              setEditingCustomNiche(true);
              setCustomNicheValue("");
            } else {
              setEditingCustomNiche(false);
              modifyActiveProfileNiche(e.target.value);
            }
          }}
          className="bg-transparent text-[#00F2FE] focus:outline-none font-bold border-none cursor-pointer"
        >
          {PRESET_NICHES.map((n) => (
            <option
              key={n}
              value={n}
              className="bg-[#090D16] text-white"
            >
              {n}
            </option>
          ))}

          <option value="__other__">
            {PRESET_NICHES.includes(profile?.niche || "")
              ? "Other..."
              : profile?.niche}
          </option>
        </select>

        {editingCustomNiche && (
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              placeholder="Enter your niche..."
              value={customNicheValue}
              onChange={(e) => setCustomNicheValue(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[#090D16] border border-white/10 text-xs text-white focus:outline-none focus:border-[#00F2FE] flex-1"
            />

            <button
              onClick={() => {
                if (!customNicheValue.trim()) return;

                modifyActiveProfileNiche(customNicheValue.trim());
                setCustomNicheValue(customNicheValue.trim());
                setEditingCustomNiche(false);
              }}
              className="px-3 py-2 rounded-lg bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] text-xs font-bold"
            >
              Save
            </button>
          </div>
        )}
      </div>

      {/* Premium Credits & Controls Interface */}
      <div className="flex items-center gap-4">
        
        {/* SaaS Dashboard Credit Component */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#090D16]/60 border border-white/5 min-w-[200px]">
          <div className="flex items-center justify-between text-xs font-bold text-gray-200">
            <span>{planLabel}</span>
            <span className="text-gray-400 font-medium">
              <strong className="text-white">{credits.remaining}</strong> / {maxCredits} <span className="text-[10px] text-gray-500">Credits</span>
            </span>
          </div>

          {/* Progress Bar Container */}
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="text-[10px] text-gray-500 font-medium">
              {credits.resetDate || (isFree ? "Resets in 6 days" : "Renews Aug 3")}
            </span>

            {isFree ? (
              <button className="text-[10px] font-bold text-[#00F2FE] hover:text-white transition-colors flex items-center gap-0.5 group">
                Upgrade to Creator
                <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            ) : (
              <button className="text-[10px] font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                <Settings className="w-2.5 h-2.5" />
                Manage Sub
              </button>
            )}
          </div>
        </div>

        {/* Terminate Session Action */}
        <button
          onClick={triggerSessionHardReset}
          className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all self-center"
          title="Terminate Session Interface"
        >
          <LogOut className="w-4 h-4" />
        </button>

      </div>
    </header>
  );
}