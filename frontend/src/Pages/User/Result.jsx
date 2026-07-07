import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../lib/axios';
import { Award, CheckCircle2, XCircle, AlertCircle, RefreshCw, Trophy, ArrowRight } from 'lucide-react';

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
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm max-w-md mx-auto mt-10">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-sm font-semibold text-gray-900">Result not found</h3>
                <p className="text-xs text-gray-500 mt-1">We couldn't load the statistics for this attempt.</p>
                <Link to="/dashboard" className="text-xs font-semibold text-primary-600 hover:text-primary-500 inline-block mt-4">
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const correctCount = result.answers?.filter(a => a.is_correct).length || 0;
    const totalCount = result.answers?.length || 0;
    const answeredCount = result.answers?.filter(a => a.selected_option_id !== null).length || 0;
    const skippedCount = totalCount - answeredCount;
    const incorrectCount = answeredCount - correctCount;

    // Celebration message
    let message = "Keep learning and try again!";
    let pct = totalCount > 0 ? (correctCount / totalCount) * 100 : 0;
    if (pct === 100) {
        message = "Perfect score! Outstanding achievement!";
    } else if (pct >= 80) {
        message = "Excellent work! You have a great understanding!";
    } else if (pct >= 50) {
        message = "Good job! You're making solid progress!";
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            {/* Score Summary Celebration Block */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm text-center relative overflow-hidden flex flex-col items-center">
                {result.timed_out && (
                    <span className="absolute top-4 right-4 bg-rose-50 border border-rose-100 text-rose-700 text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        Timed Out
                    </span>
                )}
                
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
                    <Award className="w-9 h-9" />
                </div>

                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Attempt Completed</span>
                <h1 className="text-xl font-bold text-gray-900 mb-2">{message}</h1>
                
                {/* Circular / Large Score Badge */}
                <div className="my-6 relative flex items-center justify-center">
                    <div className="text-6xl font-black bg-gradient-to-r from-primary-600 to-emerald-500 bg-clip-text text-transparent">
                        {result.score}
                    </div>
                </div>

                {/* Score Ratio details */}
                <p className="text-xs text-gray-400 font-semibold mb-6">
                    You answered <span className="text-gray-900 font-bold">{correctCount}</span> out of <span className="text-gray-900 font-bold">{totalCount}</span> questions correctly
                </p>
                
                {/* Stats cards grid */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-md pt-6 border-t border-gray-50">
                    <div className="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl">
                        <span className="text-lg font-black text-emerald-600 block leading-none mb-1">{correctCount}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Correct</span>
                    </div>
                    <div className="p-3 bg-rose-50/50 border border-rose-100/50 rounded-xl">
                        <span className="text-lg font-black text-rose-600 block leading-none mb-1">{incorrectCount}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Incorrect</span>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                        <span className="text-lg font-black text-slate-500 block leading-none mb-1">{skippedCount}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Skipped</span>
                    </div>
                </div>
            </div>

            {/* Questions Breakdown */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <h3 className="text-base font-bold text-gray-900">Question Review</h3>
                    <span className="text-xs text-gray-400 font-semibold">{totalCount} Questions</span>
                </div>

                <div className="space-y-4">
                    {result.answers?.map((ans, idx) => {
                        const isCorrect = ans.is_correct;
                        const isSkipped = ans.selected_option_id === null;

                        return (
                            <div key={ans.id || idx} className={`rounded-2xl border bg-white p-5 flex gap-4 transition-all hover:shadow-sm ${
                                isSkipped 
                                    ? 'border-slate-100' 
                                    : isCorrect 
                                        ? 'border-emerald-100/80 hover:border-emerald-200' 
                                        : 'border-rose-100/80 hover:border-rose-200'
                            }`}>
                                <div className="shrink-0 pt-0.5">
                                    {isSkipped ? (
                                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs">—</div>
                                    ) : isCorrect ? (
                                        <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-rose-500 shrink-0" />
                                    )}
                                </div>

                                <div className="flex-1 space-y-3.5">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Question {idx + 1}</span>
                                        <h4 className="text-sm font-bold text-gray-900 leading-relaxed">
                                            {ans.question?.question_text || "Unknown Question"}
                                        </h4>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-50">
                                        <div>
                                            <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Your Choice</span>
                                            <span className={`font-semibold ${isSkipped ? 'text-slate-400' : isCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                                                {isSkipped ? 'Skipped Question' : ans.selected_option?.option_text}
                                            </span>
                                        </div>
                                        
                                        {!isCorrect && (
                                            <div>
                                                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Correct Answer</span>
                                                <span className="font-semibold text-emerald-700">
                                                    {ans.question?.options?.find(o => o.is_correct)?.option_text || 'None'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link
                    to="/quizzes"
                    className="inline-flex justify-center items-center gap-1.5 px-6 py-3 bg-primary-600 hover:bg-primary-500 active:scale-[0.98] text-white rounded-xl text-sm font-semibold shadow-md shadow-primary-600/10 transition-all duration-200"
                >
                    <RefreshCw className="w-4 h-4" />
                    Play Another Quiz
                </Link>
                <Link
                    to="/leaderboard"
                    className="inline-flex justify-center items-center gap-1.5 px-6 py-3 bg-white border border-gray-200 hover:bg-gray-50 active:scale-[0.98] text-gray-700 rounded-xl text-sm font-semibold shadow-sm transition-all duration-200"
                >
                    <Trophy className="w-4 h-4 text-emerald-500" />
                    View Leaderboard
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                </Link>
            </div>
        </div>
    );
}
