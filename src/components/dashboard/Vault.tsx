'use client';

import { SavedScript } from '@/types';
import { FolderHeart, Copy } from 'lucide-react';

interface VaultProps {
  savedScripts: SavedScript[];
}

export default function Vault({
  savedScripts,
}: VaultProps) {
  return (
    <div className="rounded-2xl bg-[#0B132B]/40 backdrop-blur-xl border border-white/5 p-5 h-[520px] overflow-y-auto custom-scrollbar space-y-3">
      {savedScripts.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center text-gray-600">
          <FolderHeart className="w-10 h-10 mb-2 opacity-30" />

          <p className="text-xs font-bold">
            Your script repository vault is clean.
          </p>

          <p className="text-[11px] mt-0.5">
            Click the heart archive icon inside any AI chat block response
            to preserve generations here.
          </p>
        </div>
      ) : (
        savedScripts.map((script) => (
          <div
            key={script.id}
            className="p-4 rounded-xl bg-[#090D16]/80 border border-white/5 hover:border-white/10 transition-all relative group"
          >
            <div className="flex justify-between items-start mb-2 border-b border-white/5 pb-2">
              <div>
                <h4 className="text-xs font-black text-[#00F2FE]">
                  {script.title}
                </h4>

                <p className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">
                  Context: @{script.handleContext} • Focus:{" "}
                  {script.nicheContext}
                </p>
              </div>

              <button
                onClick={() =>
                  navigator.clipboard.writeText(script.scriptContent)
                }
                className="p-1.5 rounded bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-[11px] text-gray-400 leading-relaxed font-medium whitespace-pre-wrap max-h-36 overflow-y-auto pr-1 font-mono custom-scrollbar">
              {script.scriptContent}
            </div>
          </div>
        ))
      )}
    </div>
  );
}