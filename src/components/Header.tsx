'use client';

import { Menu, Video, LogOut, ArrowUpRight, Settings } from "lucide-react";
import { UserProfile } from "@/types";

// This interface now maps exactly to your Firestore user collection schema
interface HeaderProps {
  profile: UserProfile | null;
  userDocument: {
    plan: string;             // "free", "creator", "pro"
    planCredits: number;      // e.g., 250
    bonusCredits: number;     // e.g., 0
    usedCredits: number;      // e.g., 248
    resetAt: number;          // Timestamp integer (ms) e.g., 1783613867894
    subscriptionStatus: string; // "active", "inactive", etc.
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
  userDocument,
  setSidebarOpen,
  PRESET_NICHES,
  editingCustomNiche,
  setEditingCustomNiche,
  customNicheValue,
  setCustomNicheValue,
  modifyActiveProfileNiche,
  triggerSessionHardReset,
}: HeaderProps) {
  
  // 1. Clean & Format Plan Type
  const planType = userDocument.plan?.toLowerCase() || "free"; 
  const isFree = planType === "free";
  const planLabel = planType === "free" ? "Free Plan" : planType === "creator" ? "Creator Plan" : "Pro Plan";
  
  // 2. Exact Credit Math from Firestore Fields
  const maxCredits = (userDocument.planCredits || 0) + (userDocument.bonusCredits || 0);
  const remaining = Math.max(maxCredits - (userDocument.usedCredits || 0), 0);

  // 3. Dynamic Progress Bar Math
  const percentage = maxCredits > 0 ? Math.min((remaining / maxCredits) * 100, 100) : 0;

  // 4. Convert resetAt Millisecond Timestamp to human readable date string (e.g. "Aug 3")
  const getRenewalText = () => {
    if (!userDocument.resetAt) return isFree ? "Resets monthly" : "Renews automatically";
    try {
      const date = new Date(userDocument.resetAt);
      const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return isFree ? `Resets ${formattedDate}` : `Renews ${formattedDate}`;
    } catch (e) {
      return "Renews soon";
    }
  };

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

      {/* Premium Credits SaaS Interface */}
      <div className="flex items-center gap-4">
        
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#090D16]/60 border border-white/5 min-w-[210px]">
          <div className="flex items-center justify-between text-xs font-bold text-gray-200">
            <span>{planLabel}</span>
            <span className="text-gray-400 font-medium">
              <strong className="text-white">{remaining}</strong> / {maxCredits} <span className="text-[10px] text-gray-500">Credits</span>
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
              {getRenewalText()}
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

        {/* Terminate Session Button */}
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