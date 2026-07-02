export interface UserProfile {
  uid: string;
  displayName: string;
  niche: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface SavedScript {
  id?: string;
  userId: string;
  title: string;
  handleContext: string;
  nicheContext: string;
conversationId: string;
  scriptContent: string; // keep for preview

  messages: ChatMessage[];

  createdAt: string;
}
export interface CreditStatus {
  remaining: number;
  plan: "free" | "creator" | "pro";
}
export interface TrendingSignal {
  id: string;
  topic: string;
  velocity: 'Critical' | 'High' | 'Surging';
  hookAngle: string;
}