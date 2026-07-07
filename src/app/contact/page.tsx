import React from 'react';

export default function ContactUs() {
  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#0E1626] border border-[#1E2E4A] rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Contact Support</h1>
          <p className="text-sm text-slate-400 mt-2">Have a question or a billing dispute? Reach out directly.</p>
        </div>

        <div className="space-y-4">
          <div className="bg-[#131F35] border border-[#223354] rounded-xl p-4 flex items-center gap-4">
            <div className="text-2xl text-[#00F2FE]">✉️</div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Email Address</p>
              <a href="mailto:support@vidixen.ai" className="text-sm text-white font-medium hover:text-[#00F2FE] transition-colors">
                vidixenai@gmail.com
              </a>
            </div>
          </div>

          <div className="bg-[#131F35] border border-[#223354] rounded-xl p-4 flex items-center gap-4">
            <div className="text-2xl text-[#00F2FE]">📍</div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Business Location</p>
              <p className="text-sm text-white font-medium">
                Punjab, India
              </p>
            </div>
          </div>

          <div className="bg-[#131F35] border border-[#223354] rounded-xl p-4">
            <p className="text-xs text-slate-400 leading-relaxed text-center">
              Our team usually replies to general engineering inquiries and subscription token updates within 24 to 48 operational business hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}