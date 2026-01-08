// Feed feature configuration constants
export const FEED_CONFIG = {
  MAX_POST_LENGTH: 500,
  MAX_BIO_LENGTH: 120,
  NICKNAME_MIN_LENGTH: 3,
  NICKNAME_MAX_LENGTH: 20,
  WEBHOOK_URL: 'https://clientee.app.n8n.cloud/webhook/4d11f151-b1df-45b2-93e5-c96a09db8485',
  POSTS_PER_PAGE: 50,
} as const;

// System avatars for profile selection
export const SYSTEM_AVATARS = [
  { id: 'avatar-1', emoji: '🐻', bg: 'bg-amber-500' },
  { id: 'avatar-2', emoji: '🦊', bg: 'bg-orange-500' },
  { id: 'avatar-3', emoji: '🐼', bg: 'bg-gray-500' },
  { id: 'avatar-4', emoji: '🦁', bg: 'bg-yellow-500' },
  { id: 'avatar-5', emoji: '🐯', bg: 'bg-orange-600' },
  { id: 'avatar-6', emoji: '🐨', bg: 'bg-slate-500' },
  { id: 'avatar-7', emoji: '🦉', bg: 'bg-amber-700' },
  { id: 'avatar-8', emoji: '🦅', bg: 'bg-stone-600' },
  { id: 'avatar-9', emoji: '🐺', bg: 'bg-zinc-600' },
  { id: 'avatar-10', emoji: '🦈', bg: 'bg-blue-600' },
  { id: 'avatar-11', emoji: '🐬', bg: 'bg-cyan-500' },
  { id: 'avatar-12', emoji: '🦋', bg: 'bg-purple-500' },
] as const;

export type SystemAvatar = typeof SYSTEM_AVATARS[number];
