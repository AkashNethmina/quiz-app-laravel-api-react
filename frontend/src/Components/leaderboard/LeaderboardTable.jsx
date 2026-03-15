import React from 'react';
import RankBadge from './RankBadge';
import PlayerCell from './PlayerCell';

export default function LeaderboardTable({ entries, type, isLoading, currentUserId }) {
    if (isLoading) {
        return (
            <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded w-full"></div>
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-14 bg-gray-100 rounded w-full"></div>
                ))}
            </div>
        );
    }

    if (!entries || entries.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No scores yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                    {type === 'global' ? "Be the first to complete a quiz!" : "No attempts for this quiz yet."}
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg overflow-hidden flex flex-col min-w-full">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                        {type === 'global' ? (
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-24">Rank</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Player</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Quizzes Completed</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total Score</th>
                            </tr>
                        ) : (
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-24">Rank</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Player</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Score</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Time</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                            </tr>
                        )}
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {entries.map((entry, index) => {
                            const isMe = currentUserId === entry.user_id;
                            
                            // Handling rank display
                            // If rank is provided by backend use it, otherwise use based on array index (mostly arrays are already sorted or backend gives rank)
                            // Assuming backend returns a 'rank' field, if not, use index + 1
                            const rank = entry.rank !== undefined ? entry.rank : index + 1;

                            return (
                                <tr key={`${entry.user_id}-${entry.id || index}`} className={isMe ? 'bg-indigo-50' : 'hover:bg-gray-50'}>
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                                        <RankBadge rank={rank} />
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        <PlayerCell name={entry.user_name || entry.user?.name || entry.name} isMe={isMe} />
                                    </td>
                                    
                                    {type === 'global' ? (
                                        <>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {entry.quizzes_completed}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`${entry.total_score > 0 ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}`}>
                                                    {entry.total_score}
                                                </span>
                                            </td>
                                        </>
                                    ) : (
                                        <>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`${entry.score > 0 ? 'text-green-600 font-bold' : 'text-red-500 font-bold'}`}>
                                                    {entry.score}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {entry.submitted_at 
                                                    ? new Date(entry.submitted_at).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) 
                                                    : '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                {entry.status === 'timed_out' || entry.timed_out === true ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Timed out
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
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
