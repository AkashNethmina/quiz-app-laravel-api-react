import React from 'react';
import RankBadge from './RankBadge';
import PlayerCell from './PlayerCell';
import { Clock, ShieldAlert, Award } from 'lucide-react';

export default function LeaderboardTable({ entries, type, isLoading, currentUserId }) {
    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
                <div className="h-12 bg-slate-50 border-b border-gray-100 w-full"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 border-b border-gray-50 w-full flex items-center px-6 justify-between">
                        <div className="h-4 bg-gray-100 rounded w-16"></div>
                        <div className="h-4 bg-gray-100 rounded w-32"></div>
                        <div className="h-4 bg-gray-100 rounded w-24"></div>
                        <div className="h-4 bg-gray-100 rounded w-12"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!entries || entries.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto">
                <Award className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-sm font-semibold text-gray-900">No standings recorded</h3>
                <p className="text-xs text-gray-500 mt-1">
                    {type === 'global' ? "Be the first to complete a quiz attempt!" : "No players have completed this quiz yet."}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-w-full">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-slate-50">
                        {type === 'global' ? (
                            <tr>
                                <th scope="col" className="py-4 pl-6 pr-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-24">Rank</th>
                                <th scope="col" className="px-3 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Player</th>
                                <th scope="col" className="px-3 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Completed</th>
                                <th scope="col" className="px-3 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Score</th>
                            </tr>
                        ) : (
                            <tr>
                                <th scope="col" className="py-4 pl-6 pr-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider w-24">Rank</th>
                                <th scope="col" className="px-3 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Player</th>
                                <th scope="col" className="px-3 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Score</th>
                                <th scope="col" className="px-3 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Submitted</th>
                                <th scope="col" className="px-3 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        )}
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {entries.map((entry, index) => {
                            const isMe = currentUserId === entry.user_id;
                            const rank = entry.rank !== undefined ? entry.rank : index + 1;

                            return (
                                <tr key={`${entry.user_id}-${entry.id || index}`} className={`transition ${isMe ? 'bg-primary-50/50 hover:bg-primary-50' : 'hover:bg-slate-50/40'}`}>
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm">
                                        <RankBadge rank={rank} />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold">
                                        <PlayerCell name={entry.user_name || entry.user?.name || entry.name} isMe={isMe} />
                                    </td>
                                    
                                    {type === 'global' ? (
                                        <>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-500">
                                                {entry.quizzes_completed} quizzes
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-900">
                                                {entry.total_score} pts
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-900">
                                                {entry.score} pts
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400 font-semibold">
                                                {entry.submitted_at 
                                                    ? new Date(entry.submitted_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) 
                                                    : '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                {entry.status === 'timed_out' || entry.timed_out === true ? (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-100">
                                                        Timed out
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                        Completed
                                                    </span>
                                                )}
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
