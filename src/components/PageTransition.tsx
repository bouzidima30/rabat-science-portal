import React, { Suspense } from 'react';
import TopBar from './TopBar';
import ModernNavbar from './ModernNavbar';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';

interface PageTransitionProps {
  children: React.ReactNode;
}

const FullPageLoader = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
    <TopBar />
    <ModernNavbar />
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" className="border-[#006be5]" />
        <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
      </div>
    </div>
    <Footer />
  </div>
);

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  return (
    <Suspense fallback={<FullPageLoader />}>
      {children}
    </Suspense>
  );
};

export default PageTransition;