import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../lib/axios';
import QuestionForm from '../../components/admin/QuestionForm';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';

export default function AdminQuestions() {
    const { id: quizId } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // UI states
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingQuestionId, setEditingQuestionId] = useState(null);

    // Delete Modal
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchQuizAndQuestions = async () => {
        setLoading(true);
        try {
            // Assumes this endpoint loads related questions inherently based on standard Laravel resource design.
            const res = await axios.get(`/api/admin/quizzes/${quizId}`);
            const data = res.data.data ?? res.data;
            setQuiz(data);
            setQuestions(data.questions || []);
        } catch (error) {
            console.error("Failed to load questions", error);
            alert("Error loading quiz questions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizAndQuestions();
    }, [quizId]);

    const handleFormSuccess = () => {
        setShowAddForm(false);
        setEditingQuestionId(null);
        fetchQuizAndQuestions();
    };

    const confirmDelete = (questionId) => {
        setDeleteModal({ isOpen: true, id: questionId });
    };

    const executeDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/admin/questions/${deleteModal.id}`);
            setQuestions(prev => prev.filter(q => q.id !== deleteModal.id));
            setDeleteModal({ isOpen: false, id: null });
        } catch (error) {
            console.error('Failed to delete question', error);
            alert('Failed to delete question.');
        } finally {
            setIsDeleting(false);
        }
    };

    const moveQuestion = (index, direction) => {
        const newQuestions = [...questions];
        if (direction === 'up' && index > 0) {
            [newQuestions[index - 1], newQuestions[index]] = [newQuestions[index], newQuestions[index - 1]];
        } else if (direction === 'down' && index < newQuestions.length - 1) {
            [newQuestions[index + 1], newQuestions[index]] = [newQuestions[index], newQuestions[index + 1]];
        }
        setQuestions(newQuestions);
        // Note: As per request, "update order locally, no API call needed" unless specified. 
        // In a real app we'd dispatch a patch.
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <Link to="/admin/quizzes" className="text-sm font-medium text-primary-600 hover:text-primary-800 mb-2 inline-flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Quizzes
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{quiz?.title}</h1>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path>
                            </svg>
                            {questions.length} Questions
                        </span>
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {quiz?.time_limit}s Time Limit
                        </span>
                    </div>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => { setShowAddForm(true); setEditingQuestionId(null); }}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition shadow-sm flex items-center justify-center shrink-0"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Add Question
                    </button>
                )}
            </div>

            {/* Add New Question Form Overlay */}
            {showAddForm && (
                <QuestionForm 
                    quizId={quizId} 
                    onSuccess={handleFormSuccess} 
                    onCancel={() => setShowAddForm(false)} 
                />
            )}

            {/* Existing Questions List */}
            {questions.length === 0 && !showAddForm ? (
                <EmptyState 
                    message="No questions have been attached to this quiz." 
                    actionLabel="Add First Question"
                    onAction={() => setShowAddForm(true)}
                />
            ) : (
                <div className="space-y-4">
                    {questions.map((q, index) => (
                        <div key={q.id}>
                            {editingQuestionId === q.id ? (
                                <QuestionForm 
                                    quizId={quizId}
                                    existingQuestion={q}
                                    onSuccess={handleFormSuccess}
                                    onCancel={() => setEditingQuestionId(null)}
                                />
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex gap-4 transition hover:border-primary-100">
                                    <div className="flex flex-col items-center gap-1 text-gray-400">
                                        <button 
                                            onClick={() => moveQuestion(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 hover:text-primary-600 disabled:opacity-30 transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                                        </button>
                                        <span className="text-sm font-medium">{index + 1}</span>
                                        <button 
                                            onClick={() => moveQuestion(index, 'down')}
                                            disabled={index === questions.length - 1}
                                            className="p-1 hover:text-primary-600 disabled:opacity-30 transition"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </button>
                                    </div>
                                    
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mb-2 ${q.type === 'mcq' ? 'bg-primary-50 text-primary-700' : 'bg-purple-50 text-purple-700'}`}>
                                                    {q.type === 'mcq' ? 'Multiple Choice' : 'True/False'}
                                                </span>
                                                <p className="font-semibold text-gray-900">{q.question_text}</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => { setEditingQuestionId(q.id); setShowAddForm(false); }}
                                                    className="px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(q.id)}
                                                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2 mt-4 pl-2 border-l-2 border-gray-100">
                                            {q.options && q.options.map(opt => (
                                                <div key={opt.id} className="flex items-center text-sm">
                                                    <span className={`w-4 h-4 mr-2 rounded-full border flex items-center justify-center shrink-0 ${opt.is_correct ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                                                        {opt.is_correct && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                                    </span>
                                                    <span className={opt.is_correct ? 'font-medium text-green-700 block mt-0.5' : 'text-gray-600 block mt-0.5'}>
                                                        {opt.option_text}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <ConfirmDialog 
                isOpen={deleteModal.isOpen}
                title="Delete Question"
                message="Are you sure you want to delete this question? This action cannot be undone."
                onConfirm={executeDelete}
                onCancel={() => setDeleteModal({ isOpen: false, id: null })}
                isLoading={isDeleting}
            />
        </div>
    );
}
