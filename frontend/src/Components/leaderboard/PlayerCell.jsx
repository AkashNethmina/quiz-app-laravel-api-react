import React from 'react';

export default function PlayerCell({ name, isMe }) {
    // Generate initials (first letter of first and last name, or first two letters)
    const getInitials = (nameStr) => {
        if (!nameStr) return '?';
        const parts = nameStr.trim().split(' ').filter(Boolean);
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return nameStr.substring(0, 2).toUpperCase();
    };

    const initials = getInitials(name);

    return (
        <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-medium text-white">{initials}</span>
            </div>
            <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${isMe ? 'text-primary-900' : 'text-gray-900'}`}>
                    {name}
                </span>
                {isMe && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-700">
                        You
                    </span>
                )}
            </div>
        </div>
    );
}
