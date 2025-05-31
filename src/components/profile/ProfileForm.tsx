
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Save } from "lucide-react";
import { useActivityLogger } from "@/hooks/useActivityLogger";

interface ProfileFormProps {
  fullName: string;
  email: string;
  isUpdating: boolean;
  onUpdateProfile: (fullName: string) => Promise<void>;
}

const ProfileForm = ({ fullName, email, isUpdating, onUpdateProfile }: ProfileFormProps) => {
  const [formData, setFormData] = useState({ full_name: fullName });
  const { logActivity } = useActivityLogger();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateProfile(formData.full_name);
    await logActivity('update', 'Mise à jour du profil utilisateur');
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Modifier les informations
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nom complet</Label>
            <Input
              id="full_name"
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ full_name: e.target.value })}
              placeholder="Votre nom complet"
              className="h-12"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="h-12 bg-gray-50 dark:bg-gray-800"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              L'adresse email ne peut pas être modifiée
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isUpdating}
            className="w-full h-12 bg-green-600 hover:bg-green-700"
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Mise à jour...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Sauvegarder les modifications
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
