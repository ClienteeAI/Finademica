import { useState } from "react";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { useAuth } from "@/lib/AuthContext";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Bell, Shield, Palette, LogOut, Trash2, Scale, ChevronRight, Heart, Trophy, TrendingUp } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const { signOut, user } = useAuth();
  const { client } = useClient();
  const navigate = useNavigate();
  const isNasrTheme = client?.subdomain === 'nasr';
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'confirm' | 'final'>('confirm');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    
    setIsDeleting(true);
    try {
      // Delete user data from users table
      if (user?.id) {
        const { error: deleteError } = await supabase
          .from('users')
          .delete()
          .eq('auth_user_id', user.id);
        
        if (deleteError) {
          console.error('Error deleting user data:', deleteError);
          throw deleteError;
        }
      }
      
      // Sign out and redirect
      await signOut();
      toast.success("Your account has been deleted. We're sorry to see you go.");
      navigate("/");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error("Failed to delete account. Please try again or contact support.");
    } finally {
      setIsDeleting(false);
    }
  };

  const resetDeleteDialog = () => {
    setDeleteStep('confirm');
    setDeleteConfirmText('');
    setDeleteDialogOpen(false);
  };

  return (
    <SidebarLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className={`text-4xl font-bold ${
            isNasrTheme 
              ? 'bg-gradient-to-r from-gold-light to-gold bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-aqua to-aqua-deep bg-clip-text text-transparent'
          }`}>
            Settings
          </h1>
          <p className={isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}>
            Manage your account settings and preferences
          </p>
        </div>

        {/* Notifications */}
        <Card className={`${
          isNasrTheme 
            ? 'bg-nasr-panel/80 border-gold/20 shadow-nasr-card' 
            : 'glass-card border-ice/50'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
              <Bell className={`h-5 w-5 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
              Notifications
            </CardTitle>
            <CardDescription className={isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}>
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isNasrTheme ? 'text-nasr-text' : 'text-ocean'}>
                  Email Notifications
                </Label>
                <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                  Receive email updates about your progress
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                className={isNasrTheme ? 'data-[state=checked]:bg-gold' : 'data-[state=checked]:bg-aqua'}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isNasrTheme ? 'text-nasr-text' : 'text-ocean'}>
                  Push Notifications
                </Label>
                <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                  Get push notifications for new content
                </p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                className={isNasrTheme ? 'data-[state=checked]:bg-gold' : 'data-[state=checked]:bg-aqua'}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isNasrTheme ? 'text-nasr-text' : 'text-ocean'}>
                  Marketing Emails
                </Label>
                <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                  Receive promotional offers and updates
                </p>
              </div>
              <Switch
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
                className={isNasrTheme ? 'data-[state=checked]:bg-gold' : 'data-[state=checked]:bg-aqua'}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className={`${
          isNasrTheme 
            ? 'bg-nasr-panel/80 border-gold/20 shadow-nasr-card' 
            : 'glass-card border-ice/50'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
              <Palette className={`h-5 w-5 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
              Appearance
            </CardTitle>
            <CardDescription className={isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}>
              Customize how the app looks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className={isNasrTheme ? 'text-nasr-text' : 'text-ocean'}>
                  Current Theme
                </Label>
                <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                  Theme is set by your organization
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isNasrTheme 
                  ? 'bg-gold/20 text-gold' 
                  : 'bg-aqua/20 text-aqua'
              }`}>
                {isNasrTheme ? 'Nasr Gold' : 'Luminous Ice'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className={`${
          isNasrTheme 
            ? 'bg-nasr-panel/80 border-gold/20 shadow-nasr-card' 
            : 'glass-card border-ice/50'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
              <Shield className={`h-5 w-5 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
              Security
            </CardTitle>
            <CardDescription className={isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}>
              Manage your account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className={`w-full justify-start ${
                isNasrTheme 
                  ? 'border-gold/20 text-nasr-text hover:bg-gold/10' 
                  : 'border-ice text-ocean hover:bg-aqua/10'
              }`}
              onClick={() => toast.info("Password reset email will be sent to your email address.")}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Legal */}
        <Card className={`${
          isNasrTheme 
            ? 'bg-nasr-panel/80 border-gold/20 shadow-nasr-card' 
            : 'glass-card border-ice/50'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
              <Scale className={`h-5 w-5 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
              Legal
            </CardTitle>
            <CardDescription className={isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}>
              View legal documents and policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/legal/privacy-policy">
              <Button
                variant="outline"
                className={`w-full justify-between ${
                  isNasrTheme 
                    ? 'border-gold/20 text-nasr-text hover:bg-gold/10' 
                    : 'border-ice text-ocean hover:bg-aqua/10'
                }`}
              >
                Privacy Policy
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/legal/terms-of-use">
              <Button
                variant="outline"
                className={`w-full justify-between ${
                  isNasrTheme 
                    ? 'border-gold/20 text-nasr-text hover:bg-gold/10' 
                    : 'border-ice text-ocean hover:bg-aqua/10'
                }`}
              >
                Terms of Use
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/legal/risk-disclosure">
              <Button
                variant="outline"
                className={`w-full justify-between ${
                  isNasrTheme 
                    ? 'border-gold/20 text-nasr-text hover:bg-gold/10' 
                    : 'border-ice text-ocean hover:bg-aqua/10'
                }`}
              >
                Risk Disclosure
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className={`${
          isNasrTheme 
            ? 'bg-nasr-panel/80 border-gold/20 shadow-nasr-card' 
            : 'glass-card border-ice/50'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
              <SettingsIcon className={`h-5 w-5 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className={`w-full justify-start ${
                isNasrTheme 
                  ? 'border-gold/20 text-nasr-text hover:bg-gold/10' 
                  : 'border-ice text-ocean hover:bg-aqua/10'
              }`}
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>

            <AlertDialog open={deleteDialogOpen} onOpenChange={(open) => {
              if (!open) resetDeleteDialog();
              else setDeleteDialogOpen(true);
            }}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={isNasrTheme ? 'bg-nasr-panel border-gold/20' : 'bg-card border-border'}>
                {deleteStep === 'confirm' ? (
                  <>
                    <AlertDialogHeader>
                      <AlertDialogTitle className={`text-xl ${isNasrTheme ? 'text-nasr-text' : 'text-foreground'}`}>
                        Are you sure you want to leave?
                      </AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div className={`space-y-4 ${isNasrTheme ? 'text-nasr-text-muted' : 'text-muted-foreground'}`}>
                          <p className="text-base">
                            We'd hate to see you go! Here's what you'll lose:
                          </p>
                          
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Trophy className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
                              <div>
                                <p className={`font-medium ${isNasrTheme ? 'text-nasr-text' : 'text-foreground'}`}>Your Progress & Achievements</p>
                                <p className="text-sm">All your learning progress, XP, and earned badges will be permanently deleted.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <TrendingUp className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
                              <div>
                                <p className={`font-medium ${isNasrTheme ? 'text-nasr-text' : 'text-foreground'}`}>Your Trading Diary</p>
                                <p className="text-sm">All your trade records, notes, and analysis history will be erased.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <Heart className={`h-5 w-5 mt-0.5 flex-shrink-0 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
                              <div>
                                <p className={`font-medium ${isNasrTheme ? 'text-nasr-text' : 'text-foreground'}`}>Community & Support</p>
                                <p className="text-sm">Access to exclusive content, community features, and personalized guidance.</p>
                              </div>
                            </div>
                          </div>
                          
                          <p className={`text-sm italic ${isNasrTheme ? 'text-gold/80' : 'text-primary/80'}`}>
                            If something isn't working for you, we'd love to hear about it! Contact us at support@nallio.io
                          </p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel 
                        className={`flex-1 ${isNasrTheme ? 'bg-gold text-nasr-bg hover:bg-gold/90 border-0' : 'bg-primary text-primary-foreground hover:bg-primary/90 border-0'}`}
                      >
                        I'll Stay!
                      </AlertDialogCancel>
                      <Button
                        variant="outline"
                        className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteStep('final')}
                      >
                        Continue with Deletion
                      </Button>
                    </AlertDialogFooter>
                  </>
                ) : (
                  <>
                    <AlertDialogHeader>
                      <AlertDialogTitle className={`text-xl ${isNasrTheme ? 'text-nasr-text' : 'text-foreground'}`}>
                        Final Confirmation
                      </AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div className={`space-y-4 ${isNasrTheme ? 'text-nasr-text-muted' : 'text-muted-foreground'}`}>
                          <p>
                            This action is <span className="text-destructive font-semibold">permanent and cannot be undone</span>. 
                            All your data will be immediately deleted.
                          </p>
                          <div className="space-y-2">
                            <Label className={isNasrTheme ? 'text-nasr-text' : 'text-foreground'}>
                              Type <span className="font-mono font-bold">DELETE</span> to confirm:
                            </Label>
                            <Input
                              value={deleteConfirmText}
                              onChange={(e) => setDeleteConfirmText(e.target.value)}
                              placeholder="Type DELETE here"
                              className={isNasrTheme 
                                ? 'bg-nasr-bg border-gold/20 text-nasr-text' 
                                : 'bg-background border-border'
                              }
                            />
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        className={`flex-1 ${isNasrTheme ? 'border-gold/20 text-nasr-text' : 'border-border text-foreground'}`}
                        onClick={() => setDeleteStep('confirm')}
                      >
                        Go Back
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== 'DELETE' || isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete My Account'}
                      </Button>
                    </AlertDialogFooter>
                  </>
                )}
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
};

export default Settings;
