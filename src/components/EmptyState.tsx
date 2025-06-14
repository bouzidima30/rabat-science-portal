
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className = ""
}: EmptyStateProps) => {
  return (
    <Card className={`border-0 shadow-lg ${className}`}>
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
            <Icon className="h-12 w-12 text-gray-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md">
              {description}
            </p>
          </div>
          {actionLabel && onAction && (
            <Button onClick={onAction} className="bg-blue-600 hover:bg-blue-700">
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
