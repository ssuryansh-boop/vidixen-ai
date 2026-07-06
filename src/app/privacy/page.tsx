import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#070B14] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-[#0E1626] border border-[#1E2E4A] rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-8">Last updated: July 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. Information We Collect</h2>
            <p>We keep our data collection minimal to protect you. When you use Vidixen.com, we collect:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
              <li>Your email address and basic profile information during signup.</li>
              <li>The text prompts you submit to generate scripts (used purely to process your request via the Gemini API).</li>
              <li>Basic workspace count metrics to manage your free credit tracking dashboard.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. How Your Data is Handled</h2>
            <p>Your inputs are processed through secure API pipelines. We do not sell, trade, or distribute your content ideas, generated scripts, or personal identity details to any third-party marketing companies.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Payment Security</h2>
            <p>All financial operations are handled completely off-site through secure, PCI-compliant networks (Dodo Payment). Vidixen.ai never sees, captures, or saves your credit card tokens or bank authentication credentials on our own servers.</p>
          </section>
        </div>
      </div>
    </div>
  );
}