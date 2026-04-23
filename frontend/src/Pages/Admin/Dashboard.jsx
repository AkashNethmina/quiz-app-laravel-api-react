import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../lib/axios';
import LoadingSkeleton from '../../Components/ui/LoadingSkeleton';
import EmptyState from '../../Components/ui/EmptyState';

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [recentQuizzes, setRecentQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all quizzes from admin endpoint to derive stats
                const response = await axios.get('/api/admin/quizzes');
                const quizzes = response.data.data || [];

                // Calculate stats
                const totalQuizzes = quizzes.length;
                const publishedQuizzes = quizzes.filter(q => q.is_published).length;
                
                // Assuming questions_count is populated
                const totalQuestions = quizzes.reduce((sum, q) => sum + (q.questions_count || 0), 0);
                
                const totalAttempts = quizzes.reduce((sum, q) => sum + (q.attempts_count || 0), 0);

                setStats({
                    totalQuizzes,
                    publishedQuizzes,
                    totalQuestions,
                    totalAttempts
                });

                // Grab 5 most recent
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
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <Link
                    to="/admin/quizzes/create"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                    Create Quiz
                </Link>
            </div>

            {loading ? (
                <div className="mb-8">
                    <LoadingSkeleton type="stat" rows={4} />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Quizzes" value={stats?.totalQuizzes} />
                    <StatCard title="Published" value={stats?.publishedQuizzes} color="text-green-600" />
                    <StatCard title="Total Questions" value={stats?.totalQuestions} />
                    <StatCard title="Total Attempts" value={stats?.totalAttempts} />
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Quizzes</h2>
                    <Link to="/admin/quizzes" className="text-sm font-medium text-primary-600 hover:text-primary-800">
                        View All
                    </Link>
                </div>

                {loading ? (
                    <LoadingSkeleton type="table" rows={5} />
                ) : recentQuizzes.length === 0 ? (
                    <EmptyState 
                        message="You haven't created any quizzes yet." 
                        actionLabel="Create First Quiz" 
                        onAction={() => window.location.href = '/admin/quizzes/create'}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-200 text-xs uppercase text-gray-500 bg-white">
                                    <th className="px-6 py-3 font-medium">Title</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-center">Questions</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentQuizzes.map(quiz => (
                                    <tr key={quiz.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{quiz.title}</div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">{quiz.description}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {quiz.is_published ? (
                                                <span className="bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-medium">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-medium text-gray-700">
                                                {quiz.questions_count || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-3">
                                                <Link 
                                                    to={`/admin/quizzes/${quiz.id}/edit`}
                                                    className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                                                >
                                                    Edit
                                                </Link>
                                                <Link 
                                                    to={`/admin/quizzes/${quiz.id}/questions`}
                                                    className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                                                >
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

function StatCard({ title, value, color = "text-primary-600" }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-center">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {title}
            </div>
            <div className={`text-3xl font-bold ${color}`}>
                {value}
            </div>
        </div>
    );
}
