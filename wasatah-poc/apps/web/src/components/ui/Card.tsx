import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = '', hover = false, onClick }: CardProps) => {
  const baseClasses = 'card';
  const hoverClasses = hover ? 'hover:shadow-medium transition-shadow cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return (
    <div className={`card-header ${className}`}>
      {children}
    </div>
  );
};

const CardBody = ({ children, className = '' }: CardBodyProps) => {
  return (
    <div className={`card-body ${className}`}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return (
    <div className={`card-footer ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardHeader, CardBody, CardFooter };
