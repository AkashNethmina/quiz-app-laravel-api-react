import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';

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
            // Attempt object returned from API
            const attemptData = res.data.data || res.data;
            const attemptId = attemptData.id;
            navigate(`/quizzes/${id}/play`, { state: { attemptId, attemptData } });
        } catch (error) {
            console.error("Failed to start quiz", error);
            alert("Error starting quiz. Please try again.");
        } finally {
            setStartingId(null);
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Quizzes</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                            <div className="flex gap-2 mb-6">
                                <div className="h-5 bg-gray-200 rounded w-20"></div>
                                <div className="h-5 bg-gray-200 rounded w-24"></div>
                            </div>
                            <div className="h-10 bg-gray-200 rounded w-full"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Quizzes</h1>

            {quizzes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
                    No quizzes available yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {quizzes.map((quiz) => (
                        <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">{quiz.title}</h2>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">
                                {quiz.description}
                            </p>
                            
                            <div className="flex items-center gap-2 mb-6">
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-medium flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    {quiz.time_limit} seconds
                                </span>
                                <span className="bg-indigo-50 text-indigo-600 text-xs px-2 py-1 rounded-md font-medium">
                                    {quiz.questions_count ?? 0} questions
                                </span>
                            </div>

                            <button
                                onClick={() => handleStartQuiz(quiz.id)}
                                disabled={startingId === quiz.id}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                            >
                                {startingId === quiz.id ? 'Starting...' : 'Start Quiz'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
