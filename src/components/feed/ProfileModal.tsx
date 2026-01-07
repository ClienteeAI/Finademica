import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AvatarPicker } from './AvatarPicker';
import { FEED_CONFIG, SYSTEM_AVATARS, SystemAvatar } from '@/lib/feedConfig';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/AuthContext';
import { useClient } from '@/lib/clientContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user } = useAuth();
  const { client } = useClient();
  
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<SystemAvatar | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && user) {
      loadProfile();
    }
  }, [open, user]);

  const loadProfile = async () => {
    if (!user) return;
    
    setLoadingProfile(true);
    try {
      // Get public.users.id first
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) {
        setLoadingProfile(false);
        return;
      }

      // Then get profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (profile) {
        setNickname(profile.nickname || '');
        setBio(profile.bio || '');
        setIsPublic(profile.is_public ?? true);
        
        // Find matching system avatar
        const avatar = SYSTEM_AVATARS.find(a => a.id === profile.avatar_url);
        setSelectedAvatar(avatar || null);
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    
    if (nickname.length < FEED_CONFIG.NICKNAME_MIN_LENGTH) {
      setError(`Nickname must be at least ${FEED_CONFIG.NICKNAME_MIN_LENGTH} characters`);
      return;
    }
    
    if (nickname.length > FEED_CONFIG.NICKNAME_MAX_LENGTH) {
      setError(`Nickname must be at most ${FEED_CONFIG.NICKNAME_MAX_LENGTH} characters`);
      return;
    }

    setLoading(true);
    try {
      const { error: rpcError } = await supabase.rpc('set_my_profile', {
        p_nickname: nickname.trim(),
        p_bio: bio.trim() || null,
        p_avatar_type: 'system',
        p_avatar_url: selectedAvatar?.id || null,
        p_avatar_storage_path: null,
        p_is_public: isPublic,
      });

      if (rpcError) {
        setError(rpcError.message);
        return;
      }

      toast({
        title: 'Profile saved',
        description: 'Your profile has been updated successfully.',
      });
      
      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        {loadingProfile ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Avatar Selection */}
            <div className="space-y-3">
              <Label>Choose Avatar</Label>
              <AvatarPicker
                selectedId={selectedAvatar?.id || null}
                onSelect={setSelectedAvatar}
              />
            </div>

            {/* Nickname */}
            <div className="space-y-2">
              <Label htmlFor="nickname">
                Nickname <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Your display name"
                maxLength={FEED_CONFIG.NICKNAME_MAX_LENGTH}
              />
              <p className="text-xs text-muted-foreground">
                {nickname.length}/{FEED_CONFIG.NICKNAME_MAX_LENGTH} characters
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (optional)</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                maxLength={FEED_CONFIG.MAX_BIO_LENGTH}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {bio.length}/{FEED_CONFIG.MAX_BIO_LENGTH} characters
              </p>
            </div>

            {/* Public Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Public Profile</Label>
                <p className="text-xs text-muted-foreground">
                  Allow others in your community to see your profile
                </p>
              </div>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || !nickname.trim()}
                className="flex-1"
              >
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Save
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
