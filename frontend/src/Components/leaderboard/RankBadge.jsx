import React from 'react';

export default function RankBadge({ rank }) {
    if (rank === 1) return <span className="text-xl" title="1st Place">🥇 1</span>;
    if (rank === 2) return <span className="text-xl" title="2nd Place">🥈 2</span>;
    if (rank === 3) return <span className="text-xl" title="3rd Place">🥉 3</span>;

    return <span className="text-gray-500 font-medium pl-2">{rank}</span>;
}
