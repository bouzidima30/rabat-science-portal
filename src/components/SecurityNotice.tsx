import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Mail } from "lucide-react";

interface SecurityNoticeProps {
  type: 'email-protected' | 'login-required';
  className?: string;
}

export const SecurityNotice: React.FC<SecurityNoticeProps> = ({ type, className = "" }) => {
  if (type === 'email-protected') {
    return (
      <Alert className={`border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-900/50 dark:text-amber-200 ${className}`}>
        <Mail className="h-4 w-4" />
        <AlertDescription>
          L'email du coordinateur est protégé. Connectez-vous pour accéder aux informations de contact.
        </AlertDescription>
      </Alert>
    );
  }

  if (type === 'login-required') {
    return (
      <Alert className={`border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/50 dark:text-blue-200 ${className}`}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Connectez-vous pour accéder aux informations complètes et aux détails de contact.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};