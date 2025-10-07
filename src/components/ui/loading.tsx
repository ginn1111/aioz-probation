import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const Loading = ({
  children,
  isLoading,
  className = '',
}: {
  children: ReactNode;
  isLoading: boolean;
  className?: string;
}) => {
  return (
    <div
      className={cn(className, {
        'loading-skeleton grayscale-80': isLoading,
      })}
    >
      {children}
    </div>
  );
};

export default Loading;
