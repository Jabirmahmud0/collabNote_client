import React from 'react';
import Avatar from '../ui/Avatar';

const PresenceBar = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <div className="h-12 bg-bg-secondary border-b border-border flex items-center px-4">
        <span className="text-sm text-text-secondary">No other collaborators online</span>
      </div>
    );
  }

  return (
    <div className="h-12 bg-bg-secondary border-b border-border flex items-center px-4 gap-2">
      <span className="text-sm text-text-secondary mr-2">
        {users.length} {users.length === 1 ? 'collaborator' : 'collaborators'} online:
      </span>
      <div className="flex -space-x-2">
        {users.map((user) => (
          <div
            key={user.userId}
            className="relative group"
            title={`${user.userName} (${user.color})`}
          >
            <Avatar
              name={user.userName}
              size="sm"
              className="border-2 border-bg-secondary"
              style={{
                backgroundColor: user.color + '20',
                color: user.color,
              }}
            />
            <div
              className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success rounded-full border-2 border-bg-secondary"
              title="Online"
            />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-bg-card border border-border rounded text-xs text-primary whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {user.userName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresenceBar;
