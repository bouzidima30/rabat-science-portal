
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";

interface AdminActualitesHeaderProps {
  onNewNews: () => void;
}

const AdminActualitesHeader = ({ onNewNews }: AdminActualitesHeaderProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
            <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Actualités
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Gérez et publiez les actualités de la faculté
            </p>
          </div>
        </div>
        <Button
          onClick={onNewNews}
          className="bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle actualité
        </Button>
      </div>
    </div>
  );
};

export default AdminActualitesHeader;
