'use client';

import { Menu, Video, LogOut } from "lucide-react";
import { UserProfile } from "@/types";

interface HeaderProps {
  profile: UserProfile | null;
  credits: {
  remaining: number;
  plan: string;
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
  const planLabel =
  credits.plan === "free"
    ? "FREE"
    : credits.plan === "creator"
    ? "CREATOR"
    : "PRO";
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

      <div className="flex items-center gap-3">

  <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE]/10 to-[#7F00FF]/10 border border-[#00F2FE]/20">
    <div className="text-[10px] uppercase tracking-wider text-gray-500">
      Credits
    </div>

    <div className="flex items-center gap-2">
      <span className="text-white font-black text-sm">
        {credits.remaining}
      </span>

      <span className="text-[10px] text-[#00F2FE] uppercase">
       {planLabel}
      </span>
    </div>
  </div>

  <button
    onClick={triggerSessionHardReset}
    className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
    title="Terminate Session Interface"
  >
    <LogOut className="w-4 h-4" />
  </button>

</div>
    </header>
  );
}