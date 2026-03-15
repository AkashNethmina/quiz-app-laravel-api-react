import React, { useState, useEffect } from 'react';
import axios from '../lib/axios';

export default function ProfilePage() {
    const [stats, setStats] = useState({
        total_attempts: 0,
        best_score: 0,
        average_score: 0
    });
    const [recentAttempts, setRecentAttempts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get('/api/leaderboard/me');
                const data = response.data;
                // Assuming backend returns an object with stats and recent_attempts array
                setStats({
                    total_attempts: data.stats?.total_attempts || 0,
                    best_score: data.stats?.best_score || 0,
                    average_score: data.stats?.average_score || 0
                });
                setRecentAttempts(data.recent_attempts || []);
            } catch (error) {
                console.error('Error fetching profile data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white overflow-hidden shadow rounded-lg h-24"></div>
                    ))}
                </div>
                <div className="h-64 bg-gray-100 rounded"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">My Profile</h1>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-10">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Attempts</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.total_attempts}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Best Score</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.best_score}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
                        <dd className="mt-1 text-3xl font-semibold text-indigo-600">
                            {Number(stats.average_score).toFixed(1)}
                        </dd>
                    </div>
                </div>
            </div>

            {/* Recent Attempts Table */}
            <div>
                <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">My Scores</h2>
                
                {recentAttempts.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No attempts yet</h3>
                        <p className="mt-1 text-sm text-gray-500">You haven't completed any quizzes yet.</p>
                    </div>
                ) : (
                    <div className="bg-white shadow-sm ring-1 ring-gray-200 sm:rounded-lg overflow-hidden flex flex-col min-w-full">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-300">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Quiz</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Score</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Correct</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Incorrect</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {recentAttempts.map((attempt) => (
                                        <tr key={attempt.id} className="hover:bg-gray-50">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                {attempt.quiz?.title || 'Unknown Quiz'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                <span className={`${attempt.score > 0 ? 'text-green-600' : 'text-red-500'} font-bold`}>
                                                    {attempt.score}
                                                </span>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {attempt.correct_answers || 0}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {attempt.incorrect_answers || 0}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                                {attempt.submitted_at 
                                                    ? new Date(attempt.submitted_at).toLocaleDateString() 
                                                    : '-'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                {attempt.status === 'timed_out' || attempt.timed_out === true ? (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        Timed out
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Completed
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
