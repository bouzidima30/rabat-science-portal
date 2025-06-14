
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";

interface FileFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
}

const FileFilters = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories
}: FileFiltersProps) => {
  const categoryFilters = [
    { id: 'all', label: 'Toutes les catégories' },
    ...categories.map(cat => ({ id: cat, label: cat }))
  ];

  return (
    <Card className="mb-8 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium mb-3">Catégorie</label>
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                  className="rounded-full"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Search Filter */}
          <div>
            <label className="block text-sm font-medium mb-3">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un fichier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileFilters;
