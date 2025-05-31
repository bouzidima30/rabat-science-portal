
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ProfileTopBar from "@/components/profile/ProfileTopBar";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileForm from "@/components/profile/ProfileForm";
import PasswordForm from "@/components/profile/PasswordForm";

const Profil = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (profile?.full_name) {
      setFullName(profile.full_name);
    } else if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [profile, user]);

  const handleUpdateProfile = async (newFullName: string) => {
    setIsUpdating(true);

    try {
      // Update user metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { full_name: newFullName }
      });

      if (updateError) throw updateError;

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: newFullName })
        .eq('id', user?.id);

      if (profileError) throw profileError;

      setFullName(newFullName);

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ProfileTopBar />
      
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Card */}
            <div className="lg:col-span-1">
              <ProfileHeader 
                user={user}
                fullName={fullName}
                email={user.email || ''}
              />
            </div>

            {/* Forms */}
            <div className="lg:col-span-2 space-y-8">
              <ProfileForm
                fullName={fullName}
                email={user.email || ''}
                isUpdating={isUpdating}
                onUpdateProfile={handleUpdateProfile}
              />

              <PasswordForm
                isChangingPassword={isChangingPassword}
                setIsChangingPassword={setIsChangingPassword}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
