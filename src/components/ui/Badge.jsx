import React from 'react';

const Badge = ({ children, variant = 'default', size = 'sm', className = '', dot = false }) => {
  const variants = {
    default: 'bg-bg-tertiary text-text-secondary border-border',
    accent: 'bg-accent-light text-accent border-accent/15',
    success: 'bg-success/10 text-success border-success/15',
    warning: 'bg-warning/10 text-warning border-warning/15',
    danger: 'bg-danger/10 text-danger border-danger/15',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[9px]',
    sm: 'px-2.5 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-xs',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border transition-colors ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${
          variant === 'accent' ? 'bg-accent' :
          variant === 'success' ? 'bg-success' :
          variant === 'warning' ? 'bg-warning' :
          variant === 'danger' ? 'bg-danger' :
          'bg-text-muted'
        }`} />
      )}
      {children}
    </span>
  );
};

export default Badge;
