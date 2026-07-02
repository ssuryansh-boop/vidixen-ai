'use client';

import AuthStep from "./AuthStep";
import NameStep from "./NameStep";
import NicheStep from "./NicheStep";

interface OnboardingProps {
  onboardingStep: 'auth' | 'name' | 'niche' | 'complete';

  inputName: string;
  setInputName: React.Dispatch<React.SetStateAction<string>>;

  inputNiche: string;
  setInputNiche: React.Dispatch<React.SetStateAction<string>>;

  customNicheMode: boolean;
  setCustomNicheMode: React.Dispatch<React.SetStateAction<boolean>>;

  setOnboardingStep: React.Dispatch<
    React.SetStateAction<'auth' | 'name' | 'niche' | 'complete'>
  >;

  PRESET_NICHES: string[];

  saveOnboardingProfile: () => void | Promise<void>;
}

export default function Onboarding({
  onboardingStep,
  inputName,
  setInputName,
  inputNiche,
  setInputNiche,
  customNicheMode,
  setCustomNicheMode,
  setOnboardingStep,
  PRESET_NICHES,
  saveOnboardingProfile,
}: OnboardingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative z-50">
      <div className="w-full max-w-lg p-8 rounded-3xl bg-[#0B132B]/50 backdrop-blur-2xl border border-white/5 shadow-[0_0_60px_rgba(127,0,255,0.15)] relative overflow-hidden transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00F2FE] to-transparent opacity-60" />

        {onboardingStep === "auth" && <AuthStep />}

        {onboardingStep === "name" && (
          <NameStep
            inputName={inputName}
            setInputName={setInputName}
            setOnboardingStep={setOnboardingStep}
          />
        )}

        {onboardingStep === "niche" && (
          <NicheStep
            inputNiche={inputNiche}
            setInputNiche={setInputNiche}
            customNicheMode={customNicheMode}
            setCustomNicheMode={setCustomNicheMode}
            PRESET_NICHES={PRESET_NICHES}
            saveOnboardingProfile={saveOnboardingProfile}
          />
        )}
      </div>
    </div>
  );
}