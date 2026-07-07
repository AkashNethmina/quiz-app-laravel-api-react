import React from 'react';

export default function PlayerCell({ name, isMe }) {
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
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary-600 to-emerald-400 flex items-center justify-center shrink-0 shadow-sm shadow-primary-500/10">
                <span className="text-xs font-bold text-white tracking-wider">{initials}</span>
            </div>
            <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isMe ? 'text-primary-950 font-bold' : 'text-gray-900'}`}>
                    {name}
                </span>
                {isMe && (
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-primary-100 text-primary-800">
                        You
                    </span>
                )}
            </div>
        </div>
    );
}
