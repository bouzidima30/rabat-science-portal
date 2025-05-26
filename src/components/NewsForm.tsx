
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, File, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface NewsFormProps {
  news?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const NewsForm = ({ news, onSuccess, onCancel }: NewsFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    published: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const { profile } = useAuth();
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const categoryOptions = [
    { value: "reunion_travail", label: "Réunion de travail" },
    { value: "nouvelles_informations", label: "Nouvelles informations" },
    { value: "activites_parauniversitaire", label: "Activités parauniversitaire" },
    { value: "avis_etudiants", label: "Avis étudiants" },
    { value: "avis_enseignants", label: "Avis enseignants" },
    { value: "evenements_scientifique", label: "Événements scientifique" },
  ];

  useEffect(() => {
    if (news) {
      setFormData({
        title: news.title || "",
        content: news.content || "",
        excerpt: news.excerpt || "",
        category: news.category || "",
        published: news.published || false,
      });
      setImagePreview(news.image_url);
    }
  }, [news]);

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('news-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('news-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleDocumentUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('news-documents')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('news-documents')
      .getPublicUrl(fileName);

    return { url: publicUrl, name: file.name };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = news?.image_url || null;
      let documentUrl = news?.document_url || null;
      let documentName = news?.document_name || null;

      if (imageFile) {
        imageUrl = await handleImageUpload(imageFile);
      }

      if (documentFile) {
        const docData = await handleDocumentUpload(documentFile);
        documentUrl = docData.url;
        documentName = docData.name;
      }

      const newsData = {
        ...formData,
        image_url: imageUrl,
        document_url: documentUrl,
        document_name: documentName,
        author_id: profile?.id,
      };

      if (news) {
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', news.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('news')
          .insert([newsData]);
        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: news ? "L'actualité a été modifiée." : "L'actualité a été créée.",
      });

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const insertTextAtCursor = (text: string) => {
    if (contentRef.current) {
      const start = contentRef.current.selectionStart;
      const end = contentRef.current.selectionEnd;
      const content = formData.content;
      const newContent = content.substring(0, start) + text + content.substring(end);
      
      setFormData(prev => ({ ...prev, content: newContent }));
      
      // Restore cursor position
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.focus();
          contentRef.current.setSelectionRange(start + text.length, start + text.length);
        }
      }, 0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Titre *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Catégorie *</Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Extrait</Label>
        <Textarea
          id="excerpt"
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          placeholder="Résumé court de l'actualité..."
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenu *</Label>
        <div className="border rounded-lg">
          {/* Text formatting toolbar */}
          <div className="flex flex-wrap gap-2 p-3 border-b bg-gray-50 dark:bg-gray-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertTextAtCursor("**Texte en gras**")}
            >
              <strong>B</strong>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertTextAtCursor("*Texte en italique*")}
            >
              <em>I</em>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertTextAtCursor("# Titre principal\n")}
            >
              H1
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertTextAtCursor("## Sous-titre\n")}
            >
              H2
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertTextAtCursor("- Élément de liste\n")}
            >
              Liste
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => insertTextAtCursor("[Texte du lien](https://exemple.com)")}
            >
              Lien
            </Button>
          </div>
          
          <Textarea
            ref={contentRef}
            id="content"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
            placeholder="Contenu complet de l'actualité... Utilisez Markdown pour le formatage."
            rows={10}
            className="border-0 focus:ring-0"
            required
          />
        </div>
        <p className="text-xs text-gray-500">
          Vous pouvez utiliser Markdown pour le formatage (ex: **gras**, *italique*, # titre, etc.)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Image</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setImagePreview(null);
                    setImageFile(null);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setImageFile(file);
                      const reader = new FileReader();
                      reader.onload = (e) => setImagePreview(e.target?.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="mt-2"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Document (PDF, DOC, XLS, etc.)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            {documentFile || news?.document_name ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <File className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-sm">
                    {documentFile?.name || news?.document_name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setDocumentFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <File className="mx-auto h-8 w-8 text-gray-400" />
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setDocumentFile(file);
                  }}
                  className="mt-2"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
        />
        <Label htmlFor="published">Publier immédiatement</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-[#006be5] hover:bg-[#0056b3]"
        >
          {loading ? "Enregistrement..." : (news ? "Modifier" : "Créer")}
        </Button>
      </div>
    </form>
  );
};

export default NewsForm;
