"use client";

import { SavedScript, ChatMessage } from "@/types";
import { History, X } from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  savedScripts: SavedScript[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  savedScripts,
  setMessages,
}: SidebarProps) {
  return (
    <div
      className={`fixed top-0 left-0 bottom-0 w-80 bg-[#0B132B]
border-r border-white/5
z-50
transform
transition-transform duration-300
shadow-[5px_0_40px_rgba(0,0,0,0.6)]
flex flex-col
${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400">
          <History className="w-4 h-4 text-[#00F2FE]" />
          Recent History Logs
        </div>

        <button
          onClick={() => setSidebarOpen(false)}
          className="p-1.5 rounded-lg hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {savedScripts.length === 0 ? (
          <p className="text-xs text-gray-500">
            No saved scripts yet.
          </p>
        ) : (
          savedScripts.map((script, index) => (
            <div
              key={index}
              onClick={() => {
                if (script.messages && script.messages.length > 0) {
                  setMessages(script.messages);
                } else {
                  setMessages([
                    {
                      role: "model",
                      text: script.scriptContent,
                      timestamp: "Restored",
                    },
                  ]);
                }

                setSidebarOpen(false);
              }}
              className="p-3 rounded-xl bg-[#090D16]/70 border border-white/5 hover:border-[#7F00FF]/40 cursor-pointer transition-all"
            >
              <div className="text-[11px] font-bold truncate">
                {script.title}
              </div>

              <div className="text-[9px] text-gray-500 mt-1 uppercase">
                @{script.handleContext} • {script.nicheContext}
              </div>

              <div className="text-[9px] text-gray-600 mt-1">
                {new Date(script.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}