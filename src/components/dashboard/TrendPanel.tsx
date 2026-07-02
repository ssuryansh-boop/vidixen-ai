'use client';

import { Loader2, Radio, RefreshCw, Flame, ChevronRight } from 'lucide-react';
import { TrendingSignal } from '@/types';
import { syncLiveNicheSignals } from '@/lib/trends';

interface TrendPanelProps {
  profile: {
    niche: string;
  } | null;
  trends: TrendingSignal[];
  trendsLoading: boolean;
  setTrends: React.Dispatch<React.SetStateAction<TrendingSignal[]>>;
  setTrendsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  triggerTrendSignalIdeation: (topic: string) => void;
}

export default function TrendPanel({
  profile,
  trends,
  trendsLoading,
  setTrends,
  setTrendsLoading,
  triggerTrendSignalIdeation,
}: TrendPanelProps) {
  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="p-4 rounded-2xl bg-[#0B132B]/40 backdrop-blur-xl border border-white/5 shadow-2xl h-[565px] flex flex-col">

        <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-3">
          <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-[#00DF89] animate-pulse" />
            Live Trending Signals
          </h3>

          <button
            onClick={() => {
              setTrendsLoading(true);

              syncLiveNicheSignals(profile?.niche || 'Technology')
                .then(setTrends)
                .finally(() => setTrendsLoading(false));
            }}
            disabled={trendsLoading}
            className="p-1.5 rounded bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all disabled:opacity-40"
          >
            <RefreshCw
              className={`w-3 h-3 ${
                trendsLoading ? 'animate-spin' : ''
              }`}
            />
          </button>
        </div>

        {trendsLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 text-xs font-medium">
            <Loader2 className="w-6 h-6 animate-spin text-[#00DF89] mb-2" />
            Scraping active niche signals database...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {trends.map((signal) => (
              <div
                key={signal.id}
                onClick={() =>
                  triggerTrendSignalIdeation(signal.topic)
                }
                className="p-3 rounded-xl bg-[#090D16]/60 border border-white/5 hover:border-[#00DF89]/30 transition-all cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-all text-[9px] font-black uppercase text-[#00DF89] tracking-wider flex items-center gap-0.5">
                  Inject
                  <ChevronRight className="w-2.5 h-2.5" />
                </div>

                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[8px] font-black tracking-wider uppercase ${
                      signal.velocity === 'Critical'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse'
                        : 'bg-[#00DF89]/10 text-[#00DF89] border border-[#00DF89]/20'
                    }`}
                  >
                    {signal.velocity}
                  </span>

                  <Flame className="w-3.5 h-3.5 text-orange-500 fill-current opacity-70" />
                </div>

                <h4 className="text-xs font-bold text-gray-200 group-hover:text-white mb-1 tracking-tight leading-snug">
                  {signal.topic}
                </h4>

                <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                  Angle:{' '}
                  <span className="text-gray-300">
                    "{signal.hookAngle}"
                  </span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}