
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useMobileDetection } from '@/hooks/useMobileDetection';

interface ResponsiveContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  centered?: boolean;
}

const ResponsiveContainer = ({ 
  children, 
  className,
  maxWidth = 'xl',
  centered = true
}: ResponsiveContainerProps) => {
  const { isMobile } = useMobileDetection();

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'w-full',
      maxWidthClasses[maxWidth],
      centered && 'mx-auto',
      isMobile ? 'px-4' : 'px-6 lg:px-8',
      className
    )}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;
