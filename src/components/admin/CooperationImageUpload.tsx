
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { validateFile } from "@/utils/fileValidation";
import { Upload, X } from "lucide-react";

interface CooperationImageUploadProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
  disabled?: boolean;
}

const CooperationImageUpload = ({ imageUrl, onImageChange, disabled }: CooperationImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateFile(file, 'image');
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `cooperation-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('cooperation-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: urlData } = supabase.storage
        .from('cooperation-images')
        .getPublicUrl(filePath);

      onImageChange(urlData.publicUrl);

      toast({
        title: "Succès",
        description: "Image uploadée avec succès",
      });
    } catch (error: any) {
      console.error('Erreur upload image:', error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'upload de l'image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onImageChange('');
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="image">Image de la coopération</Label>
      {imageUrl ? (
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Preview" 
            className="w-full h-32 object-cover rounded border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading || disabled}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('image')?.click()}
            disabled={uploading || disabled}
            className="w-full"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Upload en cours..." : "Sélectionner une image"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CooperationImageUpload;
