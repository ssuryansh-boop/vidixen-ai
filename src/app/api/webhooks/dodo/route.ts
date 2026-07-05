import { Webhooks } from "@dodopayments/nextjs";
import { adminDb } from "@/lib/firebase-admin";

export const POST = Webhooks({
  webhookKey: process.env.DODO_WEBHOOK_SECRET!,

  onPayload: async (payload) => {
    console.log("========== DODO EVENT ==========");
    console.log(payload.type);

    // We only care about successful purchases for now
    if (
      payload.type !== "payment.succeeded" &&
      payload.type !== "subscription.active"
    ) {
      return;
    }

    const email = payload.data.customer?.email;

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

    console.log("FOUND USER:");
    console.log(userDoc.id);

    console.log(userDoc.data());
  },
});