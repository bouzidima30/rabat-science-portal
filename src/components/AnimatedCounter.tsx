import React from 'react';
import { useCountUp } from '@/hooks/useCountUp';
import { LucideIcon } from 'lucide-react';

interface AnimatedCounterProps {
  icon: LucideIcon;
  value: number;
  suffix?: string;
  label: string;
  color: string;
  bgColor: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ icon: Icon, value, suffix = '', label, color, bgColor }) => {
  const { ref, displayValue, hasStarted } = useCountUp({ end: value, suffix, duration: 2200 });

  return (
    <div
      ref={ref}
      className={`group relative text-center p-6 rounded-2xl bg-card border border-border/50 hover:border-border hover:shadow-xl transition-all duration-500 overflow-hidden ${
        hasStarted ? 'animate-fade-in' : 'opacity-0'
      }`}
    >
      {/* Decorative gradient blob */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 ${bgColor} rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
      
      <div className={`relative w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`h-7 w-7 ${color}`} />
      </div>
      <div className="relative text-4xl font-extrabold text-foreground mb-1 tabular-nums">
        {displayValue}
      </div>
      <div className="relative text-sm font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

export default AnimatedCounter;
