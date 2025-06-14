
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle, Clock, Zap, Database, Image as ImageIcon } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import SearchInput from "@/components/SearchInput";
import ConfirmDialog from "@/components/ConfirmDialog";
import OptimizedImage from "@/components/OptimizedImage";
import { useToastNotifications } from "@/hooks/useToastNotifications";
import { useAsyncOperation } from "@/hooks/useAsyncOperation";
import { useContentCache, useNewsCache, useEventsCache } from "@/hooks/useContentCache";
import { usePerformanceMonitor, useOperationTimer, useBundleMonitor } from "@/hooks/usePerformanceMonitor";
import { preloadCriticalData, searchContent } from "@/utils/dbOptimization";

const SecurityTest = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  
  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor('SecurityTest');
  const { start, end } = useOperationTimer();
  useBundleMonitor();
  
  // Toast notifications
  const { showSuccess, showError, showInfo, showWarning } = useToastNotifications();
  
  // Async operations
  const { loading, execute } = useAsyncOperation();
  
  // Cached data
  const { data: newsData, isLoading: newsLoading, error: newsError } = useNewsCache();
  const { data: eventsData, isLoading: eventsLoading } = useEventsCache();

  useEffect(() => {
    // Preload critical data on component mount
    preloadCriticalData();
  }, []);

  const runSecurityTest = async () => {
    start('Security Test');
    
    await execute(async () => {
      // Simulate security testing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const results = [
        { test: "SQL Injection", status: "passed", severity: "high" },
        { test: "XSS Protection", status: "passed", severity: "high" },
        { test: "CSRF Protection", status: "passed", severity: "medium" },
        { test: "Input Validation", status: "passed", severity: "high" },
        { test: "Authentication", status: "passed", severity: "critical" }
      ];
      
      setTestResults(results);
      return results;
    }, {
      successMessage: "Tests de sécurité terminés avec succès",
      errorMessage: "Erreur lors des tests de sécurité",
      loadingMessage: "Exécution des tests de sécurité..."
    });
    
    end('Security Test');
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    start('Content Search');
    
    try {
      const results = await searchContent(
        query,
        ['news', 'events', 'formations'],
        {
          news: ['title', 'content', 'excerpt'],
          events: ['titre', 'description'],
          formations: ['titre', 'description']
        }
      );
      
      showInfo("Recherche terminée", `${results.length} résultats trouvés`);
    } catch (error) {
      showError("Erreur de recherche", "Impossible d'effectuer la recherche");
    } finally {
      end('Content Search');
    }
  };

  const testToastNotifications = () => {
    showSuccess("Test réussi", "Notification de succès");
    setTimeout(() => showWarning("Attention", "Notification d'avertissement"), 1000);
    setTimeout(() => showError("Erreur", "Notification d'erreur"), 2000);
    setTimeout(() => showInfo("Information", "Notification d'information"), 3000);
  };

  if (newsLoading || eventsLoading) {
    return <LoadingState message="Chargement des données..." fullPage />;
  }

  if (newsError) {
    return (
      <ErrorState
        title="Erreur de chargement"
        description="Impossible de charger les données"
        actionLabel="Réessayer"
        onAction={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-xl">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Test de Performance et Sécurité
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Tests complets des fonctionnalités de performance et sécurité
          </p>
        </div>

        {/* Performance Metrics */}
        {performanceMetrics && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Métriques de Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {performanceMetrics.renderTime.toFixed(2)}ms
                  </div>
                  <div className="text-sm text-gray-600">Temps de rendu</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {performanceMetrics.loadTime.toFixed(2)}ms
                  </div>
                  <div className="text-sm text-gray-600">Temps de chargement</div>
                </div>
                {performanceMetrics.memoryUsage && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {(performanceMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB
                    </div>
                    <div className="text-sm text-gray-600">Mémoire utilisée</div>
                  </div>
                )}
                {performanceMetrics.connectionType && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {performanceMetrics.connectionType}
                    </div>
                    <div className="text-sm text-gray-600">Type de connexion</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Component */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Recherche Optimisée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SearchInput
              placeholder="Rechercher dans le contenu..."
              value={searchQuery}
              onChange={setSearchQuery}
              onClear={() => setSearchQuery("")}
              className="mb-4"
            />
            <Button 
              onClick={() => handleSearch(searchQuery)}
              disabled={!searchQuery.trim()}
            >
              Lancer la recherche
            </Button>
          </CardContent>
        </Card>

        {/* Image Optimization Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImageIcon className="h-5 w-5 mr-2" />
              Images Optimisées avec Lazy Loading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <OptimizedImage
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7"
                alt="Image test 1"
                className="aspect-video rounded-lg"
                priority={true}
              />
              <OptimizedImage
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                alt="Image test 2"
                className="aspect-video rounded-lg"
              />
              <OptimizedImage
                src="https://images.unsplash.com/photo-1518770660439-4636190af475"
                alt="Image test 3"
                className="aspect-video rounded-lg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Cached Data Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Actualités (Mise en cache)</CardTitle>
            </CardHeader>
            <CardContent>
              {newsData && newsData.length > 0 ? (
                <div className="space-y-2">
                  {newsData.slice(0, 3).map((news: any) => (
                    <div key={news.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-sm">{news.title}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(news.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={AlertTriangle}
                  title="Aucune actualité"
                  description="Aucune actualité disponible"
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Événements (Mise en cache)</CardTitle>
            </CardHeader>
            <CardContent>
              {eventsData && eventsData.length > 0 ? (
                <div className="space-y-2">
                  {eventsData.slice(0, 3).map((event: any) => (
                    <div key={event.id} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-medium text-sm">{event.titre}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {new Date(event.date_debut).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={AlertTriangle}
                  title="Aucun événement"
                  description="Aucun événement à venir"
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button onClick={runSecurityTest} disabled={loading} className="h-12">
            {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Shield className="h-4 w-4 mr-2" />}
            Tests de Sécurité
          </Button>
          
          <Button onClick={testToastNotifications} variant="outline" className="h-12">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Test Notifications
          </Button>
          
          <Button onClick={() => setShowConfirm(true)} variant="outline" className="h-12">
            <CheckCircle className="h-4 w-4 mr-2" />
            Test Confirmation
          </Button>
        </div>

        {/* Security Test Results */}
        {testResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Résultats des Tests de Sécurité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                      <span className="font-medium">{result.test}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={result.severity === 'critical' ? 'destructive' : 'default'}>
                        {result.severity}
                      </Badge>
                      <Badge variant="outline" className="text-green-600">
                        {result.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            showSuccess("Confirmé", "Action confirmée avec succès");
            setShowConfirm(false);
          }}
          title="Confirmer l'action"
          description="Êtes-vous sûr de vouloir continuer ?"
          confirmLabel="Confirmer"
          cancelLabel="Annuler"
        />
      </div>
    </div>
  );
};

export default SecurityTest;
