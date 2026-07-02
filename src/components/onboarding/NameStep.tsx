'use client';

import { ChevronRight, User as UserIcon } from 'lucide-react';

interface NameStepProps {
  inputName: string;
  setInputName: React.Dispatch<React.SetStateAction<string>>;
  setOnboardingStep: React.Dispatch<
    React.SetStateAction<'auth' | 'name' | 'niche' | 'complete'>
  >;
}

export default function NameStep({
  inputName,
  setInputName,
  setOnboardingStep,
}: NameStepProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <UserIcon className="w-5 h-5 text-[#00F2FE]" />
        <span className="text-xs font-black uppercase tracking-widest text-gray-400">
          Identity Configuration
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-extrabold mb-1">
          What should we call you?
        </h2>

        <p className="text-gray-400 text-xs">
          This configures your dynamic workspace greeting layouts.
        </p>
      </div>

      <input
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        placeholder="Enter your creator pseudonym..."
        className="w-full px-4 py-3 rounded-xl bg-[#090D16] border border-white/5 text-sm text-white focus:outline-none focus:border-[#00F2FE]/50 font-bold"
      />

      <button
        onClick={() => setOnboardingStep('niche')}
        className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] text-white flex items-center justify-center gap-2 text-sm shadow-md"
      >
        Proceed to Strategy Filter
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}