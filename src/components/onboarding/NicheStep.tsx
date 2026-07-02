'use client';

import { Target } from 'lucide-react';

interface NicheStepProps {
  inputNiche: string;
  setInputNiche: React.Dispatch<React.SetStateAction<string>>;

  customNicheMode: boolean;
  setCustomNicheMode: React.Dispatch<React.SetStateAction<boolean>>;

  PRESET_NICHES: string[];

  saveOnboardingProfile: () => void | Promise<void>;
}

export default function NicheStep({
  inputNiche,
  setInputNiche,
  customNicheMode,
  setCustomNicheMode,
  PRESET_NICHES,
  saveOnboardingProfile,
}: NicheStepProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-[#7F00FF]" />
        <span className="text-xs font-black uppercase tracking-widest text-gray-400">
          Content Engine Targeting
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold mb-1">
          Select your primary niche
        </h2>

        <p className="text-gray-400 text-xs">
          This feeds optimized datasets into your real-time analytics stream.
        </p>
      </div>

      {!customNicheMode ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            {PRESET_NICHES.map((niche) => (
              <button
                key={niche}
                onClick={() => setInputNiche(niche)}
                className={`p-3 text-left rounded-xl border text-xs font-bold transition-all ${
                  inputNiche === niche
                    ? 'bg-[#7F00FF]/20 border-[#7F00FF]/50 text-white shadow-md'
                    : 'bg-[#090D16]/40 border-white/5 text-gray-400 hover:bg-white/5'
                }`}
              >
                {niche}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              setCustomNicheMode(true);
              setInputNiche('');
            }}
            className="text-xs font-semibold text-[#00F2FE] hover:underline block pt-1"
          >
            Not seeing your niche? Type a custom system blueprint
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={inputNiche}
            onChange={(e) => setInputNiche(e.target.value)}
            placeholder="Type your specialized micro-niche sector..."
            className="w-full px-4 py-3 rounded-xl bg-[#090D16] border border-white/5 text-sm text-white focus:outline-none focus:border-[#7F00FF]/50 font-bold"
          />

          <button
            onClick={() => setCustomNicheMode(false)}
            className="text-xs font-semibold text-gray-500 hover:text-white transition-all block"
          >
            Return to preset matrix grid
          </button>
        </div>
      )}

      <button
        onClick={saveOnboardingProfile}
        disabled={!inputNiche.trim()}
        className="w-full mt-4 py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#00F2FE] via-[#4FACFE] to-[#7F00FF] text-white flex items-center justify-center gap-2 text-sm shadow-xl disabled:opacity-40"
      >
        Initialize Main Operational Workspace
      </button>
    </div>
  );
}