import React from 'react';

const CollabCursors = ({ cursors }) => {
  if (!cursors || cursors.length === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute z-50 transition-all duration-100"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
          }}
        >
          {/* Cursor indicator */}
          <svg
            width="12"
            height="20"
            viewBox="0 0 12 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ color: cursor.color }}
          >
            <path
              d="M1 1L4.5 18.5L6.5 13.5L11.5 13.5L1 1Z"
              fill="currentColor"
              stroke="white"
              strokeWidth="1"
            />
          </svg>
          
          {/* User name label */}
          <div
            className="ml-3 px-2 py-0.5 rounded text-xs font-medium text-white whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollabCursors;
