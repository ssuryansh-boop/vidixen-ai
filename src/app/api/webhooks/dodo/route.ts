import { Webhooks } from "@dodopayments/nextjs";
import { adminDb } from "@/lib/firebase-admin";

export const POST = Webhooks({
  webhookKey: process.env.DODO_WEBHOOK_SECRET!,

  onPayload: async (payload) => {
    console.log("========== DODO EVENT ==========");
    console.log(payload.type);

    // Only handle subscription activation
    if (payload.type !== "subscription.active") {
      return;
    }

    // Tell TypeScript this is a Subscription payload
    const data = payload.data as any;

    const email = data.customer?.email;

    if (!email) {
      console.log("No customer email found.");
      return;
    }

    console.log("Searching Firestore for:", email);

    const snapshot = await adminDb
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (snapshot.empty) {
      console.log("No Firebase user found.");
      return;
    }

    const userDoc = snapshot.docs[0];

    const productId = data.product_id;
console.log("Purchased Product ID:", productId);

console.log("Creator IN:", process.env.NEXT_PUBLIC_DODO_CREATOR_IN_ID);
console.log("Pro IN:", process.env.NEXT_PUBLIC_DODO_PRO_CREATOR_IN_ID);
console.log("Creator GL:", process.env.NEXT_PUBLIC_DODO_CREATOR_GL_ID);
console.log("Pro GL:", process.env.NEXT_PUBLIC_DODO_PRO_CREATOR_GL_ID);
    let plan: "free" | "creator" | "pro" = "free";
    let credits = 5;

    // India Creator
    if (productId === process.env.NEXT_PUBLIC_DODO_CREATOR_IN_ID) {
      plan = "creator";
      credits = 75;
    }

    // India Pro
    if (productId === process.env.NEXT_PUBLIC_DODO_PRO_CREATOR_IN_ID) {
      plan = "pro";
      credits = 200;
    }

    // Global Creator
    if (productId === process.env.NEXT_PUBLIC_DODO_CREATOR_GL_ID) {
      plan = "creator";
      credits = 100;
    }

    // Global Pro
    if (productId === process.env.NEXT_PUBLIC_DODO_PRO_CREATOR_GL_ID) {
      plan = "pro";
      credits = 350;
    }
console.log({
  plan,
  credits,
}); 
console.log("productId =", productId);
console.log("plan =", plan);
console.log("credits =", credits);
    await userDoc.ref.update({
      plan,
      subscriptionStatus: "active",
      planCredits: credits,
      usedCredits: 0,
      resetAt: Date.now() + 30 * 24 * 60 * 60 * 1000,

      dodoCustomerId: data.customer.customer_id,
      dodoSubscriptionId: data.subscription_id,
      subscriptionPlanId: productId,
    });
const updated = await userDoc.ref.get();
console.log("Firestore after update:", updated.data());
    console.log("✅ User upgraded successfully");
    console.log("Plan:", plan);
    console.log("Credits:", credits);
  },
});