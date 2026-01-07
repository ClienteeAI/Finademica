import { SYSTEM_AVATARS, SystemAvatar } from '@/lib/feedConfig';
import { cn } from '@/lib/utils';

interface AvatarPickerProps {
  selectedId: string | null;
  onSelect: (avatar: SystemAvatar) => void;
}

export function AvatarPicker({ selectedId, onSelect }: AvatarPickerProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {SYSTEM_AVATARS.map((avatar) => (
        <button
          key={avatar.id}
          type="button"
          onClick={() => onSelect(avatar)}
          className={cn(
            'w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all',
            avatar.bg,
            selectedId === avatar.id
              ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110'
              : 'hover:scale-105 opacity-80 hover:opacity-100'
          )}
        >
          {avatar.emoji}
        </button>
      ))}
    </div>
  );
}
