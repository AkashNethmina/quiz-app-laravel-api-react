import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../lib/axios';
import QuestionForm from '../../Components/admin/QuestionForm';
import ConfirmDialog from '../../Components/ui/ConfirmDialog';
import EmptyState from '../../Components/ui/EmptyState';
import { ArrowLeft, Plus, ChevronUp, ChevronDown, HelpCircle, Clock, Trash2, CheckCircle2 } from 'lucide-react';

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
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <Link to="/admin/quizzes" className="text-xs font-semibold text-primary-600 hover:text-primary-500 mb-3 inline-flex items-center gap-1">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Quizzes
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{quiz?.title}</h1>
                    <div className="flex items-center gap-3.5 mt-2 text-xs font-semibold text-gray-500">
                        <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                            {questions.length} Questions
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            {quiz?.time_limit}s Time Limit
                        </span>
                    </div>
                </div>
                {!showAddForm && (
                    <button
                        onClick={() => { setShowAddForm(true); setEditingQuestionId(null); }}
                        className="inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-500 active:scale-[0.98] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200 shrink-0"
                    >
                        <Plus className="w-4 h-4" />
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
                                <div className="bg-white rounded-3xl border border-gray-100 p-5 sm:p-6 flex gap-4 transition hover:shadow-sm hover:border-primary-100/60">
                                    {/* Sort Controls */}
                                    <div className="flex flex-col items-center gap-0.5 text-gray-400 select-none shrink-0 justify-center">
                                        <button 
                                            onClick={() => moveQuestion(index, 'up')}
                                            disabled={index === 0}
                                            className="p-1 hover:text-primary-600 disabled:opacity-30 transition"
                                            title="Move Up"
                                        >
                                            <ChevronUp className="w-5 h-5" />
                                        </button>
                                        <span className="text-xs font-bold text-gray-900 bg-slate-50 border border-slate-100 w-6 h-6 rounded-full flex items-center justify-center">{index + 1}</span>
                                        <button 
                                            onClick={() => moveQuestion(index, 'down')}
                                            disabled={index === questions.length - 1}
                                            className="p-1 hover:text-primary-600 disabled:opacity-30 transition"
                                            title="Move Down"
                                        >
                                            <ChevronDown className="w-5 h-5" />
                                        </button>
                                    </div>
                                    
                                    {/* Main Question Body */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${q.type === 'mcq' ? 'bg-primary-50 text-primary-700' : 'bg-purple-50 text-purple-700'}`}>
                                                    {q.type === 'mcq' ? 'Multiple Choice' : 'True/False'}
                                                </span>
                                                <h4 className="font-semibold text-gray-900 leading-snug">{q.question_text}</h4>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => { setEditingQuestionId(q.id); setShowAddForm(false); }}
                                                    className="px-3 py-1.5 text-xs font-bold text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(q.id)}
                                                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                                                    title="Delete Question"
                                                >
                                                    <Trash2 className="w-4.5 h-4.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Question Options */}
                                        <div className="space-y-2 pl-3 border-l border-gray-100 text-xs">
                                            {q.options && q.options.map(opt => (
                                                <div key={opt.id} className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${opt.is_correct ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-200'}`}>
                                                        {opt.is_correct && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                                                    </div>
                                                    <span className={`font-semibold ${opt.is_correct ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
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
