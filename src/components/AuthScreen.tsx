import React, { useState } from 'react';
// Import Next.js Link for lightning-fast page loading
import Link from 'next/link';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && !acceptedTerms) {
      alert("Please accept the Terms, Privacy Policy, and Billing Terms to create your account.");
      return;
    }

    // Call your Firebase Auth functions here
    console.log("Submitting Auth:", { email, password, acceptedTerms });
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col items-center justify-center p-6 font-sans relative">
      
      {/* Central Auth Container */}
      <div className="w-full max-w-md bg-[#0E1626] border border-[#1E2E4A] rounded-2xl p-8 shadow-2xl z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Vidixen<span className="text-[#00F2FE]">.ai</span></h1>
          <p className="text-sm text-slate-400 mt-2">
            {isSignUp ? "Create your account for 3 free premium scripts" : "Welcome back, Creator"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#131F35] border border-[#223354] focus:border-[#00F2FE] rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#131F35] border border-[#223354] focus:border-[#00F2FE] rounded-xl px-4 py-3 text-white text-sm outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Legal Accept Checkbox for Sign Up */}
          {isSignUp && (
            <div className="flex items-start gap-3 pt-1">
              <input 
                type="checkbox" 
                id="legal-checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-4 h-4 cursor-pointer rounded border-slate-700 bg-[#131F35] accent-[#00F2FE]"
              />
              <label htmlFor="legal-checkbox" className="text-xs text-slate-400 leading-relaxed cursor-pointer select-none">
                I agree to the{" "}
                <Link href="/terms" className="text-[#00F2FE] hover:underline">Terms of Service</Link>,{" "}
                <Link href="/privacy" className="text-[#00F2FE] hover:underline">Privacy Policy</Link>, and acknowledge the{" "}
                <Link href="/billing-policy" className="text-[#00F2FE] hover:underline">Billing Terms</Link>.
              </label>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#00F2FE] to-[#4FACFE] text-white hover:opacity-90 transition-opacity shadow-lg"
          >
            {isSignUp ? "Get My 3 Free Credits" : "Sign In to Workspace"}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)} 
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account yet? Sign Up"}
          </button>
        </div>

      </div>

      {/* 🛡️ Trust Footer Links at the Very Bottom */}
      <div className="absolute bottom-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-500 px-4 text-center">
        <Link href="/about" className="hover:text-slate-300 transition-colors">About Us</Link>
        <span className="text-slate-700 hidden sm:inline">•</span>
        <Link href="/contact" className="hover:text-slate-300 transition-colors">Contact Us</Link>
        <span className="text-slate-700 hidden sm:inline">•</span>
        <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
        <span className="text-slate-700 hidden sm:inline">•</span>
        <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
        <span className="text-slate-700 hidden sm:inline">•</span>
        <Link href="/billing-policy" className="hover:text-slate-300 transition-colors">Billing Policy</Link>
      </div>

    </div>
  );
}