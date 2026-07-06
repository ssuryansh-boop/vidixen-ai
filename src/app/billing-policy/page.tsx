import React from 'react';

export default function BillingPolicy() {
  return (
    <div className="min-h-screen bg-[#070B14] text-slate-300 font-sans p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-[#0E1626] border border-[#1E2E4A] rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Billing Policy</h1>
        <p className="text-sm text-slate-400 mb-8">Simple, upfront pricing. Global tax and billing handled securely.</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white mb-2">1. One-Time Token Payments</h2>
            <p>
              Vidixen.com processes strict, one-time credit purchases for our AI script packages. We do not run automatic monthly renewals or charge hidden recurring fees. You are only billed when you intentionally choose to buy a token pack.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">2. What You Will See On Your Bank Statement</h2>
            <p className="bg-[#131F35] border border-[#223354] rounded-xl p-4 text-slate-200">
              📌 <strong>Statement Descriptor Notice:</strong> We partner with <strong>Dodo Payments</strong> as our official Merchant of Record to securely handle international compliance, localized payment types (including credit cards and UPI), and local tax processing. When completing a purchase, the charge on your bank account statement, passbook, or UPI app will appear as <strong>Dodo Payments</strong> or <strong>DODO* Suryansh Singh</strong>. 
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">3. Global Tax Compliance</h2>
            <p>
              Depending on your location, local sales taxes, VAT, or GST may be calculated and added during checkout. These are safely collected and remitted automatically by our Merchant of Record, Dodo Payments, in accordance with global financial frameworks.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white mb-2">4. No-Refund Agreement</h2>
            <p>
              Because our dynamic multi-character script generation triggers expensive real-time LLM infrastructure calls immediately, <strong>all transactions are final and non-refundable.</strong> Every workspace is given free access credits upon registration to test our platform thoroughly prior to making any financial commitments.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}