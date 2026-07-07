'use client';

import { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { auth, logOut, subscribeToAuthChanges } from "@/lib/auth";
import { syncUserProfileToCloud, archiveScriptToCloud, fetchArchivedScripts,getUser } from '@/lib/database';
import { ChatMessage, SavedScript, TrendingSignal, UserProfile } from '@/types';
import { PRESET_NICHES, GREETING_VARIANTS } from "@/lib/helpers";
import { syncLiveNicheSignals } from "@/lib/trends";

// 🛡️ MEMORY CACHE PIPE (Declaring these outside the hook keeps them alive during page navigation)
let globalCachedTrends: TrendingSignal[] = [];
let globalCachedNiche: string = "";

export function useDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  // ⚡ FIXED INITIALIZATION: Reads local storage immediately so it NEVER blinks back to the default niche on tab close/reopen
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("vidixen_profile");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse initial profile cache:", e);
        }
      }
    }
    return null;
  });

  const [onboardingStep, setOnboardingStep] = useState<'auth' | 'name' | 'niche' | 'complete'>('auth');
  const [inputName, setInputName] = useState('');
  const [inputNiche, setInputNiche] = useState('');
  const [customNicheMode, setCustomNicheMode] = useState(false);
  const [editingCustomNiche, setEditingCustomNiche] = useState(false);
  const [customNicheValue, setCustomNicheValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ideation' | 'vault'>('ideation');
  const [greeting, setGreeting] = useState('');
  const [channelHandle, setChannelHandle] = useState('');
  const [trends, setTrends] = useState<TrendingSignal[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [savedScripts, setSavedScripts] = useState<SavedScript[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [saveStatusIndex, setSaveStatusIndex] = useState<number | null>(null);
  const [country, setCountry] = useState("US");
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [credits, setCredits] = useState({
    remaining: 5,
    plan: "free",
  });
  
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const loadCredits = async () => {
    const token = await auth.currentUser?.getIdToken();

    if (!token) return;

    const response = await fetch("/api/credits", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return;

    const data = await response.json();

    setCredits({
      remaining: data.remaining,
      plan: data.plan,
    });
  };

  useEffect(() => {
    if (profile) {
      const randomPicker = GREETING_VARIANTS[Math.floor(Math.random() * GREETING_VARIANTS.length)];
      setGreeting(randomPicker(profile.displayName));
      
      if (globalCachedTrends.length > 0 && globalCachedNiche === profile.niche) {
        setTrends(globalCachedTrends);
      } else {
        setTrends([
          { id: '1', topic: 'The Secret Algorithm Shift', velocity: 'Critical', hookAngle: 'What they updated at midnight...' },
          { id: '2', topic: 'Automating Faceless Channels', velocity: 'Surging', hookAngle: 'Zero edit workflows revealed.' }
        ]);
      }

      fetchArchivedScripts(profile.uid)
        .then(records => {
          if (records) setSavedScripts(records);
        })
        .catch(console.error);
    }
  }, [profile]);

  useEffect(() => {
    fetch("/api/country")
      .then((res) => res.json())
      .then((data) => setCountry(data.country))
      .catch(() => setCountry("US"));
  }, []);

  // ⚡ FIXED AUTH LISTENER: Preserves persistent niches correctly and prevents default fallback resets
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const localCache = localStorage.getItem("vidixen_profile");
        let parsedProfile: UserProfile | null = null;

        if (localCache) {
          try {
            parsedProfile = JSON.parse(localCache);
          } catch (e) {
            console.error(e);
          }
        }

        const dbUser = await getUser(currentUser.uid);

if (dbUser && dbUser.niche && dbUser.niche.trim() !== "") {
  const loggedProfile: UserProfile = {
    uid: currentUser.uid,
    displayName:
      dbUser.displayName ||
      currentUser.displayName ||
      "Creator",
    niche: dbUser.niche,
  };

  setProfile(loggedProfile);
  setInputName(loggedProfile.displayName);
  setInputNiche(loggedProfile.niche);

  localStorage.setItem(
    "vidixen_profile",
    JSON.stringify(loggedProfile)
  );

  setOnboardingStep("complete");
} else {
  setProfile(null);

  setInputName(currentUser.displayName || "");

  setInputNiche("");

  setOnboardingStep("name");
}

await loadCredits();
      } else {
        setProfile(null);
        localStorage.removeItem("vidixen_profile");
        setOnboardingStep("auth");
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (profile) {
      const randomPicker = GREETING_VARIANTS[Math.floor(Math.random() * GREETING_VARIANTS.length)];
      setGreeting(randomPicker(profile.displayName));

      if (globalCachedTrends.length > 0 && globalCachedNiche === profile.niche) {
        setTrends(globalCachedTrends);
      } else {
        setTrendsLoading(true);
        syncLiveNicheSignals(profile.niche)
          .then((fetchedData) => {
            setTrends(fetchedData);
            globalCachedTrends = fetchedData;
            globalCachedNiche = profile.niche;
          })
          .finally(() => setTrendsLoading(false));
      }
      reloadHistoricalVault();
    }
  }, [profile]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveOnboardingProfile = async () => {
    const chosenNiche = inputNiche.trim() || PRESET_NICHES[0];
    const assembledProfile = {
      uid: user!.uid,
      displayName: user!.displayName || inputName.trim() || "Creator",
      niche: chosenNiche,
    };
    localStorage.setItem("vidixen_profile", JSON.stringify(assembledProfile));
    setProfile(assembledProfile);
    setOnboardingStep('complete');
    await syncUserProfileToCloud(assembledProfile);
    localStorage.setItem(
  "vidixen_profile",
  JSON.stringify(assembledProfile)
);
  };

  const reloadHistoricalVault = async () => {
    if (!profile) return;
    const records = await fetchArchivedScripts(profile.uid);
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setSavedScripts(records);
  };

  const runAutomatedChannelAnalysis = async (e?: React.FormEvent, customHandle?: string) => {
    if (e) e.preventDefault();
    const handleToAnalyze = customHandle || channelHandle;
    if (!handleToAnalyze.trim() || !profile) return;
    setActiveTab('ideation');
    
    const systemPromptText = `Analyze the channel handle @${handleToAnalyze} . Reverse-engineer their retention loops, content style, hook blueprints, and explain their secret engagement strategies. Finally, give me a comprehensive list of actionable video topics inspired by this channel.`;
    const freshUserMessage: ChatMessage = {
      role: 'user',
      text: systemPromptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const nextStack = [...messages, freshUserMessage];
    setMessages(nextStack);
    setChatLoading(true);
    
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          systemMode: 'chat',
          niche: profile.niche,
          channelHandle: handleToAnalyze,
          messageHistory: nextStack,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.code === "NO_CREDITS") {
          window.location.href = "/pricing";
          return;
        }
        throw new Error(data.error || "Generation failed.");
      }
      if (typeof data.remainingCredits === "number") {
        setCredits((prev) => ({
          ...prev,
          remaining: data.remainingCredits,
        }));
      }
      const aiResponse: ChatMessage = {
        role: "model",
        text: data.result,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages([...nextStack, aiResponse]);
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  const triggerTrendSignalIdeation = (topic: string) => {
    setCurrentInput(`Write a high-retention viral script based on this trending signal: "${topic}". Make it a detailed dialogue between Person A and Person B with timestamps and cinematic scene directions.`);
  };

  const executeCustomChatMessageInput = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentInput.trim() || !profile || chatLoading) return;
    const freshMsg: ChatMessage = {
      role: 'user',
      text: currentInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const nextStack = [...messages, freshMsg];
    setMessages(nextStack);
    setCurrentInput('');
    setChatLoading(true);
    
    try {
      const token = await auth.currentUser?.getIdToken();
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          systemMode: 'chat',
          niche: profile.niche,
          channelHandle: channelHandle || 'General Ideation',
          messageHistory: nextStack,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.code === "NO_CREDITS") {
          window.location.href = "/pricing";
          return;
        }
        throw new Error(data.error || "Generation failed.");
      }
      if (typeof data.remainingCredits === "number") {
        setCredits((prev) => ({
          ...prev,
          remaining: data.remainingCredits,
        }));
      }
      setMessages([
        ...nextStack,
        {
          role: "model",
          text: data.result,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setChatLoading(false);
    }
  };

  const commitScriptToCloudVault = async (textToSave: string, index: number, conversation: ChatMessage[]) => {
    if (!profile) return;
    try {
      setSaveStatusIndex(index);
      const targetConversationId = conversationId ?? crypto.randomUUID();
      if (!conversationId) {
        setConversationId(targetConversationId);
      }
      const cleanContent = textToSave.replace(/```json|```/gi, '').trim();
      const generatedTitle = channelHandle.trim() !== ""
        ? `@${channelHandle}`
        : conversation.find(m => m.role === 'user')?.text.substring(0, 30) || `Script Sequence #${index + 1}`;

      await archiveScriptToCloud({
        conversationId: targetConversationId,
        userId: profile.uid,
        title: `${generatedTitle} (${new Date().toLocaleDateString()})`,
        handleContext: channelHandle || "General",
        nicheContext: profile.niche,
        scriptContent: cleanContent,
        messages: conversation.length > 0 ? conversation : messages,
        createdAt: new Date().toISOString(),
      });
      if (typeof reloadHistoricalVault === 'function') {
        await reloadHistoricalVault();
      } else {
        const records = await fetchArchivedScripts(profile.uid);
        if (records) setSavedScripts(records);
      }
      setTimeout(() => setSaveStatusIndex(null), 2500);
    } catch (err) {
      console.error("Cloud synchronization pipe failure:", err);
      alert("Failed to sync script to cloud. Verify connection settings.");
      setSaveStatusIndex(null);
    }
  };

  const modifyActiveProfileNiche = async (newNiche: string) => {
    if (!profile) return;

    const storedCache = localStorage.getItem("vidixen_profile");
    let currentStoredName = profile.displayName;
    
    if (storedCache) {
      try {
        const parsed = JSON.parse(storedCache);
        currentStoredName = parsed.displayName || profile.displayName;
      } catch (e) {
        console.error(e);
      }
    }

    const modifiedProfile = { 
      ...profile, 
      displayName: currentStoredName,
      niche: newNiche 
    };
    
    setProfile(modifiedProfile);
    localStorage.setItem("vidixen_profile", JSON.stringify(modifiedProfile));
    setTrendsLoading(true);

    syncLiveNicheSignals(newNiche)
      .then((updatedData) => {
        setTrends(updatedData);
        globalCachedTrends = updatedData; 
        globalCachedNiche = newNiche;     
      })
      .finally(() => setTrendsLoading(false));

    await syncUserProfileToCloud(modifiedProfile);
  };

  // ⚡ NEW FUNCTION: Processes manually typed input fields and synchronizes directly with Firestore
  const saveCustomNiche = async () => {
    if (!customNicheValue.trim()) return;
    await modifyActiveProfileNiche(customNicheValue.trim());
    setEditingCustomNiche(false);
  };

  const triggerSessionHardReset = () => {
    globalCachedTrends = []; 
    globalCachedNiche = "";
    setConversationId(null);
    localStorage.removeItem("vidixen_profile");
    setProfile(null);
    setMessages([]);
    setChannelHandle('');
    setCurrentInput("");
    setOnboardingStep('auth');
    logOut();
  };

  const triggerDodoCheckout = async (productId: string | undefined, regionCode: 'IN' | 'US') => {
    if (!user || !user.email) {
      alert("Please log in to purchase an upgraded plan.");
      return;
    }
    if (!productId) {
      alert("Configuration error: Selected product identifier is blank.");
      return;
    }

    setCheckoutLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: productId,
          countryCode: regionCode,
          customerEmail: user.email,
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to setup checkout pipeline.");
      }
    } catch (error) {
      console.error("Dodo automated link generation failed:", error);
      alert("Network exception establishing payment interface.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return {
    credits, setCredits, user, authLoading, profile, onboardingStep, setOnboardingStep,
    inputName, setInputName, inputNiche, setInputNiche,
    customNicheMode, setCustomNicheMode, editingCustomNiche, setEditingCustomNiche,
    customNicheValue, setCustomNicheValue, sidebarOpen, setSidebarOpen,
    activeTab, setActiveTab, greeting, channelHandle, setChannelHandle,
    trends, setTrends, trendsLoading, setTrendsLoading, messages, setMessages,
    currentInput, setCurrentInput, chatLoading, savedScripts, setSavedScripts,
    conversationId, setConversationId, copiedIndex, setCopiedIndex,
    saveStatusIndex, setSaveStatusIndex, chatEndRef,
    saveOnboardingProfile, reloadHistoricalVault, runAutomatedChannelAnalysis,
    triggerTrendSignalIdeation, executeCustomChatMessageInput, commitScriptToCloudVault,
    modifyActiveProfileNiche, saveCustomNiche, triggerSessionHardReset, country,
    triggerDodoCheckout, checkoutLoading
  };
}