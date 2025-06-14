
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Calendar, Eye, Edit } from "lucide-react";
import type { News } from "@/types/news";

interface NewsStatsCardsProps {
  news: News[];
}

const NewsStatsCards = ({ news }: NewsStatsCardsProps) => {
  const publishedCount = news.filter(item => item.published).length;
  const draftCount = news.filter(item => !item.published).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{news.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Publiées</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">{publishedCount}</p>
            </div>
            <Eye className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-lg bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Brouillons</p>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{draftCount}</p>
            </div>
            <Edit className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsStatsCards;
