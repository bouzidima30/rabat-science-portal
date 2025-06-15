import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings, User, Bell, Shield, Palette, Save, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const Parametres = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isDarkMode, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    notifications: true,
    emailNotifications: true,
    darkMode: isDarkMode
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.fullName,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres ont été mis à jour avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = () => {
    toggleTheme();
    setFormData(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <Settings className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Paramètres
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Personnalisez votre expérience utilisateur
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="lg:col-span-2 border-0 shadow-lg bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Informations du Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="Votre nom complet"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-gray-50 dark:bg-gray-700"
              />
              <p className="text-sm text-gray-500">L'email ne peut pas être modifié</p>
            </div>

            <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </Button>
          </CardContent>
        </Card>

        {/* Appearance & Notifications */}
        <div className="space-y-6">
          {/* Appearance */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-500" />
                Apparence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {isDarkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  <Label htmlFor="darkMode">Mode sombre</Label>
                </div>
                <Switch
                  id="darkMode"
                  checked={isDarkMode}
                  onCheckedChange={handleThemeToggle}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-green-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notifications en temps réel</Label>
                <Switch
                  id="notifications"
                  checked={formData.notifications}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifications: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Notifications par email</Label>
                <Switch
                  id="emailNotifications"
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-500" />
                Sécurité
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Changer le mot de passe
              </Button>
              
              <Button variant="outline" className="w-full">
                Activer l'authentification à deux facteurs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Parametres;
