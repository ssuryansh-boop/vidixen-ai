'use client';

import { LogIn, Video } from 'lucide-react';
import { signInWithGoogle } from '@/lib/auth';

export default function AuthStep() {
  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#7F00FF] to-[#E100FF] flex items-center justify-center shadow-lg animate-pulse">
        <Video className="w-8 h-8 text-white" />
      </div>

      {/* Heading */}
      <div>
        <h1 className="text-3xl font-black tracking-tight mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
          Vidixen{' '}
          <span className="bg-gradient-to-r from-[#00F2FE] to-[#7F00FF] bg-clip-text text-transparent">
            AI
          </span>
        </h1>

        <p className="text-gray-400 text-sm font-medium">
          The Ultra-Premium Multi-Turn Script & Analytics Suite
        </p>
      </div>

      {/* Google Login */}
      <div className="space-y-3 pt-4">
        <button
          onClick={signInWithGoogle}
          className="w-full py-4 px-6 rounded-2xl font-bold bg-gradient-to-r from-[#00F2FE] via-[#4FACFE] to-[#7F00FF] text-white flex items-center justify-center gap-3 shadow-xl hover:opacity-95 transition-all"
        >
          <LogIn className="w-5 h-5" />
          Secure Google Sign In
        </button>
      </div>
    </div>
  );
}