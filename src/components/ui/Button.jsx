import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon,
  ...props
}) => {
  const base = 'group relative inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none select-none';

  const variants = {
    primary: 'bg-accent hover:bg-accent-hover text-white rounded-xl shadow-[0_4px_16px_var(--accent-glow)] hover:shadow-[0_8px_32px_var(--accent-glow)] active:scale-[0.97] border border-white/10',
    secondary: 'bg-bg-tertiary hover:bg-bg-elevated text-text-primary rounded-xl border border-border hover:border-border-hover active:scale-[0.97] shadow-sm',
    outline: 'bg-transparent border border-border text-text-secondary hover:text-text-primary hover:border-accent hover:bg-accent-light rounded-xl active:scale-[0.97]',
    danger: 'bg-danger/10 text-danger hover:bg-danger hover:text-white border border-danger/20 hover:border-danger rounded-xl active:scale-[0.97] transition-colors',
    glass: 'glass hover:bg-border text-text-primary rounded-xl active:scale-[0.97]',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-border rounded-xl active:scale-[0.97]',
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs gap-1.5',
    sm: 'px-4 py-2 text-xs gap-2',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-sm gap-2.5',
    xl: 'px-9 py-4 text-base gap-3',
  };

  return (
    <motion.button
      whileTap={!disabled && !loading ? { scale: 0.96 } : {}}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-20" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      {!loading && icon && <span className="shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
};

export default Button;
