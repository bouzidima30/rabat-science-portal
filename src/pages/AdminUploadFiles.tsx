import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";
import { useFileManagement } from "@/hooks/useFileManagement";
import FileUploadDialog from "@/components/admin/FileUploadDialog";
import FileFilters from "@/components/admin/FileFilters";
import ExistingFilesList from "@/components/admin/ExistingFilesList";
import FileStatsCards from "@/components/admin/FileStatsCards";

const AdminUploadFiles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

  const {
    files,
    setFiles,
    existingFiles,
    uploading,
    loading,
    fileInputRef,
    categories,
    handleFileSelect,
    updateFile,
    removeFile,
    uploadFiles,
    downloadFile,
    deleteExistingFile
  } = useFileManagement();

  const handleUpload = async () => {
    await uploadFiles();
    setIsUploadDialogOpen(false);
  };

  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-xl">
              <Upload className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestion des Fichiers
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Téléchargez et gérez vos fichiers
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsUploadDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Télécharger des fichiers
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <FileStatsCards files={existingFiles} />

      {/* Filters Section */}
      <FileFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Existing Files List */}
      <ExistingFilesList
        files={existingFiles}
        loading={loading}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onDownload={downloadFile}
        onDelete={deleteExistingFile}
      />

      {/* Upload Dialog */}
      <FileUploadDialog
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        files={files}
        setFiles={setFiles}
        onUpload={handleUpload}
        uploading={uploading}
        categories={categories}
      />

      {/* Hidden file input for dialog */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default AdminUploadFiles;
