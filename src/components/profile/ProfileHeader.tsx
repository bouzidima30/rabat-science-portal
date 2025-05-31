
import { User, Mail, Shield, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileHeaderProps {
  user: any;
  fullName: string;
  email: string;
}

const ProfileHeader = ({ user, fullName, email }: ProfileHeaderProps) => {
  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20">
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Informations du compte
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-2xl mx-auto mb-4">
              {(fullName || email).charAt(0).toUpperCase()}
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              {fullName || 'Nom non défini'}
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{email}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Membre depuis</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;
