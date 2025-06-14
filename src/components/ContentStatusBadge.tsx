
import { Badge } from "@/components/ui/badge";

interface ContentStatusBadgeProps {
  status: string;
}

const ContentStatusBadge = ({ status }: ContentStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'draft':
        return { label: 'Brouillon', variant: 'secondary' as const, className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };
      case 'pending_review':
        return { label: 'En attente', variant: 'default' as const, className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' };
      case 'approved':
        return { label: 'Approuvé', variant: 'default' as const, className: 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' };
      case 'rejected':
        return { label: 'Rejeté', variant: 'destructive' as const, className: 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300' };
      case 'published':
        return { label: 'Publié', variant: 'default' as const, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' };
      default:
        return { label: status, variant: 'secondary' as const, className: '' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
};

export default ContentStatusBadge;
