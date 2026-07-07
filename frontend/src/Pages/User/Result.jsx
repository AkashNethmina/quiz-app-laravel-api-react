import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../lib/axios';

export default function ResultPage() {
    const { id: attemptId } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await axios.get(`/api/attempts/${attemptId}/result`);
                setResult(res.data.data || res.data);
            } catch (error) {
                console.error("Failed to fetch result", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [attemptId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="text-center p-8 text-gray-500">
                Result not found.
            </div>
        );
    }

    // Determine colors
    const isPositive = result.score > 0;
    const scoreColor = isPositive ? 'text-green-500' : 'text-red-500';

    // Calculate stats
    const correctCount = result.answers?.filter(a => a.is_correct).length || 0;
    const totalCount = result.answers?.length || 0;
    const answeredCount = result.answers?.filter(a => a.selected_option_id !== null).length || 0;
    const skippedCount = totalCount - answeredCount;
    const incorrectCount = answeredCount - correctCount;

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Hero Score Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-8 relative overflow-hidden">
                {result.timed_out && (
                    <span className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        Timed Out
                    </span>
                )}
                
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">
                    Final Score
                </h2>
                <div className={`text-7xl font-black mb-4 ${scoreColor}`}>
                    {result.score}
                </div>
                
                {/* Stats Row */}
                <div className="flex justify-center gap-6 mt-8">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">{correctCount}</div>
                        <div className="text-xs font-medium text-gray-500 uppercase">Correct</div>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-500">{incorrectCount}</div>
                        <div className="text-xs font-medium text-gray-500 uppercase">Incorrect</div>
                    </div>
                    <div className="w-px bg-gray-200"></div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-400">{skippedCount}</div>
                        <div className="text-xs font-medium text-gray-500 uppercase">Skipped</div>
                    </div>
                </div>
            </div>

            {/* Questions Breakdown */}
            <h3 className="text-xl font-bold text-gray-900 mb-6">Question Breakdown</h3>
            <div className="space-y-4 mb-8">
                {result.answers?.map((ans, idx) => {
                    const isCorrect = ans.is_correct;
                    const isSkipped = ans.selected_option_id === null;

                    let statusColor = 'bg-gray-50 border-gray-200';
                    let icon = null;

                    if (isSkipped) {
                        statusColor = 'bg-gray-50 border-gray-200';
                        icon = <span className="text-gray-400 font-bold block w-6 text-center">—</span>;
                    } else if (isCorrect) {
                        statusColor = 'bg-green-50 border-green-200';
                        icon = (
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        );
                    } else {
                        statusColor = 'bg-red-50 border-red-200';
                        icon = (
                            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        );
                    }

                    return (
                        <div key={ans.id || idx} className={`rounded-xl border p-5 flex gap-4 ${statusColor}`}>
                            <div className="flex-shrink-0 pt-1">
                                {icon}
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-semibold text-gray-900 mb-3">
                                    <span className="text-gray-500 mr-2">{idx + 1}.</span> 
                                    {ans.question?.question_text || "Unknown Question"}
                                </h4>
                                
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-start">
                                        <span className="font-medium text-gray-500 w-24 flex-shrink-0">Your Answer:</span>
                                        <span className={`font-medium ${isSkipped ? 'text-gray-500' : isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                            {isSkipped ? 'Skipped' : ans.selected_option?.option_text}
                                        </span>
                                    </div>
                                    
                                    {!isCorrect && !isSkipped && (
                                        <div className="flex items-start">
                                            <span className="font-medium text-gray-500 w-24 flex-shrink-0">Correct:</span>
                                            <span className="font-medium text-green-700">
                                                {ans.question?.options?.find(o => o.is_correct)?.option_text}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/quizzes"
                    className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 shadow-sm transition"
                >
                    Play Again
                </Link>
                <Link
                    to="/leaderboard"
                    className="inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-sm transition"
                >
                    View Leaderboard
                </Link>
            </div>
        </div>
    );
}
