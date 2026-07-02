import { TrendingSignal } from "@/types";

export const PRESET_NICHES = [
  "AI Automation",
  "SaaS Tech",
  "Crypto Trading",
  "Luxury Lifestyle",
  "Faceless Wealth",
  "Fitness & Biohacking",
  "Business Strategy",
];

export const GREETING_VARIANTS = [
  (name: string) =>
    `Welcome back, ${name}. Which market segment are we dominating today?`,

  (name: string) =>
    `Greetings, ${name}. The algorithms are moving fast—let's build something viral.`,

  (name: string) =>
    `Systems online, ${name}. Ready to transform high-retention concepts into high-converting assets?`,

  (name: string) =>
    `Data streams are loaded, Creator ${name}. Let's reverse-engineer your competition.`,
];

export const getFallbackSignals = (
  niche: string
): TrendingSignal[] => [
  {
    id: "f1",
    topic: `High retention hooks in ${niche}`,
    velocity: "Surging",
    hookAngle: "The silent shift no one is telling you about.",
  },
  {
    id: "f2",
    topic: `Secret editing strategies for ${niche} channels`,
    velocity: "High",
    hookAngle: "Stop losing viewers in the first 3 seconds.",
  },
  {
    id: "f3",
    topic: `AI tool stack breaking records in ${niche}`,
    velocity: "Critical",
    hookAngle: "I automated this micro-niche workflow completely.",
  },
];