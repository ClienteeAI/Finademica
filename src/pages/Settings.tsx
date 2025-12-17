import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/lib/AuthContext";
import { useClient } from "@/lib/clientContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon, Bell, Shield, Palette, LogOut, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const { signOut } = useAuth();
  const { client } = useClient();
  const navigate = useNavigate();
  const isNasrTheme = client?.subdomain === 'nasr';
  
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const handleDeleteAccount = () => {
    toast.info("Account deletion requires contacting support.");
  };

  return (
    <DashboardLayout>
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

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className={isNasrTheme ? 'bg-nasr-panel border-gold/20' : 'bg-white border-ice'}>
                <AlertDialogHeader>
                  <AlertDialogTitle className={isNasrTheme ? 'text-nasr-text' : 'text-ocean'}>
                    Are you sure?
                  </AlertDialogTitle>
                  <AlertDialogDescription className={isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}>
                    This action cannot be undone. This will permanently delete your account and remove all your data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className={isNasrTheme ? 'border-gold/20 text-nasr-text' : 'border-ice text-ocean'}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
