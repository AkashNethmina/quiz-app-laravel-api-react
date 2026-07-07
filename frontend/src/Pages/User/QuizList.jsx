import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import PrimaryButton from '../../Components/PrimaryButton';
import { Clock, HelpCircle, ArrowRight } from 'lucide-react';

export default function QuizListPage() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startingId, setStartingId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const res = await axios.get('/api/quizzes');
                setQuizzes(res.data.data || []);
            } catch (error) {
                console.error("Failed to load quizzes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    const handleStartQuiz = async (id) => {
        setStartingId(id);
        try {
            const res = await axios.post(`/api/quizzes/${id}/start`);
            const attemptData = res.data.data || res.data;
            const attemptId = attemptData.attempt_id;
            navigate(`/quizzes/${id}/play`, { state: { attemptId, attemptData } });
        } catch (error) {
            console.error("Failed to start quiz", error);
            alert("Error starting quiz. Please try again.");
        } finally {
            setStartingId(null);
        }
    };

    const formatTime = (seconds) => {
        if (!seconds) return "0s";
        if (seconds >= 60) {
            const minutes = seconds / 60;
            return `${minutes}m`;
        }
        return `${seconds}s`;
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Available Quizzes</h1>
                        <p className="text-gray-500 text-xs mt-1">Select a topic below to test your abilities.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse flex flex-col justify-between h-48">
                            <div>
                                <div className="h-6 bg-gray-100 rounded-lg w-3/4 mb-3"></div>
                                <div className="h-4 bg-gray-100 rounded-lg w-full mb-2"></div>
                                <div className="h-4 bg-gray-100 rounded-lg w-5/6"></div>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <div className="h-9 bg-gray-100 rounded-lg w-20"></div>
                                <div className="h-9 bg-gray-100 rounded-lg w-24"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Available Quizzes</h1>
                <p className="text-gray-500 text-xs mt-1">Challenge yourself with various topics and see how you rank.</p>
            </div>

            {quizzes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-500 shadow-sm">
                    <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-sm font-semibold text-gray-900">No quizzes available</h3>
                    <p className="text-xs text-gray-500 mt-1">There are no quizzes engineered on this server yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-primary-100 hover:-translate-y-0.5 transition-all duration-300">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary-600 transition-colors">{quiz.title}</h2>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 line-clamp-2">
                                    {quiz.description || "No description provided for this quiz."}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                                <div className="flex items-center gap-3">
                                    <span className="bg-slate-50 border border-slate-100 text-gray-600 text-xs px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatTime(quiz.time_limit_seconds || quiz.time_limit)}
                                    </span>
                                    <span className="bg-primary-50 text-primary-700 text-xs px-2.5 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                                        <HelpCircle className="w-3.5 h-3.5 text-primary-500" />
                                        {quiz.questions_count ?? 0} Questions
                                    </span>
                                </div>

                                <button
                                    onClick={() => handleStartQuiz(quiz.id)}
                                    disabled={startingId !== null}
                                    className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition-all"
                                >
                                    {startingId === quiz.id ? 'Starting...' : 'Start'}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
