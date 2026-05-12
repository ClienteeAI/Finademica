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
import { CoachTip } from '@/components/CoachTip';
import { FEED_CONFIG, SYSTEM_AVATARS, SystemAvatar } from '@/lib/feedConfig';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/AuthContext';
import { useClient } from '@/lib/clientContext';
import { useGamification } from '@/hooks/useGamification';
import { useCoachTips } from '@/hooks/useCoachTips';
import { useClientAdmin } from '@/hooks/useClientAdmin';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { RoadmapDialog } from '@/components/RoadmapDialog';
import { AdminTools } from '@/components/profile/AdminTools';
import { AnimatePresence } from 'framer-motion';
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
  Lightbulb,
  Shield,
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
  const { hasSeen, dismissTip, tipsEnabled, setTipsEnabled } = useCoachTips();
  const { isAdmin, loading: adminLoading, userRow } = useClientAdmin();

  const isPremiumTheme = client?.subdomain === 'finademica';

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
  const [roadmapOpen, setRoadmapOpen] = useState(false);

  // Coach tips state
  const [showAvatarTip, setShowAvatarTip] = useState(false);
  const [showNicknameTip, setShowNicknameTip] = useState(false);
  const [showProgressTip, setShowProgressTip] = useState(false);

  useEffect(() => {
    if (open && user) {
      loadProfile();
    }
  }, [open, user]);

  // Check tips after profile loads
  useEffect(() => {
    if (!loadingProfile && tipsEnabled) {
      // Avatar tip: show if no avatar
      if (!hasSeen('TIP_PROFILE_AVATAR') && !customAvatarUrl && !selectedAvatar) {
        setShowAvatarTip(true);
      }
      // Nickname tip: show if empty
      if (!hasSeen('TIP_PROFILE_NICKNAME') && !nickname.trim()) {
        setShowNicknameTip(true);
      }
      // Progress tip: show once in roadmap tab
      if (!hasSeen('TIP_PROGRESS')) {
        setShowProgressTip(true);
      }
    }
  }, [loadingProfile, tipsEnabled, hasSeen, customAvatarUrl, selectedAvatar, nickname]);

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
      <SheetContent side="right" className={cn(
        "w-full sm:max-w-md overflow-y-auto",
        isPremiumTheme ? "bg-premium-panel border-premium-gold/20 text-premium-text" : ""
      )}>
        <SheetHeader>
          <SheetTitle className={cn(isPremiumTheme ? "text-premium-gold font-serif" : "")}>Your Profile</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="profile" className="mt-6">
          <TabsList className={cn(
            "grid w-full", 
            isAdmin ? "grid-cols-5" : "grid-cols-4",
            isPremiumTheme ? "bg-premium-bg/50 border border-premium-gold/10" : ""
          )}>
            <TabsTrigger value="profile" className={cn("text-xs", isPremiumTheme ? "data-[state=active]:bg-premium-gold data-[state=active]:text-premium-bg" : "")}>
              <User className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="progress" className={cn("text-xs", isPremiumTheme ? "data-[state=active]:bg-premium-gold data-[state=active]:text-premium-bg" : "")}>
              <TrendingUp className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="roadmap" className={cn("text-xs", isPremiumTheme ? "data-[state=active]:bg-premium-gold data-[state=active]:text-premium-bg" : "")}>
              <Map className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="settings" className={cn("text-xs", isPremiumTheme ? "data-[state=active]:bg-premium-gold data-[state=active]:text-premium-bg" : "")}>
              <Settings className="h-4 w-4" />
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className={cn("text-xs", isPremiumTheme ? "data-[state=active]:bg-premium-gold data-[state=active]:text-premium-bg" : "")}>
                <Shield className="h-4 w-4" />
              </TabsTrigger>
            )}
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-4">
            {loadingProfile ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className={cn("h-6 w-6 animate-spin", isPremiumTheme ? "text-premium-gold" : "text-primary")} />
              </div>
            ) : (
              <>
                {/* Avatar Section */}
                <div className="space-y-4">
                  <Label className={cn(isPremiumTheme ? "text-premium-text-muted" : "")}>Avatar</Label>
                  
                  {/* Current Avatar Preview */}
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-16 h-16 rounded-full flex items-center justify-center text-2xl overflow-hidden',
                      avatarType === 'system' && selectedAvatar?.bg,
                      !selectedAvatar && !customAvatarUrl && (isPremiumTheme ? 'bg-premium-bg' : 'bg-muted')
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
                        <Button variant="outline" size="sm" asChild disabled={uploadingAvatar} className={isPremiumTheme ? "border-premium-gold/20 text-premium-text hover:bg-premium-gold/10" : ""}>
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

                <Separator className={isPremiumTheme ? "bg-premium-gold/10" : ""} />

                {/* Nickname */}
                <div className="space-y-2">
                  <Label htmlFor="nickname" className={cn(isPremiumTheme ? "text-premium-text-muted" : "")}>
                    Nickname <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Your display name"
                    maxLength={FEED_CONFIG.NICKNAME_MAX_LENGTH}
                    className={isPremiumTheme ? "bg-premium-bg/50 border-premium-gold/20 focus:border-premium-gold/50" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    {nickname.length}/{FEED_CONFIG.NICKNAME_MAX_LENGTH} characters
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio" className={cn(isPremiumTheme ? "text-premium-text-muted" : "")}>Bio (optional)</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    maxLength={FEED_CONFIG.MAX_BIO_LENGTH}
                    rows={3}
                    className={isPremiumTheme ? "bg-premium-bg/50 border-premium-gold/20 focus:border-premium-gold/50" : ""}
                  />
                  <p className="text-xs text-muted-foreground">
                    {bio.length}/{FEED_CONFIG.MAX_BIO_LENGTH} characters
                  </p>
                </div>

                {/* Public Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className={cn(isPremiumTheme ? "text-premium-text" : "")}>Public Profile</Label>
                    <p className={cn("text-xs text-muted-foreground", isPremiumTheme ? "text-premium-text-muted" : "")}>
                      Allow others to see your profile
                    </p>
                  </div>
                  <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button onClick={handleSave} disabled={loading || !nickname.trim()} className={cn("w-full", isPremiumTheme ? "bg-premium-gold text-premium-bg hover:opacity-90 premium-gold-glow" : "")}>
                  {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Save Profile
                </Button>
              </>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-4 mt-4">
            {/* Level Card */}
            <Card className={cn("p-4", isPremiumTheme ? "bg-premium-bg/50 border-premium-gold/20" : "")}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center",
                  isPremiumTheme 
                    ? "bg-premium-gold/10 border border-premium-gold/30" 
                    : "bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/50"
                )}>
                  <Target className={cn("w-7 h-7", isPremiumTheme ? "text-premium-gold" : "text-primary")} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Level</p>
                  <p className={cn("text-2xl font-bold", isPremiumTheme ? "text-premium-gold" : "")}>Level {level}</p>
                  <p className={cn("text-sm", isPremiumTheme ? "text-premium-text-muted" : "text-primary")}>{levelName}</p>
                </div>
              </div>
            </Card>

            {/* XP Card */}
            <Card className={cn("p-4 space-y-3", isPremiumTheme ? "bg-premium-bg/50 border-premium-gold/20" : "")}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center",
                  isPremiumTheme
                    ? "bg-premium-gold/10 border border-premium-gold/30"
                    : "bg-gradient-to-br from-amber-500/30 to-orange-500/10 border border-amber-500/50"
                )}>
                  <Zap className={cn("w-7 h-7", isPremiumTheme ? "text-premium-gold" : "text-amber-500")} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">XP</p>
                  <p className={cn("text-2xl font-bold", isPremiumTheme ? "text-premium-gold" : "")}>{xp.toLocaleString()}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Progress to Level {level + 1}</span>
                  <span>{Math.round(progressPercent)}%</span>
                </div>
                <div className={cn("h-2 rounded-full overflow-hidden", isPremiumTheme ? "bg-premium-gold/10" : "bg-muted")}>
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      isPremiumTheme ? "bg-premium-gold" : "bg-gradient-to-r from-primary to-primary/70"
                    )}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <Card className={cn("p-4 text-center", isPremiumTheme ? "bg-premium-bg/50 border-premium-gold/20" : "")}>
                <Flame className="h-6 w-6 mx-auto text-orange-500 mb-2" />
                <p className={cn("text-2xl font-bold", isPremiumTheme ? "text-premium-gold" : "")}>{streakDays}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </Card>
              <Card className={cn("p-4 text-center", isPremiumTheme ? "bg-premium-bg/50 border-premium-gold/20" : "")}>
                <Trophy className={cn("h-6 w-6 mx-auto mb-2", isPremiumTheme ? "text-premium-gold" : "text-yellow-500")} />
                <p className={cn("text-2xl font-bold", isPremiumTheme ? "text-premium-gold" : "")}>{videosCompleted}</p>
                <p className="text-xs text-muted-foreground">Videos</p>
              </Card>
            </div>

            <Button 
              variant="outline" 
              className={cn("w-full", isPremiumTheme ? "border-premium-gold/20 text-premium-text hover:bg-premium-gold/10" : "")} 
              onClick={() => { navigate('/progress'); onOpenChange(false); }}
            >
              View Full Progress
            </Button>
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap" className="space-y-4 mt-4">
            <Card className={cn("p-4", isPremiumTheme ? "bg-premium-bg/50 border-premium-gold/20" : "")}>
              <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center",
                  isPremiumTheme 
                    ? "bg-premium-gold/10 border border-premium-gold/30" 
                    : "bg-gradient-to-br from-blue-500/30 to-purple-500/10 border border-blue-500/50"
                )}>
                  <Map className={cn("w-7 h-7", isPremiumTheme ? "text-premium-gold" : "text-blue-500")} />
                </div>
                <div>
                  <p className={cn("font-semibold", isPremiumTheme ? "text-premium-text" : "")}>Your Trading Journey</p>
                  <p className="text-sm text-muted-foreground">Track your learning path</p>
                </div>
              </div>
              <Button className={cn("w-full", isPremiumTheme ? "bg-premium-gold text-premium-bg hover:opacity-90" : "")} onClick={() => setRoadmapOpen(true)}>
                View Roadmap
              </Button>
            </Card>

            <Card className={cn("p-4", isPremiumTheme ? "bg-premium-bg/50 border-premium-gold/20" : "")}>
              <p className="text-sm text-muted-foreground mb-3">Quick Stats</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className={cn(isPremiumTheme ? "text-premium-text-muted" : "")}>Videos Completed</span>
                  <span className={cn("font-semibold", isPremiumTheme ? "text-premium-gold" : "")}>{videosCompleted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={cn(isPremiumTheme ? "text-premium-text-muted" : "")}>Current Level</span>
                  <span className={cn("font-semibold", isPremiumTheme ? "text-premium-gold" : "")}>{level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={cn(isPremiumTheme ? "text-premium-text-muted" : "")}>Total XP</span>
                  <span className={cn("font-semibold", isPremiumTheme ? "text-premium-gold" : "")}>{xp.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4 mt-4">
            {/* Coach Tips Toggle */}
            <Card className={cn("p-4", isPremiumTheme ? "bg-premium-bg/50 border-premium-gold/20" : "")}>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Lightbulb className={cn("h-4 w-4", isPremiumTheme ? "text-premium-gold" : "text-primary")} />
                    <Label className={cn(isPremiumTheme ? "text-premium-text" : "")}>Coach Tips</Label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Show helpful tips throughout the app
                  </p>
                </div>
                <Switch checked={tipsEnabled} onCheckedChange={setTipsEnabled} />
              </div>
            </Card>

            <Card className={cn("p-4", isPremiumTheme ? "bg-premium-bg/50 border-premium-gold/20" : "")}>
              <h3 className={cn("font-semibold mb-4", isPremiumTheme ? "text-premium-text" : "")}>Account</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Email</span>
                  <span className={cn("font-medium", isPremiumTheme ? "text-premium-text" : "")}>{user?.email}</span>
                </div>
              </div>
            </Card>

            <Button
              variant="outline"
              className={cn("w-full", isPremiumTheme ? "border-premium-gold/20 text-premium-text hover:bg-premium-gold/10" : "")}
              onClick={() => { navigate('/settings'); onOpenChange(false); }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Open Settings
            </Button>

            <Separator className={isPremiumTheme ? "bg-premium-gold/10" : ""} />

            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </TabsContent>

          {/* Admin Tab - Only visible for client admins */}
          {isAdmin && userRow && (
            <TabsContent value="admin" className="space-y-4 mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className={cn("h-5 w-5", isPremiumTheme ? "text-premium-gold" : "text-primary")} />
                <h3 className={cn("font-semibold", isPremiumTheme ? "text-premium-text" : "")}>Admin Tools</h3>
              </div>
              <AdminTools userId={userRow.id} clientId={userRow.client_id} />
            </TabsContent>
          )}
        </Tabs>

        <RoadmapDialog open={roadmapOpen} onOpenChange={setRoadmapOpen} />
      </SheetContent>
    </Sheet>
  );
}
