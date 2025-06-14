
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const MobileLayout = ({ 
  children, 
  className,
  padding = 'md'
}: MobileLayoutProps) => {
  const paddingClasses = {
    none: '',
    sm: 'px-2 py-2',
    md: 'px-4 py-4',
    lg: 'px-6 py-6'
  };

  return (
    <div className={cn(
      'w-full min-h-screen',
      'flex flex-col',
      paddingClasses[padding],
      className
    )}>
      {children}
    </div>
  );
};

export default MobileLayout;
