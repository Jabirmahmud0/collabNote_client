import React from 'react';

const TagBadge = ({ tag, active = false, onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`cn-tag cursor-pointer transition-all ${active ? 'bg-accent/20 border-accent/30' : 'hover:bg-accent/15'} ${className}`}
    >
      {tag}
    </button>
  );
};

export default TagBadge;
