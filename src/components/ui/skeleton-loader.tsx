
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'card' | 'avatar' | 'button';
  lines?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ 
  className, 
  variant = 'text',
  lines = 1 
}) => {
  const baseClasses = "animate-pulse bg-muted rounded";
  
  if (variant === 'text') {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div 
            key={i}
            className={cn(
              baseClasses,
              "h-4",
              i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn("space-y-3", className)}>
        <div className={cn(baseClasses, "h-4 w-1/2")} />
        <div className={cn(baseClasses, "h-20")} />
        <div className="space-y-2">
          <div className={cn(baseClasses, "h-3")} />
          <div className={cn(baseClasses, "h-3 w-4/5")} />
        </div>
      </div>
    );
  }

  if (variant === 'avatar') {
    return <div className={cn(baseClasses, "h-10 w-10 rounded-full", className)} />;
  }

  if (variant === 'button') {
    return <div className={cn(baseClasses, "h-10 w-24", className)} />;
  }

  return <div className={cn(baseClasses, "h-4", className)} />;
};

export default SkeletonLoader;
