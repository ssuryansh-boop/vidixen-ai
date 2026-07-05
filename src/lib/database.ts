import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { UserProfile, SavedScript } from "@/types";

export type UserPlan = "free" | "creator" | "pro";

export interface UserAccount {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;

  niche?: string;

  plan: UserPlan;
  subscriptionStatus: "active" | "inactive";

  planCredits: number;
  usedCredits: number;
  bonusCredits: number;
  totalCreditsUsed: number;

  resetAt: number;
  subscriptionEnd: number | null;
dodoCustomerId?: string;
  dodoSubscriptionId?: string;
  subscriptionPlanId?: string;
  createdAt: any;
  updatedAt: any;
}

/* =======================================================
   USER ACCOUNT
======================================================= */

export async function createUserIfNeeded(user: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}) {
  const ref = doc(db, "users", user.uid);

  const snap = await getDoc(ref);

  if (snap.exists()) {
    return;
  }

  const nextWeek = Date.now() + 7 * 24 * 60 * 60 * 1000;

  await setDoc(ref, {
    uid: user.uid,

    displayName: user.displayName ?? "",

    email: user.email ?? "",

    photoURL: user.photoURL ?? "",

    niche: "",

    plan: "free",

    subscriptionStatus: "inactive",

    planCredits: 5,

    usedCredits: 0,

    bonusCredits: 0,

    totalCreditsUsed: 0,

    resetAt: nextWeek,

    subscriptionEnd: null,
    dodoCustomerId: "",
dodoSubscriptionId: "",
subscriptionPlanId: "",

    createdAt: serverTimestamp(),

    updatedAt: serverTimestamp(),
  });
}

export async function getUser(uid: string) {
  const ref = doc(db, "users", uid);

  const snap = await getDoc(ref);

  if (!snap.exists()) return null;

  return snap.data() as UserAccount;
}

export async function updateUser(uid: string, data: Partial<UserAccount>) {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/* =======================================================
   PROFILE
======================================================= */

export const syncUserProfileToCloud = async (profile: UserProfile) => {
  try {
    await updateUser(profile.uid, {
      niche: profile.niche,
    });
  } catch (e) {
    console.error(e);
  }
};

/* =======================================================
   SCRIPTS
======================================================= */

export const archiveScriptToCloud = async (script: SavedScript) => {
  try {
    const ref = await addDoc(collection(db, "saved_scripts"), {
      ...script,
      createdAt: serverTimestamp(),
    });

    return ref.id;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export const fetchArchivedScripts = async (
  userId: string
): Promise<SavedScript[]> => {
  try {
    const q = query(
      collection(db, "saved_scripts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SavedScript[];
  } catch (e) {
    console.error(e);
    return [];
  }
};