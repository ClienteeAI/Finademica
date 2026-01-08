import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/lib/AuthContext';

// Tip definition type
export interface CoachTipData {
  id: string;
  title: string;
  text: string;
  cta?: { label: string; action: string };
}

// Tip definitions
export const COACH_TIPS: Record<string, CoachTipData> = {
  TIP_FEED_WELCOME: {
    id: 'TIP_FEED_WELCOME',
    title: 'Welcome to the Community',
    text: 'Post what you learned today. Small wins = more unlocks.',
    cta: { label: 'Create a post', action: 'focus-composer' },
  },
  TIP_FEED_POST: {
    id: 'TIP_FEED_POST',
    title: 'Your first post is the key',
    text: 'Write 1–2 lines. Keep it real. Progress beats perfection.',
  },
  TIP_FEED_LIKE: {
    id: 'TIP_FEED_LIKE',
    title: 'Use Likes like a scoreboard',
    text: "Like useful posts. You'll unlock faster and train your eye.",
  },
  TIP_POST_GUIDE: {
    id: 'TIP_POST_GUIDE',
    title: 'Best posts win',
    text: "Share: what you learned, what you tested, what you'll do next.",
  },
  TIP_COMMENTS: {
    id: 'TIP_COMMENTS',
    title: 'Comments = accountability',
    text: "Ask questions. Answer others. That's how you level up.",
  },
  TIP_PROFILE_AVATAR: {
    id: 'TIP_PROFILE_AVATAR',
    title: 'Add an avatar',
    text: 'People trust faces. Even an AI avatar works.',
  },
  TIP_PROFILE_NICKNAME: {
    id: 'TIP_PROFILE_NICKNAME',
    title: 'Pick a nickname',
    text: "Make it recognizable. You'll be seen more.",
  },
  TIP_PROGRESS: {
    id: 'TIP_PROGRESS',
    title: 'Unlock system',
    text: 'Posts + likes + comments = points. Points = more content.',
  },
};

export type TipId = string;

interface CoachTipsState {
  seenTips: TipId[];
  tipsEnabled: boolean;
}

const STORAGE_KEY_PREFIX = 'coach_tips_';
const GLOBAL_TOGGLE_KEY = 'coach_tips_enabled';

function getStorageKey(authUserId: string): string {
  return `${STORAGE_KEY_PREFIX}${authUserId}`;
}

function getToggleKey(authUserId: string): string {
  return `${GLOBAL_TOGGLE_KEY}_${authUserId}`;
}

export function useCoachTips() {
  const { user } = useAuth();
  const [state, setState] = useState<CoachTipsState>({ seenTips: [], tipsEnabled: true });
  const [activeTip, setActiveTip] = useState<TipId | null>(null);

  // Load state from localStorage
  useEffect(() => {
    if (!user?.id) return;

    const storageKey = getStorageKey(user.id);
    const toggleKey = getToggleKey(user.id);

    try {
      const stored = localStorage.getItem(storageKey);
      const seenTips: TipId[] = stored ? JSON.parse(stored) : [];
      
      const toggleStored = localStorage.getItem(toggleKey);
      const tipsEnabled = toggleStored !== null ? JSON.parse(toggleStored) : true;

      setState({ seenTips, tipsEnabled });
    } catch {
      setState({ seenTips: [], tipsEnabled: true });
    }
  }, [user?.id]);

  // Save seen tips to localStorage
  const saveSeenTips = useCallback((seenTips: TipId[]) => {
    if (!user?.id) return;
    localStorage.setItem(getStorageKey(user.id), JSON.stringify(seenTips));
  }, [user?.id]);

  // Save toggle state
  const saveTipsEnabled = useCallback((enabled: boolean) => {
    if (!user?.id) return;
    localStorage.setItem(getToggleKey(user.id), JSON.stringify(enabled));
  }, [user?.id]);

  // Check if tip has been seen
  const hasSeen = useCallback((tipId: TipId): boolean => {
    return state.seenTips.includes(tipId);
  }, [state.seenTips]);

  // Show a tip (only if not seen and tips are enabled)
  const showTip = useCallback((tipId: TipId): boolean => {
    if (!state.tipsEnabled) return false;
    if (hasSeen(tipId)) return false;
    if (activeTip !== null) return false; // Only one floating tip at a time

    setActiveTip(tipId);
    return true;
  }, [state.tipsEnabled, hasSeen, activeTip]);

  // Dismiss a tip (mark as seen)
  const dismissTip = useCallback((tipId: TipId) => {
    if (hasSeen(tipId)) return;

    const newSeenTips = [...state.seenTips, tipId];
    setState(prev => ({ ...prev, seenTips: newSeenTips }));
    saveSeenTips(newSeenTips);

    if (activeTip === tipId) {
      setActiveTip(null);
    }
  }, [hasSeen, state.seenTips, saveSeenTips, activeTip]);

  // Toggle tips on/off
  const setTipsEnabled = useCallback((enabled: boolean) => {
    setState(prev => ({ ...prev, tipsEnabled: enabled }));
    saveTipsEnabled(enabled);
    if (!enabled) {
      setActiveTip(null);
    }
  }, [saveTipsEnabled]);

  // Reset all tips (dev only)
  const resetTips = useCallback(() => {
    if (!user?.id) return;
    setState({ seenTips: [], tipsEnabled: true });
    localStorage.removeItem(getStorageKey(user.id));
    localStorage.setItem(getToggleKey(user.id), JSON.stringify(true));
    setActiveTip(null);
  }, [user?.id]);

  // Clear active tip without marking as seen
  const clearActiveTip = useCallback(() => {
    setActiveTip(null);
  }, []);

  return {
    // State
    tipsEnabled: state.tipsEnabled,
    activeTip,
    
    // Actions
    showTip,
    dismissTip,
    hasSeen,
    setTipsEnabled,
    resetTips,
    clearActiveTip,
    
    // Helpers
    getTipData: (tipId: TipId) => COACH_TIPS[tipId],
  };
}
