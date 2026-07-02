// Helper utility inside your frontend generation handler
export function checkFreeTrialStatus(userFreeScriptCount: number): { allowed: boolean; reason: string } {
  const FREE_LIMIT = 3;
  
  if (userFreeScriptCount >= FREE_LIMIT) {
    return {
      allowed: false,
      reason: "TRIAL_EXPIRED"
    };
  }
  
  return {
    allowed: true,
    reason: "PROCEED"
  };
}