import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Save, FileText, Send } from "lucide-react";
import type { News } from "@/types/news";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import QuillEditor from "./QuillEditor";

interface NewsFormProps {
  news?: News | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type NewsCategory = "reunion_travail" | "nouvelles_informations" | "activites_parauniversitaire" | "avis_etudiants" | "avis_enseignants" | "evenements_scientifique";

const NewsForm = ({ news, onSuccess, onCancel }: NewsFormProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<NewsCategory>("nouvelles_informations");
  const [published, setPublished] = useState(false);
  const [status, setStatus] = useState<string>("draft");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { logActivity } = useActivityLogger();

  const categories = [
    { value: "reunion_travail" as NewsCategory, label: "Réunion de travail" },
    { value: "nouvelles_informations" as NewsCategory, label: "Nouvelles informations" },
    { value: "activites_parauniversitaire" as NewsCategory, label: "Activités parauniversitaire" },
    { value: "avis_etudiants" as NewsCategory, label: "Avis étudiants" },
    { value: "avis_enseignants" as NewsCategory, label: "Avis enseignants" },
    { value: "evenements_scientifique" as NewsCategory, label: "Événements scientifique" }
  ];

  useEffect(() => {
    if (news) {
      setTitle(news.title);
      setContent(news.content);
      setExcerpt(news.excerpt || "");
      setCategory(news.category as NewsCategory);
      setPublished(news.published);
      setStatus((news as any).status || (news.published ? 'published' : 'draft'));
      setImagePreview(news.image_url || "");
    }
  }, [news]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocumentFile(file);
    }
  };

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent, submitStatus?: string) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = news?.image_url || "";
      let documentUrl = news?.document_url || "";
      let documentName = news?.document_name || "";

      // Upload new image if provided - using news-images bucket
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, 'news-images', 'news');
      }

      // Upload new document if provided - using news-documents bucket
      if (documentFile) {
        documentUrl = await uploadFile(documentFile, 'news-documents', 'news');
        documentName = documentFile.name;
      }

      const finalStatus = submitStatus || status;
      const isPublished = finalStatus === 'published' || (finalStatus === 'approved' && published);

      const newsData = {
        title,
        content,
        excerpt: excerpt || null,
        category,
        published: isPublished,
        status: finalStatus,
        image_url: imageUrl || null,
        document_url: documentUrl || null,
        document_name: documentName || null,
      };

      if (news) {
        // Update existing news
        const { error } = await supabase
          .from('news')
          .update(newsData)
          .eq('id', news.id);

        if (error) throw error;

        await logActivity('update_news', `Actualité modifiée: ${title} (${finalStatus})`);

        toast({
          title: "Succès",
          description: "L'actualité a été mise à jour.",
        });
      } else {
        // Create new news
        const { error } = await supabase
          .from('news')
          .insert(newsData);

        if (error) throw error;

        await logActivity('create_news', `Actualité créée: ${title} (${finalStatus})`);

        toast({
          title: "Succès",
          description: "L'actualité a été créée.",
        });
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving news:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la sauvegarde de l'actualité.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Titre *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de l'actualité"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Extrait</label>
            <Textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Résumé court de l'actualité"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Catégorie *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NewsCategory)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800"
              >
                <option value="draft">Brouillon</option>
                <option value="pending_review">En attente de révision</option>
                <option value="approved">Approuvé</option>
                <option value="published">Publié</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="published"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="published" className="text-sm font-medium">
              Marquer comme publié (si approuvé)
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contenu *</CardTitle>
        </CardHeader>
        <CardContent>
          <QuillEditor
            value={content}
            onChange={setContent}
            placeholder="Rédigez le contenu de votre actualité..."
            className="mb-4"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Médias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <div className="flex items-center space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imagePreview && (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                    onClick={() => {
                      setImagePreview("");
                      setImageFile(null);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Document (PDF, Word, etc.)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={handleDocumentChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {documentFile && (
              <Badge variant="outline" className="mt-2">
                {documentFile.name}
              </Badge>
            )}
            {news?.document_url && !documentFile && (
              <Badge variant="outline" className="mt-2">
                {news.document_name || "Document existant"}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        
        {status === 'draft' && (
          <Button 
            type="button" 
            variant="outline"
            onClick={(e) => handleSubmit(e, 'pending_review')}
            disabled={loading}
            className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
            ) : (
              <Send className="h-4 w-4 mr-2" />
            )}
            Soumettre pour révision
          </Button>
        )}
        
        <Button type="submit" disabled={loading}>
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {news ? "Mettre à jour" : "Créer"}
        </Button>
      </div>
    </form>
  );
};

export default NewsForm;
