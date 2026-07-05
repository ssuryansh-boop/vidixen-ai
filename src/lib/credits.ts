import { getUser, updateUser } from "./database";

const WEEK = 7 * 24 * 60 * 60 * 1000;
const MONTH = 30 * 24 * 60 * 60 * 1000;

export async function getUserCredits(uid: string) {
  const user = await getUser(uid);

  if (!user) {
    throw new Error("User not found.");
  }

  let changed = false;

  if (Date.now() >= user.resetAt) {
    user.usedCredits = 0;

    if (user.plan === "free") {
      user.planCredits = 5;
      user.resetAt = Date.now() + WEEK;
    }

   if (user.plan === "creator") {
  switch (user.subscriptionPlanId) {
    // India Creator
    case process.env.DODO_INDIA_CREATOR_PRODUCT_ID:
      user.planCredits = 75;
      break;

    // Global Creator
    case process.env.DODO_GLOBAL_CREATOR_PRODUCT_ID:
      user.planCredits = 100;
      break;

    default:
      user.planCredits = 75;
  }

  user.resetAt = Date.now() + MONTH;
}

if (user.plan === "pro") {
  switch (user.subscriptionPlanId) {
    // India Pro
    case process.env.DODO_INDIA_PRO_PRODUCT_ID:
      user.planCredits = 200;
      break;

    // Global Pro
    case process.env.DODO_GLOBAL_PRO_PRODUCT_ID:
      user.planCredits = 350;
      break;

    default:
      user.planCredits = 200;
  }

  user.resetAt = Date.now() + MONTH;
}

    changed = true;
  }

  if (changed) {
    await updateUser(uid, {
      usedCredits: user.usedCredits,
      planCredits: user.planCredits,
      resetAt: user.resetAt,
    });
  }

  return {
    remaining:
      user.planCredits -
      user.usedCredits +
      user.bonusCredits,

    planCredits: user.planCredits,

    usedCredits: user.usedCredits,

    bonusCredits: user.bonusCredits,

    plan: user.plan,
  };
}
export async function canUseCredit(uid: string) {
  const credits = await getUserCredits(uid);

  return {
    allowed: credits.remaining > 0,
    remaining: credits.remaining,
    plan: credits.plan,
  };
}
export async function consumeCredit(uid: string) {
  const user = await getUser(uid);

  if (!user) {
    throw new Error("User not found.");
  }

  if (Date.now() >= user.resetAt) {
    await getUserCredits(uid);

    return consumeCredit(uid);
  }

  if (user.usedCredits < user.planCredits) {
    await updateUser(uid, {
      usedCredits: user.usedCredits + 1,
      totalCreditsUsed: user.totalCreditsUsed + 1,
    });

    return true;
  }

  if (user.bonusCredits > 0) {
    await updateUser(uid, {
      bonusCredits: user.bonusCredits - 1,
      totalCreditsUsed: user.totalCreditsUsed + 1,
    });

    return true;
  }

  return false;
}