import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/lib/AuthContext";
import { useClient } from "@/lib/clientContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, Calendar, Award, TrendingUp, BookOpen, Target, Play } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { IntroVideoModal } from "@/components/IntroVideoModal";

const Profile = () => {
  const { user, profile } = useAuth();
  const { client } = useClient();
  const isNasrTheme = client?.subdomain === 'nasr';
  
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(profile?.first_name || '');
  const [lastName, setLastName] = useState(profile?.last_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [showIntroVideo, setShowIntroVideo] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
        })
        .eq('auth_user_id', user.id);

      if (error) throw error;
      
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Parse quiz answers
  const quizAnswers = profile?.quiz_answers as Record<string, unknown> | null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className={`text-4xl font-bold ${
            isNasrTheme 
              ? 'bg-gradient-to-r from-gold-light to-gold bg-clip-text text-transparent' 
              : 'bg-gradient-to-r from-aqua to-aqua-deep bg-clip-text text-transparent'
          }`}>
            Your Profile
          </h1>
          <p className={isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}>
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className={`${
          isNasrTheme 
            ? 'bg-nasr-panel/80 border-gold/20 shadow-nasr-card' 
            : 'glass-card border-ice/50'
        }`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className={`flex items-center gap-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
              <User className={`h-5 w-5 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
              Personal Information
            </CardTitle>
            <Button
              variant={isEditing ? "outline" : "default"}
              onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
              className={isNasrTheme 
                ? 'bg-gradient-to-r from-gold to-gold-light text-nasr-bg hover:shadow-gold/30' 
                : 'bg-gradient-to-r from-aqua to-aqua-deep text-white hover:shadow-aqua/30'
              }
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${
                isNasrTheme 
                  ? 'from-gold-light to-gold text-nasr-bg' 
                  : 'from-aqua to-aqua-deep text-white'
              } flex items-center justify-center text-3xl font-bold`}>
                {(profile?.first_name || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className={`text-xl font-semibold ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                  {profile?.first_name} {profile?.last_name}
                </h3>
                <p className={isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}>
                  {user?.email}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowIntroVideo(true)}
                  className={`mt-3 ${
                    isNasrTheme 
                      ? 'border-gold/30 text-gold hover:bg-gold/10 hover:border-gold/50' 
                      : 'border-aqua/30 text-aqua hover:bg-aqua/10'
                  }`}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Intro Video
                </Button>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}>
                  First Name
                </Label>
                {isEditing ? (
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={isNasrTheme 
                      ? 'bg-nasr-bg/50 border-gold/20 text-nasr-text focus:border-gold' 
                      : 'bg-white/50 border-ice text-ocean focus:border-aqua'
                    }
                  />
                ) : (
                  <p className={`py-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                    {profile?.first_name || '-'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}>
                  Last Name
                </Label>
                {isEditing ? (
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={isNasrTheme 
                      ? 'bg-nasr-bg/50 border-gold/20 text-nasr-text focus:border-gold' 
                      : 'bg-white/50 border-ice text-ocean focus:border-aqua'
                    }
                  />
                ) : (
                  <p className={`py-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                    {profile?.last_name || '-'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className={`flex items-center gap-2 ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <p className={`py-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                  {user?.email || '-'}
                </p>
              </div>

              <div className="space-y-2">
                <Label className={`flex items-center gap-2 ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                {isEditing ? (
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={isNasrTheme 
                      ? 'bg-nasr-bg/50 border-gold/20 text-nasr-text focus:border-gold' 
                      : 'bg-white/50 border-ice text-ocean focus:border-aqua'
                    }
                  />
                ) : (
                  <p className={`py-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                    {profile?.phone || '-'}
                  </p>
                )}
              </div>
            </div>

            {isEditing && (
              <Button
                onClick={handleSave}
                disabled={saving}
                className={`w-full ${isNasrTheme 
                  ? 'bg-gradient-to-r from-gold to-gold-light text-nasr-bg hover:shadow-gold/30' 
                  : 'bg-gradient-to-r from-aqua to-aqua-deep text-white hover:shadow-aqua/30'
                }`}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Trading Profile Card */}
        {quizAnswers && (
          <Card className={`${
            isNasrTheme 
              ? 'bg-nasr-panel/80 border-gold/20 shadow-nasr-card' 
              : 'glass-card border-ice/50'
          }`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                <Target className={`h-5 w-5 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
                Your Trading Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {quizAnswers.experience_level && (
                  <div className="space-y-1">
                    <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                      Experience Level
                    </p>
                    <p className={`font-medium ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                      {String(quizAnswers.experience_level)}
                    </p>
                  </div>
                )}
                {quizAnswers.primary_goal && (
                  <div className="space-y-1">
                    <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                      Primary Goal
                    </p>
                    <p className={`font-medium ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                      {String(quizAnswers.primary_goal)}
                    </p>
                  </div>
                )}
                {quizAnswers.markets_interested && (
                  <div className="space-y-1">
                    <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                      Markets Interested
                    </p>
                    <p className={`font-medium ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                      {Array.isArray(quizAnswers.markets_interested) 
                        ? quizAnswers.markets_interested.join(', ') 
                        : String(quizAnswers.markets_interested)}
                    </p>
                  </div>
                )}
                {quizAnswers.main_concern && (
                  <div className="space-y-1">
                    <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                      Main Concern
                    </p>
                    <p className={`font-medium ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                      {String(quizAnswers.main_concern)}
                    </p>
                  </div>
                )}
                {quizAnswers.time_available && (
                  <div className="space-y-1">
                    <p className={`text-sm ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                      Time Available
                    </p>
                    <p className={`font-medium ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                      {String(quizAnswers.time_available)}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Stats */}
        <Card className={`${
          isNasrTheme 
            ? 'bg-nasr-panel/80 border-gold/20 shadow-nasr-card' 
            : 'glass-card border-ice/50'
        }`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
              <Award className={`h-5 w-5 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
              Account Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl ${
                isNasrTheme ? 'bg-nasr-bg/50 border border-gold/10' : 'bg-white/30 border border-ice/30'
              }`}>
                <Calendar className={`h-5 w-5 mb-2 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
                <p className={`text-xs ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                  Member Since
                </p>
                <p className={`font-semibold ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${
                isNasrTheme ? 'bg-nasr-bg/50 border border-gold/10' : 'bg-white/30 border border-ice/30'
              }`}>
                <TrendingUp className={`h-5 w-5 mb-2 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
                <p className={`text-xs ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                  Account Status
                </p>
                <p className={`font-semibold capitalize ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                  Active
                </p>
              </div>
              <div className={`p-4 rounded-xl ${
                isNasrTheme ? 'bg-nasr-bg/50 border border-gold/10' : 'bg-white/30 border border-ice/30'
              }`}>
                <BookOpen className={`h-5 w-5 mb-2 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
                <p className={`text-xs ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                  Client
                </p>
                <p className={`font-semibold ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                  {client?.company_name || '-'}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${
                isNasrTheme ? 'bg-nasr-bg/50 border border-gold/10' : 'bg-white/30 border border-ice/30'
              }`}>
                <User className={`h-5 w-5 mb-2 ${isNasrTheme ? 'text-gold' : 'text-aqua'}`} />
                <p className={`text-xs ${isNasrTheme ? 'text-nasr-text-muted' : 'text-ocean-muted'}`}>
                  Role
                </p>
                <p className={`font-semibold capitalize ${isNasrTheme ? 'text-nasr-text' : 'text-ocean'}`}>
                  {profile?.is_admin ? 'Admin' : 'Learner'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Intro Video Modal */}
        <IntroVideoModal 
          isOpen={showIntroVideo} 
          onClose={() => setShowIntroVideo(false)} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Profile;
