import type { ReactNode } from 'react';

interface SectionProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
}

const Section = ({ 
  title, 
  subtitle, 
  children, 
  className = '', 
  headerClassName = '',
  bodyClassName = ''
}: SectionProps) => {
  return (
    <div className={`section ${className}`}>
      {(title || subtitle) && (
        <div className={`section-header ${headerClassName}`}>
          {title && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
};

export default Section;
