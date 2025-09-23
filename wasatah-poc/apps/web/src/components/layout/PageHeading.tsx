import type { ReactNode } from 'react';

interface PageHeadingProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

const PageHeading = ({ title, subtitle, children, className = '' }: PageHeadingProps) => {
  return (
    <div className={`page-header ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">{title}</h1>
          {subtitle && <p className="page-subtitle">{subtitle}</p>}
        </div>
        {children && <div className="flex items-center space-x-3">{children}</div>}
      </div>
    </div>
  );
};

export default PageHeading;
