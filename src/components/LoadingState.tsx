
import LoadingSpinner from "./LoadingSpinner";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingState = ({ message = "Chargement...", fullPage = false }: LoadingStateProps) => {
  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" className="border-blue-600" />
            <p className="text-gray-600 dark:text-gray-300">{message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" className="border-blue-600" />
        <p className="text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default LoadingState;
