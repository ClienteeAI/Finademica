import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AvatarPicker } from '@/components/feed/AvatarPicker';
import { FEED_CONFIG, SYSTEM_AVATARS, SystemAvatar } from '@/lib/feedConfig';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/AuthContext';
import { useClient } from '@/lib/clientContext';
import { useGamification } from '@/hooks/useGamification';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {
  Loader2,
  User,
  Settings,
  Map,
  TrendingUp,
  LogOut,
  Upload,
  Flame,
  Zap,
  Trophy,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { client } = useClient();
  const { xp, level, levelName, streakDays, videosCompleted, currentLevelXp, nextLevelXp } = useGamification();

  const isNasrTheme = client?.subdomain === 'nasr';

  // Profile state
  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<SystemAvatar | null>(null);
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);
  const [avatarType, setAvatarType] = useState<'system' | 'custom'>('system');

  useEffect(() => {
    if (open && user) {
      loadProfile();
    }
  }, [open, user]);

  const loadProfile = async () => {
    if (!user) return;

    setLoadingProfile(true);
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!userData) {
        setLoadingProfile(false);
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userData.id)
        .single();

      if (profile) {
        setNickname(profile.nickname || '');
        setBio(profile.bio || '');
        setIsPublic(profile.is_public ?? true);
        setAvatarType((profile.avatar_type as 'system' | 'custom') || 'system');

        if (profile.avatar_type === 'custom' && profile.avatar_url) {
          setCustomAvatarUrl(profile.avatar_url);
          setSelectedAvatar(null);
        } else {
          const avatar = SYSTEM_AVATARS.find((a) => a.id === profile.avatar_url);
          setSelectedAvatar(avatar || null);
          setCustomAvatarUrl(null);
        }
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Error', description: 'Please upload an image file', variant: 'destructive' });
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: 'Error', description: 'Image must be less than 2MB', variant: 'destructive' });
      return;
    }

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setCustomAvatarUrl(publicUrl);
      setAvatarType('custom');
      setSelectedAvatar(null);

      toast({ title: 'Success', description: 'Avatar uploaded successfully' });
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      toast({ title: 'Error', description: err.message || 'Failed to upload avatar', variant: 'destructive' });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSelectSystemAvatar = (avatar: SystemAvatar) => {
    setSelectedAvatar(avatar);
    setAvatarType('system');
    setCustomAvatarUrl(null);
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
      const avatarUrl = avatarType === 'custom' ? customAvatarUrl : selectedAvatar?.id || null;

      const { error: rpcError } = await supabase.rpc('set_my_profile', {
        p_nickname: nickname.trim(),
        p_bio: bio.trim() || null,
        p_avatar_type: avatarType,
        p_avatar_url: avatarUrl,
        p_avatar_storage_path: avatarType === 'custom' ? avatarUrl : null,
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

  const handleLogout = async () => {
    await signOut();
    navigate('/');
    onOpenChange(false);
  };

  const progressPercent = nextLevelXp > currentLevelXp
    ? Math.min(((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100, 100)
    : 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Your Profile</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="text-xs">
              <User className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-xs">
              <TrendingUp className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="roadmap" className="text-xs">
              <Map className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-4">
            {loadingProfile ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Avatar Section */}
                <div className="space-y-4">
                  <Label>Avatar</Label>
                  
                  {/* Current Avatar Preview */}
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center text-2xl overflow-hidden',
                      avatarType === 'system' && selectedAvatar?.bg,
                      !selectedAvatar && !customAvatarUrl && 'bg-muted'
                    )}>
                      {avatarType === 'custom' && customAvatarUrl ? (
                        <img src={customAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : selectedAvatar ? (
                        selectedAvatar.emoji
                      ) : (
                        '👤'
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <Button variant="outline" size="sm" asChild disabled={uploadingAvatar}>
                          <span>
                            {uploadingAvatar ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <Upload className="h-4 w-4 mr-2" />
                            )}
                            Upload Photo
                          </span>
                        </Button>
                      </Label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Max 2MB, JPG or PNG</p>
                    </div>
                  </div>

                  {/* System Avatar Picker */}
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Or choose an avatar:</p>
                    <AvatarPicker
                      selectedId={avatarType === 'system' ? selectedAvatar?.id || null : null}
                      onSelect={handleSelectSystemAvatar}
                    />
                  </div>
                </div>

                <Separator />

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
                      Allow others to see your profile
                    </p>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button onClick={handleSave} disabled={loading || !nickname.trim()} className="w-full">
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Profile
                </Button>
              </>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4 mt-4">
            {/* Level Card */}
            <Card className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/50 flex items-center justify-center">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Level</p>
                  <p className="text-2xl font-bold">Level {level}</p>
                  <p className="text-sm text-primary">{levelName}</p>
                </div>
              </div>
            </Card>

            {/* XP Card */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/10 border border-amber-500/50 flex items-center justify-center">
                  <Zap className="w-7 h-7 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">XP</p>
                  <p className="text-2xl font-bold">{xp.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress to Level {level + 1}</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-4 text-center">
                <Flame className="h-6 w-6 mx-auto text-orange-500 mb-2" />
                <p className="text-2xl font-bold">{streakDays}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </Card>
              <Card className="p-4 text-center">
                <Trophy className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
                <p className="text-2xl font-bold">{videosCompleted}</p>
                <p className="text-xs text-muted-foreground">Videos</p>
              </Card>
            </div>

            <Button variant="outline" className="w-full" onClick={() => { navigate('/progress'); onOpenChange(false); }}>
              View Full Progress
            </Button>
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-4 mt-4">
            <Card className="p-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/10 border border-blue-500/50 flex items-center justify-center">
                  <Map className="w-7 h-7 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold">Your Trading Journey</p>
                  <p className="text-sm text-muted-foreground">Track your learning path</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => { navigate('/roadmap'); onOpenChange(false); }}>
                View Roadmap
              </Button>
            </Card>

            <Card className="p-4">
              <p className="text-sm text-muted-foreground mb-3">Quick Stats</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Videos Completed</span>
                  <span className="font-semibold">{videosCompleted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Current Level</span>
                  <span className="font-semibold">{level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total XP</span>
                  <span className="font-semibold">{xp.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Account</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{user?.email}</span>
                </div>
              </div>
            </Card>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => { navigate('/settings'); onOpenChange(false); }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Open Settings
            </Button>

            <Separator />

            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
