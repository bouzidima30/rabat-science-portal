
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import NewsListItem from "./NewsListItem";
import type { News } from "@/types/news";

interface NewsListProps {
  news: News[];
  searchQuery: string;
  onEdit: (news: News) => void;
  onDelete: (id: string) => void;
  onNewNews: () => void;
}

const NewsList = ({ news, searchQuery, onEdit, onDelete, onNewNews }: NewsListProps) => {
  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filteredNews.length === 0) {
    return (
      <Card className="border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Aucune actualité trouvée
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery ? "Aucun résultat pour votre recherche." : "Créez votre première actualité pour commencer."}
          </p>
          {!searchQuery && (
            <Button 
              onClick={onNewNews}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle actualité
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {filteredNews.map((item) => (
        <NewsListItem
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default NewsList;
