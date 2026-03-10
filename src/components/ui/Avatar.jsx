import React from 'react';

const Avatar = ({ src, name = '', size = 'md', className = '', online = false }) => {
  const sizes = {
    xs: 'w-6 h-6 text-[8px]',
    sm: 'w-8 h-8 text-[10px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // Generate a consistent color from name
  const colors = ['#7c5cfc', '#00d4aa', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6', '#22c55e'];
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-border`}
        />
      ) : (
        <div
          className={`${sizes[size]} rounded-full flex items-center justify-center font-bold text-white ring-2 ring-border`}
          style={{ backgroundColor: bgColor }}
        >
          {initials || '?'}
        </div>
      )}
      {online && (
        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-bg-primary shadow-[0_0_6px_rgba(16,185,129,0.4)]" />
      )}
    </div>
  );
};

export default Avatar;
