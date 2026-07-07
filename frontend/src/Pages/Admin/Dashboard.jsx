import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import LoadingSkeleton from '../../Components/ui/LoadingSkeleton';
import EmptyState from '../../Components/ui/EmptyState';
import { 
    BookOpen, 
    Trophy, 
    FileText, 
    Layers, 
    Plus, 
    ChevronRight, 
    Edit, 
    Settings 
} from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentQuizzes, setRecentQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('/api/admin/quizzes');
                const quizzes = response.data.data || [];

                const totalQuizzes = quizzes.length;
                const publishedQuizzes = quizzes.filter(q => q.is_published).length;
                const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions_count || 0), 0);
                const totalAttempts = quizzes.reduce((sum, q) => sum + (q.attempts_count || 0), 0);

                setStats({
                    totalQuizzes,
                    publishedQuizzes,
                    totalQuestions,
                    totalAttempts
                });

                const sorted = [...quizzes].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setRecentQuizzes(sorted.slice(0, 5));

            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
                    <p className="text-gray-500 text-xs mt-1">Manage system quizzes, question builders, and review overall statistics.</p>
                </div>
                <div>
                    <Link
                        to="/admin/quizzes/create"
                        className="inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-500 active:scale-[0.98] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        Create Quiz
                    </Link>
                </div>
            </div>

            {/* Stats Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse h-24"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Quizzes" 
                        value={stats?.totalQuizzes} 
                        icon={<BookOpen className="w-5.5 h-5.5 text-primary-600" />}
                        bgColor="bg-primary-50"
                    />
                    <StatCard 
                        title="Published Quizzes" 
                        value={stats?.publishedQuizzes} 
                        icon={<Trophy className="w-5.5 h-5.5 text-emerald-600" />}
                        bgColor="bg-emerald-50"
                    />
                    <StatCard 
                        title="Total Questions" 
                        value={stats?.totalQuestions} 
                        icon={<Layers className="w-5.5 h-5.5 text-blue-600" />}
                        bgColor="bg-blue-50"
                    />
                    <StatCard 
                        title="Total Attempts" 
                        value={stats?.totalAttempts} 
                        icon={<FileText className="w-5.5 h-5.5 text-purple-600" />}
                        bgColor="bg-purple-50"
                    />
                </div>
            )}

            {/* Recent Quizzes List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100/60 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="text-sm font-bold text-gray-900">Recent Quizzes</h2>
                    <Link to="/admin/quizzes" className="text-xs font-semibold text-primary-600 hover:text-primary-500 flex items-center gap-0.5 transition">
                        View All Quizzes
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {loading ? (
                    <LoadingSkeleton type="table" rows={4} />
                ) : recentQuizzes.length === 0 ? (
                    <EmptyState 
                        message="You haven't created any quizzes yet." 
                        actionLabel="Create First Quiz" 
                        onAction={() => navigate('/admin/quizzes/create')}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/20">
                                <tr className="border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400">
                                    <th className="px-6 py-3.5">Title</th>
                                    <th className="px-6 py-3.5">Status</th>
                                    <th className="px-6 py-3.5 text-center">Questions</th>
                                    <th className="px-6 py-3.5 text-right pr-8">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentQuizzes.map(quiz => (
                                    <tr key={quiz.id} className="hover:bg-slate-50/40 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 text-sm">{quiz.title}</div>
                                            <div className="text-xs text-gray-400 font-medium truncate max-w-xs mt-0.5">{quiz.description || 'No description'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {quiz.is_published ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/50">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-xs font-semibold text-gray-700 bg-slate-50 border border-slate-100 px-2 py-1 rounded">
                                                {quiz.questions_count || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-8">
                                            <div className="flex justify-end gap-4">
                                                <Link 
                                                    to={`/admin/quizzes/${quiz.id}/edit`}
                                                    className="text-primary-600 hover:text-primary-500 text-xs font-bold flex items-center gap-1 transition"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                    Edit
                                                </Link>
                                                <Link 
                                                    to={`/admin/quizzes/${quiz.id}/questions`}
                                                    className="text-gray-600 hover:text-gray-900 text-xs font-bold flex items-center gap-1 transition"
                                                >
                                                    <Settings className="w-3.5 h-3.5 text-gray-400" />
                                                    Questions
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, bgColor }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between shadow-sm hover:border-slate-200 transition-all duration-300">
            <div className="space-y-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">{title}</span>
                <span className="text-3xl font-black text-gray-900 block leading-none">{value ?? 0}</span>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgColor}`}>
                {icon}
            </div>
        </div>
    );
}
