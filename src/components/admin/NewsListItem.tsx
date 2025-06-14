
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Calendar } from "lucide-react";
import type { News } from "@/types/news";

interface NewsListItemProps {
  item: News;
  onEdit: (news: News) => void;
  onDelete: (id: string) => void;
}

const NewsListItem = ({ item, onEdit, onDelete }: NewsListItemProps) => {
  const categoryLabels = {
    reunion_travail: "Réunion de travail",
    nouvelles_informations: "Nouvelles informations",
    activites_parauniversitaire: "Activités parauniversitaire",
    avis_etudiants: "Avis étudiants",
    avis_enseignants: "Avis enseignants",
    evenements_scientifique: "Événements scientifique"
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white dark:bg-gray-800">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex space-x-4 flex-1">
            {item.image_url && (
              <img 
                src={item.image_url} 
                alt={item.title}
                className="w-24 h-24 object-cover rounded-xl shadow-md"
              />
            )}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(item)}
                    className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(item.id)}
                    className="hover:bg-red-50 hover:border-red-300 dark:hover:bg-red-900/20 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 mb-3">
                <Badge 
                  variant="secondary" 
                  className="bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300"
                >
                  {categoryLabels[item.category as keyof typeof categoryLabels]}
                </Badge>
                <Badge variant={item.published ? "default" : "destructive"}>
                  {item.published ? "Publié" : "Brouillon"}
                </Badge>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(item.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.excerpt || item.content.substring(0, 200) + "..."}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsListItem;
