
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewsForm from "@/components/NewsForm";
import AdminActualitesHeader from "@/components/admin/AdminActualitesHeader";
import NewsStatsCards from "@/components/admin/NewsStatsCards";
import NewsSearchBar from "@/components/admin/NewsSearchBar";
import NewsList from "@/components/admin/NewsList";
import { useNewsManagement } from "@/hooks/useNewsManagement";

const AdminActualites = () => {
  const {
    news,
    loading,
    searchQuery,
    setSearchQuery,
    selectedNews,
    isFormOpen,
    setIsFormOpen,
    handleDelete,
    handleEdit,
    handleNewNews,
    handleFormSuccess,
    handleFormCancel
  } = useNewsManagement();

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <AdminActualitesHeader onNewNews={handleNewNews} />
      <NewsStatsCards news={news} />
      <NewsSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <NewsList
        news={news}
        searchQuery={searchQuery}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onNewNews={handleNewNews}
      />

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedNews ? "Modifier l'actualité" : "Nouvelle actualité"}
            </DialogTitle>
          </DialogHeader>
          <NewsForm
            news={selectedNews}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminActualites;
