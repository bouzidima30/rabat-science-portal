
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface NewsSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const NewsSearchBar = ({ searchQuery, setSearchQuery }: NewsSearchBarProps) => {
  return (
    <Card className="mb-8 border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Rechercher une actualité..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 border-0 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-700 transition-colors"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsSearchBar;
