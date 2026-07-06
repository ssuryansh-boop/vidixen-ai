'use client';

import { useState, useEffect } from "react";
import { Menu, Video, LogOut, Settings, X } from "lucide-react";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Sync internal state when modal opens or profile changes
  useEffect(() => {
    if (profile) {
      setEditName(profile.displayName || "");
      const isPreset = PRESET_NICHES.includes(profile.niche || "");
      if (isPreset) {
        setSelectedNiche(profile.niche);
        setIsCustomMode(false);
      } else {
        setSelectedNiche("__other__");
        setCustomNicheValue(profile.niche || "");
        setIsCustomMode(true);
      }
    }
  }, [profile, isModalOpen, PRESET_NICHES, setCustomNicheValue]);

  const planLabel =
    credits.plan === "free"
      ? "FREE"
      : credits.plan === "creator"
      ? "CREATOR"
      : "PRO";

  const handleSaveChanges = async () => {
    if (!profile) return;

    let finalNiche = selectedNiche;
    if (isCustomMode || selectedNiche === "__other__") {
      if (!customNicheValue.trim()) return;
      finalNiche = customNicheValue.trim();
    }

    // Update global state and persist variables
    modifyActiveProfileNiche(finalNiche);
    
    // Merge updated name details back into local profile schema
    const cachedObj = localStorage.getItem("vidixen_profile");
    if (cachedObj) {
      const parsed = JSON.parse(cachedObj);
      parsed.displayName = editName.trim() || parsed.displayName;
      parsed.niche = finalNiche;
      localStorage.setItem("vidixen_profile", JSON.stringify(parsed));
    }

    setIsModalOpen(false);
    // Force soft window refresh to clear out display name visual instances safely
    window.location.reload();
  };

  return (
    <>
      <header className="flex items-center justify-between p-4 rounded-2xl bg-[#0B132B]/30 backdrop-blur-md border border-white/5 shadow-2xl relative z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition"
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

        {/* 🔥 NEW CLEAN NICHE SHOWCASE DESIGN */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-semibold">
          <span className="text-gray-500">Core Focus:</span>
          <span className="text-[#00F2FE] font-black tracking-wide uppercase px-1.5 py-0.5 rounded bg-[#00F2FE]/5 border border-[#00F2FE]/10">
            {profile?.niche || "Not Configured"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => (window.location.href = "/pricing")}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00F2FE]/10 to-[#7F00FF]/10 border border-[#00F2FE]/20 hover:border-[#00F2FE]/50 transition text-left"
          >
            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">
              Credits
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-black text-sm">
                {credits.remaining}
              </span>
              <span className="text-[10px] text-[#00F2FE] uppercase font-bold">
                {planLabel}
              </span>
            </div>
          </button>

          {/* ⚙️ EDIT PROFILE TRIGGER BUTTON */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            title="Edit Profile Settings"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={triggerSessionHardReset}
            className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
            title="Terminate Session Interface"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 🛡️ MODAL OVERLAY PORTAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-[#090D16] border border-white/10 p-6 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-white tracking-tight mb-5 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Edit Workspace Profile
            </h3>

            <div className="space-y-4 text-xs">
              {/* Display Name Input field */}
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wide">
                  Creator Identity Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Enter custom username..."
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:border-[#00F2FE] transition"
                />
              </div>

              {/* Channel Niche Control Options */}
              <div>
                <label className="block text-gray-400 font-bold mb-1.5 uppercase tracking-wide">
                  Target Channel Niche Focus
                </label>
                
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomMode(false)}
                    className={`flex-1 py-1.5 rounded-lg border font-bold transition ${
                      !isCustomMode
                        ? "bg-[#00F2FE]/10 border-[#00F2FE] text-[#00F2FE]"
                        : "bg-white/5 border-white/5 text-gray-400"
                    }`}
                  >
                    Preset List
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomMode(true);
                      setSelectedNiche("__other__");
                    }}
                    className={`flex-1 py-1.5 rounded-lg border font-bold transition ${
                      isCustomMode
                        ? "bg-[#00F2FE]/10 border-[#00F2FE] text-[#00F2FE]"
                        : "bg-white/5 border-white/5 text-gray-400"
                    }`}
                  >
                    Manual Text Entry
                  </button>
                </div>

                {!isCustomMode ? (
                  <select
                    value={selectedNiche}
                    onChange={(e) => setSelectedNiche(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#090D16] border border-white/10 text-white font-medium focus:outline-none focus:border-[#00F2FE] cursor-pointer"
                  >
                    {PRESET_NICHES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Type your tailored custom niche..."
                    value={customNicheValue}
                    onChange={(e) => setCustomNicheValue(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:border-[#00F2FE] transition"
                  />
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 text-xs">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white font-bold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] text-white font-black shadow-lg shadow-purple-500/20 hover:opacity-90 transition animate-pulse-subtle"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}