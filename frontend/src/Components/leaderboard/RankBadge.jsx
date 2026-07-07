import React from 'react';
import { Trophy } from 'lucide-react';

export default function RankBadge({ rank }) {
    if (rank === 1) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-yellow-50 text-yellow-700 border border-yellow-200/50">
                <Trophy className="w-3 h-3 text-yellow-500 fill-current" />
                1st
            </span>
        );
    }
    if (rank === 2) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/50">
                <Trophy className="w-3 h-3 text-slate-400 fill-current" />
                2nd
            </span>
        );
    }
    if (rank === 3) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200/50">
                <Trophy className="w-3 h-3 text-emerald-500 fill-current" />
                3rd
            </span>
        );
    }

    return (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-50 text-xs font-bold text-gray-500 border border-slate-100">
            {rank}
        </span>
    );
}
