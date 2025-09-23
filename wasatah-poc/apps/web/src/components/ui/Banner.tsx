import type { ReactNode } from 'react';

type BannerVariant = 'info' | 'success' | 'warning' | 'danger';

interface BannerProps {
  children: ReactNode;
  variant?: BannerVariant;
  className?: string;
  onClose?: () => void;
}

const Banner = ({ children, variant = 'info', className = '', onClose }: BannerProps) => {
  const variantClasses = {
    info: 'banner-info',
    success: 'banner-success',
    warning: 'banner-warning',
    danger: 'banner-danger',
  };

  return (
    <div className={`banner ${variantClasses[variant]} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {children}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-4 flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Close banner"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Banner;
