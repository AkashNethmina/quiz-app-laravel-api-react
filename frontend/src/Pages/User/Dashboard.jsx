import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../lib/axios';

export default function UserDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        quizzesAvailable: 0,
        bestScore: 0,
        quizzesCompleted: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch quizzes for count
                const quizzesRes = await axios.get('/api/quizzes');
                const availableCount = quizzesRes.data.data?.length || 0;

                // Fetch personal leaderboard stats
                // The prompt mentions /api/leaderboard/me returns highest score and count
                const leaderRes = await axios.get('/api/leaderboard/me');
                
                let best = 0;
                let completed = 0;

                // Depending on the exact API response for /leaderboard/me
                // Assume the API returns an array of attempts or an object with { highest_score, total_attempts }
                if (leaderRes.data) {
                    // Let's assume standard response structure from Laravel Phase 6 or similar
                    best = leaderRes.data.highest_score ?? 0;
                    completed = leaderRes.data.total_attempts ?? 0;
                    
                    // Fallback to array if it returns list of attempts
                    if (Array.isArray(leaderRes.data.data)) {
                        completed = leaderRes.data.data.length;
                        best = Math.max(0, ...leaderRes.data.data.map(a => a.score));
                    }
                }

                setStats({
                    quizzesAvailable: availableCount,
                    bestScore: best,
                    quizzesCompleted: completed,
                });
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Welcome back, {user?.name}
            </h1>

            {loading ? (
                <div className="animate-pulse flex space-x-6">
                    <div className="flex-1 bg-gray-200 h-32 rounded-xl"></div>
                    <div className="flex-1 bg-gray-200 h-32 rounded-xl"></div>
                    <div className="flex-1 bg-gray-200 h-32 rounded-xl"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Stat Card 1 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Quizzes Available
                        </div>
                        <div className="text-3xl font-bold text-indigo-600">
                            {stats.quizzesAvailable}
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Your Best Score
                        </div>
                        <div className="text-3xl font-bold text-green-500">
                            {stats.bestScore}
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
                            Quizzes Completed
                        </div>
                        <div className="text-3xl font-bold text-gray-900">
                            {stats.quizzesCompleted}
                        </div>
                    </div>
                </div>
            )}

            <div>
                <Link
                    to="/quizzes"
                    className="inline-flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition"
                >
                    Browse Quizzes
                </Link>
            </div>
        </div>
    );
}
