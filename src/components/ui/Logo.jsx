import React from 'react';

export const LogoIcon = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="collab-gradient-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        <linearGradient id="collab-gradient-sparkle" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <linearGradient id="collab-gradient-surface" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.03" />
        </linearGradient>
        <filter id="collab-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Rounded Squircle Container */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="13"
        fill="url(#collab-gradient-primary)"
      />
      {/* Specular Highlight Overlay */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="13"
        fill="url(#collab-gradient-surface)"
      />
      <rect
        x="2.5"
        y="2.5"
        width="43"
        height="43"
        rx="12.5"
        stroke="rgba(255, 255, 255, 0.35)"
        strokeWidth="1"
      />

      {/* Modern Folded Note / Layer Path */}
      <path
        d="M14 15C14 13.3431 15.3431 12 17 12H27L34 19V33C34 34.6569 32.6569 36 31 36H17C15.3431 36 14 34.6569 14 33V15Z"
        fill="white"
        fillOpacity="0.95"
      />
      {/* Folded Corner */}
      <path
        d="M27 12V17C27 18.1046 27.8954 19 29 19H34L27 12Z"
        fill="#DDD6FE"
      />

      {/* Note Horizontal Line Bars */}
      <rect x="18" y="22" width="12" height="2" rx="1" fill="#6366F1" fillOpacity="0.8" />
      <rect x="18" y="27" width="8" height="2" rx="1" fill="#8B5CF6" fillOpacity="0.8" />

      {/* Real-time Collaboration Nodes / Pulse Dot */}
      <circle cx="34" cy="34" r="5.5" fill="#0EA5E9" stroke="white" strokeWidth="2" />
      <circle cx="34" cy="34" r="2" fill="white" />
    </svg>
  );
};

export const Logo = ({ size = 'md', showText = true, subtitle = null, className = '' }) => {
  const iconSizes = {
    xs: 24,
    sm: 28,
    md: 36,
    lg: 44,
    xl: 52,
  };

  const textSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  const iconPx = typeof size === 'number' ? size : iconSizes[size] || 36;

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <LogoIcon size={iconPx} className="shadow-lg shadow-indigo-500/20" />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-black tracking-tight text-text-primary leading-none ${typeof size === 'string' ? textSizes[size] : 'text-lg'}`}>
            Collab<span className="text-accent">Note</span>
          </span>
          {subtitle && (
            <span className="text-[11px] font-medium text-text-muted tracking-wide mt-1">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Logo;
