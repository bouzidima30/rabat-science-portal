import { Suspense } from "react";
import LoadingSpinner from "./LoadingSpinner";

interface LoadingSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const LoadingSuspense = ({ children, fallback }: LoadingSuspenseProps) => {
  return (
    <Suspense
      fallback={
        fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <LoadingSpinner />
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
};

export default LoadingSuspense;