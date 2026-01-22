import { useState } from "react";
import { useTheme } from "next-themes";
import SidebarLayout from "@/components/layout/SidebarLayout";
import { useAuth } from "@/lib/AuthContext";
import { useClient } from "@/lib/clientContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, Bell, Shield, Palette, LogOut, Trash2, Scale, ChevronRight, Heart, Trophy, TrendingUp, Moon, Sun } from "lucide-react";
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

// Appearance Section with Theme Toggle - uses semantic tokens
function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const { client } = useClient();
  const isDark = theme === 'dark';

  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-card-foreground">
          <Palette className="h-5 w-5 text-primary" />
          Appearance
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Customize how the app looks
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="flex items-center gap-2 text-card-foreground">
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Theme Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark mode
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Sun className={`h-4 w-4 ${!isDark ? 'text-primary' : 'text-muted-foreground'}`} />
            <Switch
              checked={isDark}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              className="data-[state=checked]:bg-primary"
            />
            <Moon className={`h-4 w-4 ${isDark ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
        </div>

        {/* Brand Badge */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="space-y-0.5">
            <Label className="text-card-foreground">Brand</Label>
            <p className="text-sm text-muted-foreground">
              Your organization's brand theme
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/20 text-primary">
            {client?.company_name || 'Default'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

const Settings = () => {
  const { signOut, user } = useAuth();
  const { client } = useClient();
  const navigate = useNavigate();
  
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
          <h1 className="text-4xl font-bold text-primary">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Notifications */}
        <Card className="bg-card border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Bell className="h-5 w-5 text-primary" />
              Notifications
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Choose what notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-card-foreground">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email updates about your progress
                </p>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-card-foreground">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Get push notifications for new content
                </p>
              </div>
              <Switch
                checked={pushNotifications}
                onCheckedChange={setPushNotifications}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-card-foreground">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Receive promotional offers and updates
                </p>
              </div>
              <Switch
                checked={marketingEmails}
                onCheckedChange={setMarketingEmails}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <AppearanceSection />

        {/* Security */}
        <Card className="bg-card border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Shield className="h-5 w-5 text-primary" />
              Security
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Manage your account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start border-border text-foreground hover:bg-accent"
              onClick={() => toast.info("Password reset email will be sent to your email address.")}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        {/* Legal */}
        <Card className="bg-card border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <Scale className="h-5 w-5 text-primary" />
              Legal
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              View legal documents and policies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/legal/privacy-policy">
              <Button
                variant="outline"
                className="w-full justify-between border-border text-foreground hover:bg-accent"
              >
                Privacy Policy
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/legal/terms-of-use">
              <Button
                variant="outline"
                className="w-full justify-between border-border text-foreground hover:bg-accent"
              >
                Terms of Use
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/legal/risk-disclosure">
              <Button
                variant="outline"
                className="w-full justify-between border-border text-foreground hover:bg-accent"
              >
                Risk Disclosure
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Account Actions */}
        <Card className="bg-card border-border shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-card-foreground">
              <SettingsIcon className="h-5 w-5 text-primary" />
              Account Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start border-border text-foreground hover:bg-accent"
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
              <AlertDialogContent className="bg-card border-border">
                {deleteStep === 'confirm' ? (
                  <>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl text-card-foreground">
                        Are you sure you want to leave?
                      </AlertDialogTitle>
                      <AlertDialogDescription asChild>
                        <div className="space-y-4 text-muted-foreground">
                          <p className="text-base">
                            We'd hate to see you go! Here's what you'll lose:
                          </p>
                          
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <Trophy className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                              <div>
                                <p className="font-medium text-card-foreground">Your Progress & Achievements</p>
                                <p className="text-sm">All your learning progress, XP, and earned badges will be permanently deleted.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <TrendingUp className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                              <div>
                                <p className="font-medium text-card-foreground">Your Trading Diary</p>
                                <p className="text-sm">All your trade records, notes, and analysis history will be erased.</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                              <Heart className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                              <div>
                                <p className="font-medium text-card-foreground">Community & Support</p>
                                <p className="text-sm">Access to exclusive content, community features, and personalized guidance.</p>
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-sm italic text-primary/80">
                            If something isn't working for you, we'd love to hear about it! Contact us at support@nallio.io
                          </p>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 border-0">
                        I'll Stay!
                      </AlertDialogCancel>
                      <Button
                        variant="outline"
                        className="flex-1 border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteStep('final')}
                      >
                        Continue to Delete
                      </Button>
                    </AlertDialogFooter>
                  </>
                ) : (
                  <>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-xl text-destructive">
                        Final Confirmation
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-muted-foreground">
                        This action cannot be undone. To confirm, please type <strong className="text-foreground">DELETE</strong> below.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Input
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="bg-background border-border text-foreground"
                      />
                    </div>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel 
                        className="flex-1 border-border text-foreground"
                        onClick={resetDeleteDialog}
                      >
                        Cancel
                      </AlertDialogCancel>
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
