import React from 'react';

const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  className = '',
  icon,
  hint,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-text-secondary mb-2 tracking-wide">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-accent transition-colors duration-200 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-3 bg-bg-input border border-border rounded-xl
            text-text-primary text-sm placeholder:text-text-muted/40
            focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent/50
            transition-all duration-200
            hover:border-border-hover
            disabled:opacity-50 disabled:cursor-not-allowed
            ${icon ? 'pl-11' : ''}
            ${error ? 'border-danger/40 focus:ring-danger/15 focus:border-danger/50' : ''}
            ${className}
          `}
          {...props}
        />
        {/* Focus glow */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: error ? '0 0 0 4px rgba(239,68,68,0.06)' : '0 0 0 4px rgba(124,92,252,0.06)' }}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger font-medium flex items-center gap-1">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-text-muted">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
