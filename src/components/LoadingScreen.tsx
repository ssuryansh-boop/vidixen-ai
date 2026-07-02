"use client";

import { Loader2 } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-[#00F2FE] animate-spin" />
    </div>
  );
}