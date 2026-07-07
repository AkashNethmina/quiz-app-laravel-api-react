import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import axios from '../../lib/axios';
import { BookOpen, Trophy, CheckCircle, ArrowRight } from 'lucide-react';

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
                const leaderRes = await axios.get('/api/leaderboard/me');
                
                let best = 0;
                let completed = 0;

                if (leaderRes.data) {
                    best = leaderRes.data.highest_score ?? 0;
                    completed = leaderRes.data.total_attempts ?? 0;
                    
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
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl">
                {/* Decorative glow */}
                <div className="absolute right-0 top-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-primary-500/20 blur-2xl"></div>
                
                <div className="relative z-10 max-w-xl space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary-400">Welcome Back</span>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Ready for your next challenge, {user?.name}?
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                        Track your score records, review quiz details, and test your knowledge against other players on the leaderboard.
                    </p>
                </div>
            </div>

            {/* Loading / Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-28"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stat Card 1 */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between group hover:border-primary-200 transition-all duration-300">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Available Quizzes</span>
                            <span className="text-3xl font-black text-slate-900 block">{stats.quizzesAvailable}</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                            <BookOpen className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between group hover:border-emerald-200 transition-all duration-300">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Best Score</span>
                            <span className="text-3xl font-black text-emerald-600 block">{stats.bestScore}</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Trophy className="w-6 h-6" />
                        </div>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all duration-300">
                        <div className="space-y-1">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Quizzes Completed</span>
                            <span className="text-3xl font-black text-slate-900 block">{stats.quizzesCompleted}</span>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-bold text-gray-900">Explore and take quizzes</h3>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Test your analytical speed and accuracy on different subjects.</p>
                </div>
                <Link
                    to="/quizzes"
                    className="inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-500 active:scale-[0.98] text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200"
                >
                    Browse Quizzes
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
