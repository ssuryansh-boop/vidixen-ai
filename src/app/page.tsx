'use client';

import { useDashboard } from '@/hooks/useDashboard';
import { PRESET_NICHES } from "@/lib/helpers";
import { Sparkles, Loader2, Send, Copy, Check, FolderHeart, Video } from 'lucide-react';
import Link from 'next/link';

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Onboarding from "@/components/onboarding/Onboarding";
import TrendPanel from "@/components/dashboard/TrendPanel";
import WelcomeCard from "@/components/dashboard/WelcomeCard";
import Vault from "@/components/dashboard/Vault";
import Tabs from "@/components/dashboard/Tabs";
import LoadingScreen from "@/components/LoadingScreen";
import BackgroundEffects from "@/components/BackgroundEffects";

export default function Home() {
  const {
    credits,setCredits,authLoading, profile, onboardingStep, setOnboardingStep,
    inputName, setInputName, inputNiche, setInputNiche,
    customNicheMode, setCustomNicheMode, editingCustomNiche, setEditingCustomNiche,
    customNicheValue, setCustomNicheValue, sidebarOpen, setSidebarOpen,
    activeTab, setActiveTab, greeting, channelHandle, setChannelHandle,
    trends, setTrends, trendsLoading, setTrendsLoading, messages, setMessages,
    currentInput, setCurrentInput, chatLoading, savedScripts, setSavedScripts,
    saveStatusIndex, chatEndRef, saveOnboardingProfile, runAutomatedChannelAnalysis,
    triggerTrendSignalIdeation, executeCustomChatMessageInput, commitScriptToCloudVault,
    modifyActiveProfileNiche, triggerSessionHardReset
  } = useDashboard();

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-white relative font-sans overflow-x-hidden selection:bg-[#7F00FF]/40 flex flex-col">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        savedScripts={savedScripts}
        setMessages={setMessages}
      />
      <BackgroundEffects />
      
      {/* Dynamic Workspace Container */}
      <div className="flex-grow">
        {onboardingStep !== "complete" && !profile ? (
          <Onboarding
            onboardingStep={onboardingStep}
            inputName={inputName}
            setInputName={setInputName}
            inputNiche={inputNiche}
            setInputNiche={setInputNiche}
            customNicheMode={customNicheMode}
            setCustomNicheMode={setCustomNicheMode}
            setOnboardingStep={setOnboardingStep}
            PRESET_NICHES={PRESET_NICHES}
            saveOnboardingProfile={saveOnboardingProfile}
          />
        ) : (
          <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-6 space-y-5">
            <Header
              profile={profile}
              credits={credits}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              PRESET_NICHES={PRESET_NICHES}
              editingCustomNiche={editingCustomNiche}
              setEditingCustomNiche={setEditingCustomNiche}
              customNicheValue={customNicheValue}
              setCustomNicheValue={setCustomNicheValue}
              modifyActiveProfileNiche={modifyActiveProfileNiche}
              triggerSessionHardReset={triggerSessionHardReset}
            />
            <WelcomeCard
              greeting={greeting}
              profile={profile}
            />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 flex flex-col space-y-4">
                <Tabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  savedScripts={savedScripts}
                />
                
                {activeTab === 'ideation' && (
                  <div className="rounded-2xl bg-[#0B132B]/40 backdrop-blur-xl border border-white/5 p-4 flex flex-col h-[520px] shadow-2xl">
                    <form onSubmit={runAutomatedChannelAnalysis} className="flex gap-2 pb-3 border-b border-white/5 mb-3 items-center">
                      <div className="text-[11px] font-black uppercase text-gray-500 tracking-wider shrink-0 hidden sm:block">Target Handle:</div>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-gray-600">@</span>
                        <input type="text" placeholder="e.g. mrbeast" value={channelHandle} onChange={(e) => setChannelHandle(e.target.value.replace('@',''))} className="w-full pl-7 pr-3 py-2 rounded-xl bg-[#090D16] border border-white/5 text-xs text-white focus:outline-none focus:border-[#00F2FE]/50 font-bold" />
                      </div>
                      <button type="submit" disabled={!channelHandle.trim() || chatLoading} className="py-2 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold transition-all text-gray-200 flex items-center gap-1.5 shrink-0 disabled:opacity-40">
                        <Sparkles className="w-3.5 h-3.5 text-[#00F2FE]" /> Analyze Channel Strategy
                      </button>
                    </form>

                    {/* Chat Messages Frame */}
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 custom-scrollbar">
                      {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500">
                          <Sparkles className="w-8 h-8 text-[#00F2FE]/20 mb-2 animate-pulse" />
                          <p className="text-xs font-bold text-gray-400">Vidixen Real-Time Dialogue Deck</p>
                          <p className="text-[11px] text-gray-600 max-w-xs mt-1 leading-normal">Enter a target handle above to trigger automated deep-dives, or chat manually regarding multi-character dynamic configurations.</p>
                        </div>
                      ) : (
                        messages.map((msg, idx) => (
                          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`max-w-[90%] rounded-2xl p-4 text-xs leading-relaxed font-medium relative group ${msg.role === 'user' ? 'bg-[#7F00FF]/15 border border-[#7F00FF]/30 text-gray-200 rounded-tr-none' : 'bg-[#090D16]/80 border border-white/5 text-gray-300 rounded-tl-none whitespace-pre-wrap'}`}>
                              {msg.role === 'model' && (
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-all">
                                  <button onClick={() => navigator.clipboard.writeText(msg.text)} className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-white transition-all" title="Copy Raw Dialogue Data">
                                    <Copy className="w-3 h-3" />
                                  </button>
                                  <button onClick={() => commitScriptToCloudVault(msg.text, idx, messages)} className="p-1.5 rounded bg-white/5 text-gray-400 hover:text-[#00DF89] transition-all" title="Archive Directly to Custom Repository">
                                    {saveStatusIndex === idx ? <Check className="w-3 h-3 text-[#00DF89]" /> : <FolderHeart className="w-3 h-3" />}
                                  </button>
                                </div>
                              )}
                              {msg.text}
                            </div>
                            <span className="text-[9px] text-gray-600 font-medium mt-1 px-1">{msg.timestamp}</span>
                          </div>
                        ))
                      )}
                      {chatLoading && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                          <Loader2 className="w-4 h-4 animate-spin text-[#00F2FE]" /> Designing audio-visual character tracks & narrative timeline...
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Action Bar Input Form */}
                    <form onSubmit={executeCustomChatMessageInput} className="flex gap-2">
                      <input type="text" value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} placeholder="Instruct AI to compile script grids, dialogue interactions, or trend hacks..." className="flex-1 px-4 py-3 rounded-xl bg-[#090D16] border border-white/5 text-xs text-white focus:outline-none focus:border-[#7F00FF]/40 placeholder-gray-600" />
                      <button type="submit" disabled={!currentInput.trim() || chatLoading} className="p-3 rounded-xl bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] text-white hover:opacity-90 transition-all flex items-center justify-center shrink-0 disabled:opacity-40"><Send className="w-4 h-4" /></button>
                    </form>
                  </div>
                )}

                {activeTab === "vault" && (
                  <Vault savedScripts={savedScripts} />
                )}
              </div>

              <TrendPanel
                profile={profile}
                trends={trends}
                trendsLoading={trendsLoading}
                setTrends={setTrends}
                setTrendsLoading={setTrendsLoading}
                triggerTrendSignalIdeation={triggerTrendSignalIdeation}
              />
            </div>
          </div>
        )}
      </div>

      {/* 🛡️ THE COMPLETE TRUST-BUILDING FOOTER GRID */}
      <footer className="py-8 mt-12 border-t border-white/5 text-center relative z-20 bg-[#090D16]">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-gray-500 font-medium">
          <Link href="/privacy" className="hover:text-[#00F2FE] transition-colors tracking-wide">Privacy Policy</Link>
          <span className="text-gray-800 hidden sm:inline">•</span>
          <Link href="/terms" className="hover:text-[#00F2FE] transition-colors tracking-wide">Terms & Conditions</Link>
          <span className="text-gray-800 hidden sm:inline">•</span>
          <Link href="/billing-policy" className="hover:text-[#00F2FE] transition-colors tracking-wide">Billing Policy</Link>
          <span className="text-gray-800 hidden sm:inline">•</span>
          <Link href="/contact" className="hover:text-[#00F2FE] transition-colors tracking-wide">Contact Us</Link>
        </div>
        <p className="mt-4 text-[10px] text-gray-600 tracking-wider">© 2026 Vidixen AI. Built for Premium Creators.</p>
      </footer>

    </div>
  );
}