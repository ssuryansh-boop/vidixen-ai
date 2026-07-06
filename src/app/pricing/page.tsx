'use client';

import { useState } from "react";
import { auth } from "@/lib/auth";
import { useDashboard } from "@/hooks/useDashboard";
export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const { country } = useDashboard();

const isIndia = country === "IN";

  async function startCheckout(
    productId: string | undefined,
    country: "IN" | "US"
  ) {
    if (!auth.currentUser?.email) {
      alert("Please login first.");
      return;
    }

    if (!productId) {
      alert("Product ID missing.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          countryCode: country,
          customerEmail: auth.currentUser.email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert("Checkout failed.");
    } finally {
      setLoading(false);
    }
  }
const creatorPrice = isIndia ? "₹249/month" : "$9.99/month";
const proPrice = isIndia ? "₹599/month" : "$29.99/month";
  return (
    <main className="min-h-screen bg-[#090D16] text-white flex items-center justify-center p-8">

      <div className="w-full max-w-5xl">

        <h1 className="text-5xl font-black text-center mb-3">
          Choose Your Plan
        </h1>

        <p className="text-center text-gray-400 mb-12">
          Unlock more AI credits and premium features.
        </p>

        <div className="grid md:grid-cols-2 gap-8">

          {/* Creator */}

          <div className="rounded-3xl border border-white/10 p-8 bg-[#111827]">

            <h2 className="text-3xl font-bold">
              Creator
            </h2>
<div className="text-4xl font-black mt-4">
  {creatorPrice}
</div>
            <p className="mt-4 text-gray-400">
              Perfect for growing creators.
            </p>

            <ul className="mt-6 space-y-3">
              <li>✓ AI Script Generator</li>
              <li>✓ Trend Analysis</li>
              <li>
                ✓ {isIndia ? "75" : "100"} Credits / Month
              </li>
            </ul>

            <button
              disabled={loading}
              onClick={() =>
                startCheckout(
                  isIndia
                    ? process.env.NEXT_PUBLIC_DODO_INDIA_CREATOR_PRODUCT_ID
                    : process.env.NEXT_PUBLIC_DODO_GLOBAL_CREATOR_PRODUCT_ID,
                  isIndia ? "IN" : "US"
                )
              }
              className="w-full mt-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700"
            >
              Subscribe
            </button>

          </div>

          {/* Pro */}

          <div className="rounded-3xl border border-purple-500 p-8 bg-[#111827]">

            <h2 className="text-3xl font-bold">
              Pro
            </h2>
<div className="text-4xl font-black mt-4">
  {proPrice}
</div>
            <p className="mt-4 text-gray-400">
              Unlimited creative power.
            </p>

            <ul className="mt-6 space-y-3">
              <li>✓ Everything in Creator</li>
              <li>✓ Premium AI</li>
              <li>
                ✓ {isIndia ? "200" : "350"} Credits / Month
              </li>
            </ul>

            <button
              disabled={loading}
              onClick={() =>
                startCheckout(
                  isIndia
                    ? process.env.NEXT_PUBLIC_DODO_INDIA_PRO_PRODUCT_ID
                    : process.env.NEXT_PUBLIC_DODO_GLOBAL_PRO_PRODUCT_ID,
                  isIndia ? "IN" : "US"
                )
              }
              className="w-full mt-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-700"
            >
              Subscribe
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}