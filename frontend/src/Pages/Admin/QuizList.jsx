import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../lib/axios';
import LoadingSkeleton from '../../Components/ui/LoadingSkeleton';
import EmptyState from '../../Components/ui/EmptyState';
import ConfirmDialog from '../../Components/ui/ConfirmDialog';
import { Plus, Edit, Settings, Trash2, Clock, HelpCircle } from 'lucide-react';

export default function AdminQuizList() {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Status Toggles
    const [togglingId, setTogglingId] = useState(null);

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, quizId: null, quizTitle: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();

    const fetchQuizzes = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/quizzes');
            setQuizzes(res.data.data || []);
        } catch (error) {
            console.error("Failed to load admin quizzes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handlePublishToggle = async (id, isCurrentlyPublished) => {
        setTogglingId(id);
        try {
            await axios.patch(`/api/admin/quizzes/${id}/publish`, {
                is_published: !isCurrentlyPublished
            });
            setQuizzes(prev => prev.map(q => q.id === id ? { ...q, is_published: !isCurrentlyPublished } : q));
        } catch (error) {
            console.error("Failed to toggle publish status", error);
            alert("Error updating publish status.");
        } finally {
            setTogglingId(null);
        }
    };

    const confirmDelete = (id, title) => {
        setDeleteModal({ isOpen: true, quizId: id, quizTitle: title });
    };

    const executeDelete = async () => {
        setIsDeleting(true);
        try {
            await axios.delete(`/api/admin/quizzes/${deleteModal.quizId}`);
            setQuizzes(prev => prev.filter(q => q.id !== deleteModal.quizId));
            setDeleteModal({ isOpen: false, quizId: null, quizTitle: '' });
        } catch (error) {
            console.error("Failed to delete quiz", error);
            alert("Error deleting quiz.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manage Quizzes</h1>
                    <p className="text-gray-500 text-xs mt-1">Create, edit, build questions, and toggle publishing states.</p>
                </div>
                <div>
                    <button
                        onClick={() => navigate('/admin/quizzes/create')}
                        className="inline-flex items-center justify-center gap-1.5 bg-primary-600 hover:bg-primary-500 active:scale-[0.98] text-white px-5 py-2.5 rounded-lg text-xs font-semibold shadow-sm transition-all duration-200"
                    >
                        <Plus className="w-4 h-4" />
                        Create Quiz
                    </button>
                </div>
            </div>

            {/* Content Display Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-w-full">
                {loading ? (
                    <LoadingSkeleton type="table" rows={5} />
                ) : quizzes.length === 0 ? (
                    <EmptyState 
                        message="No quizzes engineered yet. Get started by drafting one." 
                        actionLabel="Create Quiz" 
                        onAction={() => navigate('/admin/quizzes/create')}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50">
                                <tr className="border-b border-gray-100 text-[10px] uppercase font-bold text-gray-400">
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Questions</th>
                                    <th className="px-6 py-4 text-center">Time Limit</th>
                                    <th className="px-6 py-4 text-right pr-6">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {quizzes.map(quiz => (
                                    <tr key={quiz.id} className="hover:bg-slate-50/40 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900 text-sm">{quiz.title}</div>
                                            {quiz.description && (
                                                <div className="text-xs text-gray-400 font-medium truncate max-w-xs mt-0.5">
                                                    {quiz.description}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {quiz.is_published ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    Published
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/50">
                                                    Draft
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                                                <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                                                {quiz.questions_count || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                                                <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                {quiz.time_limit}s
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-3">
                                                {/* Publish Toggle Button */}
                                                <button
                                                    onClick={() => handlePublishToggle(quiz.id, quiz.is_published)}
                                                    disabled={togglingId === quiz.id}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition ${
                                                        quiz.is_published 
                                                        ? 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50' 
                                                        : 'bg-primary-50 border-primary-100 text-primary-700 hover:bg-primary-100'
                                                    }`}
                                                >
                                                    {togglingId === quiz.id ? 'Wait...' : quiz.is_published ? 'Unpublish' : 'Publish'}
                                                </button>

                                                <button
                                                    onClick={() => navigate(`/admin/quizzes/${quiz.id}/edit`)}
                                                    className="px-3 py-1.5 text-xs font-bold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition"
                                                >
                                                    Edit
                                                </button>
                                                
                                                <button
                                                    onClick={() => navigate(`/admin/quizzes/${quiz.id}/questions`)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                                                >
                                                    <Settings className="w-3.5 h-3.5 text-gray-400" />
                                                    Questions
                                                </button>
                                                
                                                <button
                                                    onClick={() => confirmDelete(quiz.id, quiz.title)}
                                                    className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                                                    title="Delete Quiz"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Danger Modal */}
            <ConfirmDialog 
                isOpen={deleteModal.isOpen}
                title="Delete Quiz"
                message={`Are you absolutely sure you want to delete "${deleteModal.quizTitle}"? This will permanently erase the quiz, all its questions, and every user attempt associated with it. This cannot be undone.`}
                onConfirm={executeDelete}
                onCancel={() => setDeleteModal({ isOpen: false, quizId: null, quizTitle: '' })}
                isLoading={isDeleting}
            />
        </div>
    );
}
