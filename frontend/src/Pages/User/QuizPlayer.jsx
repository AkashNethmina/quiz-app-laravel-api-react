import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from '../../lib/axios';
import QuizTimer from '../../components/quiz/QuizTimer';
import PrimaryButton from '../../Components/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton';

export default function QuizPlayer() {
    const location = useLocation();
    const navigate = useNavigate();
    const { id: quizId } = useParams();

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
                const confirm = window.confirm("Submit quiz? Unanswered questions score 0.");
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];
    const isAnswered = (qIndex) => answers[questions[qIndex].id] !== undefined;

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header / Timer */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-900">Quiz Player</h1>
                {expiresAt && (
                    <QuizTimer expiresAt={expiresAt} onExpire={() => handleSubmit(true)} />
                )}
            </div>

            {/* Answered Dots */}
            <div className="flex flex-wrap gap-2 mb-6">
                {questions.map((q, idx) => (
                    <button
                        key={q.id}
                        onClick={() => setCurrentIndex(idx)}
                        disabled={isSubmitting}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition ${
                            currentIndex === idx
                                ? 'ring-2 ring-primary-600 ring-offset-2'
                                : ''
                        } ${
                            isAnswered(idx)
                                ? 'bg-primary-600 text-white'
                                : 'bg-gray-200 text-gray-600'
                        }`}
                    >
                        {idx + 1}
                    </button>
                ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-6 relative">
                {isSubmitting && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-xl">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    </div>
                )}
                
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                    Question {currentIndex + 1} of {questions.length}
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-8">
                    {currentQ.question_text}
                </h2>

                {/* Options */}
                {currentQ.type === 'mcq' ? (
                    <div className="space-y-3">
                        {currentQ.options.map(opt => {
                            const isSelected = answers[currentQ.id] === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    onClick={() => handleAnswerSelect(opt.id)}
                                    disabled={isSubmitting}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                                        isSelected
                                            ? 'border-primary-600 bg-primary-50'
                                            : 'border-gray-100 bg-white hover:border-primary-200 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                                            isSelected ? 'border-primary-600' : 'border-gray-300'
                                        }`}>
                                            {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary-600"></div>}
                                        </div>
                                        <span className={`text-base font-medium ${isSelected ? 'text-primary-900' : 'text-gray-700'}`}>
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
                                    className={`p-6 rounded-xl border-2 text-lg font-bold transition-all flex flex-col items-center justify-center gap-2 ${
                                        isSelected
                                            ? 'border-primary-600 bg-primary-600 text-white'
                                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-primary-200'
                                    }`}
                                >
                                    {opt.option_text}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
                <SecondaryButton
                    onClick={handlePrev}
                    disabled={currentIndex === 0 || isSubmitting}
                    className="px-6 py-3"
                >
                    Previous
                </SecondaryButton>
                
                <PrimaryButton
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="px-6 py-3"
                >
                    {currentIndex === questions.length - 1 ? 'Submit Quiz' : 'Next'}
                </PrimaryButton>
            </div>
        </div>
    );
}
