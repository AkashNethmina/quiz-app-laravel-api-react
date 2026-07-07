import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import QuizTimer from '../../Components/quiz/QuizTimer';
import PrimaryButton from '../../Components/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton';
import { ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export default function QuizPlayer() {
    const location = useLocation();
    const navigate = useNavigate();

    const [attemptId, setAttemptId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [expiresAt, setExpiresAt] = useState(null);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchState = () => {
            const stateAttemptId = location.state?.attemptId;
            const attemptData = location.state?.attemptData;

            if (!stateAttemptId || !attemptData) {
                navigate('/quizzes', { replace: true });
                return;
            }

            setAttemptId(stateAttemptId);
            setQuestions(attemptData.questions || []);
            setExpiresAt(attemptData.expires_at || null);
        };

        fetchState();
    }, [location.state, navigate]);

    const handleAnswerSelect = (optionId) => {
        if (isSubmitting) return;
        const qId = questions[currentIndex].id;
        setAnswers(prev => ({ ...prev, [qId]: optionId }));
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            handleSubmit(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const formatAnswersForApi = () => {
        return Object.entries(answers).map(([question_id, option_id]) => ({
            question_id: parseInt(question_id),
            option_id: parseInt(option_id),
        }));
    };

    const handleSubmit = async (isAutoSubmit = false) => {
        if (isSubmitting) return;

        if (!isAutoSubmit) {
            const answeredCount = Object.keys(answers).length;
            if (answeredCount < questions.length) {
                const confirm = window.confirm(`You've answered ${answeredCount}/${questions.length} questions. Submit quiz now?`);
                if (!confirm) return;
            } else {
                const confirm = window.confirm("Are you ready to submit your answers?");
                if (!confirm) return;
            }
        }

        setIsSubmitting(true);
        try {
            const formattedAnswers = formatAnswersForApi();
            await axios.post(`/api/attempts/${attemptId}/submit`, {
                answers: formattedAnswers
            });
            navigate(`/attempts/${attemptId}/result`, { replace: true });
        } catch (error) {
            console.error("Failed to submit quiz", error);
            alert("Error submitting quiz. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (!questions.length) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const isAnswered = (qIndex) => answers[questions[qIndex].id] !== undefined;

    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            {/* Header / Timer */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center justify-between">
                <div className="space-y-0.5">
                    <h1 className="text-base font-bold text-gray-900">Quiz In Progress</h1>
                    <p className="text-xs text-gray-400 font-semibold">Answer all questions to finalize your attempt</p>
                </div>
                {expiresAt && (
                    <QuizTimer expiresAt={expiresAt} onExpire={() => handleSubmit(true)} />
                )}
            </div>

            {/* Answered Dots Selector */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Question Status Map</span>
                <div className="flex flex-wrap gap-2">
                    {questions.map((q, idx) => {
                        const active = currentIndex === idx;
                        const answered = isAnswered(idx);
                        return (
                            <button
                                key={q.id}
                                onClick={() => setCurrentIndex(idx)}
                                disabled={isSubmitting}
                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-all ${
                                    active
                                        ? 'ring-2 ring-primary-600 ring-offset-2 bg-primary-600 text-white shadow-sm'
                                        : answered
                                            ? 'bg-primary-100 text-primary-800 border border-primary-200'
                                            : 'bg-slate-50 border border-slate-200/60 text-gray-500 hover:bg-slate-100'
                                }`}
                            >
                                {idx + 1}
                            </button>
                        );
                    })}
                </div>

                {/* Smooth Progress Bar */}
                <div className="pt-2">
                    <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-primary-500 to-emerald-500 h-2 rounded-full transition-all duration-300 shadow-sm shadow-primary-500/10"
                            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                {isSubmitting && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent mb-3"></div>
                        <p className="text-sm font-bold text-gray-700">Submitting your answers...</p>
                    </div>
                )}
                
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest">
                        Question {currentIndex + 1} of {questions.length}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-50 border border-slate-100 text-gray-500">
                        {currentQ.type === 'mcq' ? 'Multiple Choice' : 'True/False'}
                    </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-8 leading-snug">
                    {currentQ.question_text}
                </h2>

                {/* Options Layout */}
                {currentQ.type === 'mcq' ? (
                    <div className="space-y-3">
                        {currentQ.options.map(opt => {
                            const isSelected = answers[currentQ.id] === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswerSelect(opt.id)}
                                    disabled={isSubmitting}
                                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${
                                        isSelected
                                            ? 'border-primary-500 bg-primary-50/50 shadow-sm shadow-primary-500/5'
                                            : 'border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                                            isSelected ? 'border-primary-600 bg-primary-600 text-white' : 'border-gray-300 bg-white'
                                        }`}>
                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                        </div>
                                        <span className={`text-sm font-semibold leading-relaxed ${isSelected ? 'text-primary-950' : 'text-gray-700'}`}>
                                            {opt.option_text}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {currentQ.options.map(opt => {
                            const isSelected = answers[currentQ.id] === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswerSelect(opt.id)}
                                    disabled={isSubmitting}
                                    className={`p-6 rounded-2xl border-2 text-base font-bold transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
                                        isSelected
                                            ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm shadow-primary-500/5'
                                            : 'border-slate-100 bg-white text-gray-700 hover:bg-slate-50 hover:border-slate-300'
                                    }`}
                                >
                                    <span className="text-sm font-bold uppercase tracking-wider">{opt.option_text}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
                <SecondaryButton
                    onClick={handlePrev}
                    disabled={currentIndex === 0 || isSubmitting}
                    className="px-5 py-2.5 flex items-center gap-1.5"
                >
                    <ChevronLeft className="w-4.5 h-4.5" />
                    Previous
                </SecondaryButton>
                
                <PrimaryButton
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 flex items-center gap-1.5"
                >
                    {currentIndex === questions.length - 1 ? 'Submit Quiz' : 'Next'}
                    {currentIndex !== questions.length - 1 && <ChevronRight className="w-4.5 h-4.5" />}
                </PrimaryButton>
            </div>
        </div>
    );
}
