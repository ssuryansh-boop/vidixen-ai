"use client";

import { MessageSquare, FolderHeart } from "lucide-react";
import { SavedScript } from "@/types";

interface TabsProps {
  activeTab: "ideation" | "vault";
  setActiveTab: (tab: "ideation" | "vault") => void;
  savedScripts: SavedScript[];
}

export default function Tabs({
  activeTab,
  setActiveTab,
  savedScripts,
}: TabsProps) {
  return (
    <div className="flex border-b border-white/5 gap-4">
      <button
        onClick={() => setActiveTab("ideation")}
        className={`pb-2.5 text-xs font-black tracking-widest uppercase border-b-2 transition-all flex items-center gap-2 ${
          activeTab === "ideation"
            ? "border-[#00F2FE] text-white"
            : "border-transparent text-gray-500 hover:text-white"
        }`}
      >
        <MessageSquare className="w-3.5 h-3.5" />
        AI Ideation Room
      </button>

      <button
        onClick={() => setActiveTab("vault")}
        className={`pb-2.5 text-xs font-black tracking-widest uppercase border-b-2 transition-all flex items-center gap-2 ${
          activeTab === "vault"
            ? "border-[#7F00FF] text-white"
            : "border-transparent text-gray-500 hover:text-white"
        }`}
      >
        <FolderHeart className="w-3.5 h-3.5" />
        Saved Scripts Repository ({savedScripts.length})
      </button>
    </div>
  );
}