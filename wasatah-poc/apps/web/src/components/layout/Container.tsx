import type { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl' | '8xl' | 'full';
}

const Container = ({ children, className = '', maxWidth = '6xl' }: ContainerProps) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '6xl': 'max-w-6xl',
    '8xl': 'max-w-8xl',
    full: 'max-w-full',
  };

  return (
    <div className={`container ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
};

export default Container;
