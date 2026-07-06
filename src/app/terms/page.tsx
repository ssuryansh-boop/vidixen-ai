import React from 'react';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#070B14] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-[#0E1626] border border-[#1E2E4A] rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Terms of Service</h1>
        <p className="text-sm text-slate-400 mb-8">Last updated: July 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Usage Rights</h2>
            <p>You retain 100% full ownership over any viral scripts, copy formats, and content outlines generated using Vidixen.ai. You are free to produce, monetize, and distribute these assets commercially across any platforms (including YouTube, Instagram, and commercial ads) without owing us royalties.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. Account Restrictions</h2>
            <p>To keep system costs low for everyone, users are strictly forbidden from running automated bot scripts, reverse-engineering our core prompt systems, or circumventing the 5-free-credit database limit using burner emails. Doing so will result in an immediate account ban.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Platform Changes</h2>
            <p>Vidixen.ai relies on upstream machine learning technologies. While we aim for maximum availability, we are not responsible for global network outages, upstream service modifications, or API gateway maintenance windows that briefly limit app availability.</p>
          </section>
        </div>
      </div>
    </div>
  );
}