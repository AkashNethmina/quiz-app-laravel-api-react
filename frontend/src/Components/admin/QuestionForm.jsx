import { useState, useEffect } from 'react';
import axios from '../../lib/axios';

export default function QuestionForm({ quizId, existingQuestion, onSuccess, onCancel }) {
    const isEditMode = !!existingQuestion;

    const [type, setType] = useState('mcq');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState([
        { tempId: 1, text: '', is_correct: true },
        { tempId: 2, text: '', is_correct: false },
    ]);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (existingQuestion) {
            setType(existingQuestion.type || 'mcq');
            setQuestionText(existingQuestion.question_text || '');

            if (existingQuestion.options && existingQuestion.options.length > 0) {
                setOptions(existingQuestion.options.map((opt, idx) => ({
                    id: opt.id, // Real ID from DB
                    tempId: Date.now() + idx, // fallback for key
                    text: opt.option_text,
                    is_correct: opt.is_correct
                })));
            } else if (existingQuestion.type === 'true_false') {
                setOptions([
                    { tempId: 1, text: 'True', is_correct: true },
                    { tempId: 2, text: 'False', is_correct: false },
                ]);
            }
        } else {
            // New Question Defaults
            if (type === 'true_false') {
                setOptions([
                    { tempId: 1, text: 'True', is_correct: true },
                    { tempId: 2, text: 'False', is_correct: false },
                ]);
            }
        }
    }, [existingQuestion, type]);

    const handleTypeSwitch = (newType) => {
        if (type === newType) return;
        setType(newType);
        if (newType === 'true_false') {
            setOptions([
                { tempId: 1, text: 'True', is_correct: true },
                { tempId: 2, text: 'False', is_correct: false },
            ]);
        } else {
            setOptions([
                { tempId: 1, text: '', is_correct: true },
                { tempId: 2, text: '', is_correct: false },
            ]);
        }
    };

    // MCQ dynamic handlers
    const addOption = () => {
        if (options.length >= 6) return;
        setOptions(prev => [...prev, { tempId: Date.now(), text: '', is_correct: false }]);
    };

    const removeOption = (idx) => {
        if (options.length <= 2) return;
        const newOptions = [...options];
        const removed = newOptions.splice(idx, 1)[0];
        // Ensure at least one true option
        if (removed.is_correct) {
            newOptions[0].is_correct = true;
        }
        setOptions(newOptions);
    };

    const updateOptionText = (idx, text) => {
        const newOptions = [...options];
        newOptions[idx].text = text;
        setOptions(newOptions);
    };

    const setCorrectOption = (idx) => {
        setOptions(prev => prev.map((opt, i) => ({
            ...opt,
            is_correct: i === idx
        })));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validate
        if (!questionText.trim()) {
            setErrors({ question_text: ["Question text is required."] });
            return;
        }

        const validOptions = options.every(opt => opt.text.trim() !== '');
        if (!validOptions) {
            setErrors({ general: ["All options must have text."] });
            return;
        }

        const hasCorrect = options.some(opt => opt.is_correct);
        if (!hasCorrect) {
            setErrors({ general: ["Exactly one option must be marked as correct."] });
            return;
        }

        setIsSubmitting(true);

        const payload = {
            question_text: questionText,
            type: type,
            options: options.map(opt => ({
                id: opt.id, // will be undefined for new options, which backend should handle for updates if implemented
                option_text: opt.text,
                is_correct: opt.is_correct
            }))
        };

        try {
            if (isEditMode) {
                await axios.put(`/api/admin/questions/${existingQuestion.id}`, payload);
            } else {
                await axios.post(`/api/admin/quizzes/${quizId}/questions`, payload);
            }
            onSuccess();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                setErrors({ general: ['Failed to save question.'] });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                    {isEditMode ? 'Edit Question' : 'Add New Question'}
                </h3>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>

            {errors.general && (
                <div className="mb-6 bg-red-50 border border-red-200 text-sm text-red-600 rounded-lg p-3">
                    {errors.general[0]}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type Tab Selector */}
                <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                    <button
                        type="button"
                        onClick={() => handleTypeSwitch('mcq')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${type === 'mcq' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        Multiple Choice
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTypeSwitch('true_false')}
                        className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${type === 'true_false' ? 'bg-white shadow-sm text-primary-700' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                        True / False
                    </button>
                </div>

                {/* Question Body */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Question Body <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        required
                        rows="3"
                        placeholder="What is the output of typeof null in JavaScript?"
                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                    />
                    {errors.question_text && <p className="mt-1 text-xs text-red-500">{errors.question_text[0]}</p>}
                </div>

                {/* Options mapping */}
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                        Options <span className="text-red-500">*</span>
                    </label>

                    {type === 'true_false' ? (
                        <div className="flex gap-4">
                            {options.map((opt, idx) => (
                                <button
                                    key={opt.tempId}
                                    type="button"
                                    onClick={() => setCorrectOption(idx)}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all font-bold text-center ${opt.is_correct
                                        ? 'border-primary-600 bg-primary-50 text-primary-700 drop-shadow-sm'
                                        : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <span className="block mb-2">{opt.text}</span>
                                    {opt.is_correct && <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">✓ Correct</span>}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {options.map((opt, idx) => (
                                <div key={opt.tempId} className={`flex items-center gap-3 p-3 border rounded-xl transition ${opt.is_correct ? 'border-primary-300 bg-primary-50' : 'border-gray-200 bg-white'}`}>
                                    {/* Correct Radio */}
                                    <div className="flex items-center justify-center p-2 cursor-pointer" onClick={() => setCorrectOption(idx)}>
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${opt.is_correct ? 'border-primary-600' : 'border-gray-300'}`}>
                                            {opt.is_correct && <div className="w-2.5 h-2.5 rounded-full bg-primary-600"></div>}
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        value={opt.text}
                                        onChange={(e) => updateOptionText(idx, e.target.value)}
                                        required
                                        placeholder={`Option ${idx + 1}`}
                                        className="flex-grow border-none bg-transparent focus:outline-none text-sm font-medium text-gray-800 placeholder-gray-400"
                                    />

                                    {options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(idx)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition"
                                            title="Remove Option"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}

                            {options.length < 6 && (
                                <button
                                    type="button"
                                    onClick={addOption}
                                    className="text-sm font-medium text-primary-600 hover:text-primary-800 transition flex items-center mt-2 px-2"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Add Option
                                </button>
                            )}
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition shadow-sm"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Question'}
                    </button>
                </div>
            </form>
        </div>
    );
}
